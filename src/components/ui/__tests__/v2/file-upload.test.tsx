import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "../../v2/file-upload";
const csv = () => new File(["test"], "contacts.csv", { type: "text/csv" });
it("accepts a file selected with the native input", async () => {
  const change = vi.fn();
  render(<FileUpload label="Contacts" accept=".csv" onFilesChange={change} />);
  await userEvent.setup().upload(screen.getByLabelText("Contacts"), csv());
  expect(change).toHaveBeenCalledWith([
    expect.objectContaining({ name: "contacts.csv" }),
  ]);
  expect(screen.getByText("contacts.csv")).toBeInTheDocument();
});
it("rejects invalid dropped files and reports the reason", () => {
  const reject = vi.fn(),
    change = vi.fn();
  render(<FileUpload accept=".csv" onReject={reject} onFilesChange={change} />);
  fireEvent.drop(
    screen.getByRole("button", { name: "Choose upload files" }).parentElement!,
    {
      dataTransfer: {
        files: [new File(["png"], "picture.png", { type: "image/png" })],
      },
    }
  );
  expect(change).not.toHaveBeenCalled();
  expect(reject).toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("File type not accepted");
});
it("rejects files over the size limit", async () => {
  render(<FileUpload maxSize={2} />);
  await userEvent.setup().upload(screen.getByLabelText("Upload files"), csv());
  expect(screen.getByRole("alert")).toHaveTextContent("size limit");
});
it("removes an accepted file", async () => {
  const user = userEvent.setup();
  render(<FileUpload defaultValue={[csv()]} />);
  await user.click(screen.getByRole("button", { name: "Remove contacts.csv" }));
  expect(screen.queryByText("contacts.csv")).not.toBeInTheDocument();
});
it("prevents drop changes while disabled", () => {
  const change = vi.fn();
  const { container } = render(<FileUpload disabled onFilesChange={change} />);
  fireEvent.drop(container.firstChild!, { dataTransfer: { files: [csv()] } });
  expect(change).not.toHaveBeenCalled();
});
it("replaces single selections and deduplicates multiple selections", async () => {
  const user = userEvent.setup();
  const file = csv();
  render(<FileUpload multiple defaultValue={[file]} />);
  await user.upload(screen.getByLabelText("Upload files"), file);
  expect(screen.getAllByText("contacts.csv")).toHaveLength(1);
});

const transfer = (...types: string[]) => ({
  dataTransfer: {
    files: [],
    items: types.map((type) => ({ kind: "file", type })),
  },
});
const zoneOf = () => screen.getByRole("button", { name: /^Choose/ });

it("keeps the drag highlight while the pointer crosses child elements", () => {
  const { container } = render(<FileUpload accept=".csv" />);
  const root = container.firstChild as HTMLElement;
  const zone = zoneOf();
  const icon = zone.firstElementChild as HTMLElement;
  fireEvent.dragEnter(root, transfer("text/csv"));
  fireEvent.dragOver(root, transfer("text/csv"));
  expect(zone).toHaveClass("border-semantic-border-accent");
  // pointer moves root -> zone -> icon: the browser fires dragenter on the new element, then dragleave on the old
  fireEvent.dragEnter(zone, transfer("text/csv"));
  fireEvent.dragLeave(root);
  expect(zone).toHaveClass("border-semantic-border-accent");
  fireEvent.dragEnter(icon, transfer("text/csv"));
  fireEvent.dragLeave(zone);
  expect(zone).toHaveClass("border-semantic-border-accent");
  // leaving the last entered element is a real leave
  fireEvent.dragLeave(icon);
  expect(zone).not.toHaveClass("border-semantic-border-accent");
});

it("clears the highlight and the counter on drop", () => {
  const { container } = render(<FileUpload />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragEnter(root, transfer());
  fireEvent.dragEnter(zoneOf(), transfer());
  fireEvent.dragOver(root, transfer());
  expect(zoneOf()).toHaveClass("border-semantic-border-accent");
  fireEvent.drop(root, { dataTransfer: { files: [] } });
  expect(zoneOf()).not.toHaveClass("border-semantic-border-accent");
  // a fresh drag after the drop starts from zero
  fireEvent.dragEnter(root, transfer());
  fireEvent.dragLeave(root);
  expect(zoneOf()).not.toHaveClass("border-semantic-border-accent");
});

it("tints the drop zone red when every accept rule is a MIME type and the dragged type does not match", () => {
  const { container } = render(<FileUpload accept="image/*,application/pdf" />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragEnter(root, transfer("text/csv"));
  fireEvent.dragOver(root, transfer("text/csv"));
  expect(zoneOf()).toHaveClass(
    "border-semantic-error-primary",
    "bg-semantic-error-surface"
  );
  expect(zoneOf()).not.toHaveClass("motion-safe:scale-[1.01]");
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).toHaveClass(
    "border-semantic-border-accent",
    "motion-safe:scale-[1.01]"
  );
  expect(zoneOf()).not.toHaveClass("bg-semantic-error-surface");
});

it("keeps the neutral highlight when the type cannot prove a mismatch", () => {
  const { container, rerender } = render(<FileUpload accept=".csv" />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).toHaveClass("border-semantic-border-accent");
  rerender(<FileUpload accept="image/*" />);
  fireEvent.dragOver(root, transfer(""));
  expect(zoneOf()).toHaveClass("border-semantic-border-accent");
  rerender(<FileUpload />);
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).not.toHaveClass("bg-semantic-error-surface");
});

it("does not highlight or tint while disabled", () => {
  const { container } = render(<FileUpload disabled accept="image/*" />);
  fireEvent.dragOver(container.firstChild as HTMLElement, transfer("text/csv"));
  expect(zoneOf()).not.toHaveClass("border-semantic-border-accent");
  expect(zoneOf()).not.toHaveClass("border-semantic-error-primary");
});
