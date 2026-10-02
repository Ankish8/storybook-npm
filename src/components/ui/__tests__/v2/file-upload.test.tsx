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
