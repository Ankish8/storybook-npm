import { act, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
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
  expect(zone).toHaveAttribute("data-drag", "over");
  // pointer moves root -> zone -> icon: the browser fires dragenter on the new element, then dragleave on the old
  fireEvent.dragEnter(zone, transfer("text/csv"));
  fireEvent.dragLeave(root);
  expect(zone).toHaveAttribute("data-drag", "over");
  fireEvent.dragEnter(icon, transfer("text/csv"));
  fireEvent.dragLeave(zone);
  expect(zone).toHaveAttribute("data-drag", "over");
  // leaving the last entered element is a real leave
  fireEvent.dragLeave(icon);
  expect(zone).not.toHaveAttribute("data-drag", "over");
});

it("clears the highlight and the counter on drop", () => {
  const { container } = render(<FileUpload />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragEnter(root, transfer());
  fireEvent.dragEnter(zoneOf(), transfer());
  fireEvent.dragOver(root, transfer());
  expect(zoneOf()).toHaveAttribute("data-drag", "over");
  fireEvent.drop(root, { dataTransfer: { files: [] } });
  expect(zoneOf()).not.toHaveAttribute("data-drag", "over");
  // a fresh drag after the drop starts from zero
  fireEvent.dragEnter(root, transfer());
  fireEvent.dragLeave(root);
  expect(zoneOf()).not.toHaveAttribute("data-drag", "over");
});

it("tints the drop zone red when every accept rule is a MIME type and the dragged type does not match", () => {
  const { container } = render(<FileUpload accept="image/*,application/pdf" />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragEnter(root, transfer("text/csv"));
  fireEvent.dragOver(root, transfer("text/csv"));
  expect(zoneOf()).toHaveAttribute("data-drag", "reject");
  expect(zoneOf()).toHaveClass("bg-semantic-error-surface");
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).toHaveAttribute("data-drag", "over");
  expect(zoneOf()).toHaveClass("bg-semantic-brand-surface");
  expect(zoneOf()).not.toHaveClass("bg-semantic-error-surface");
});

it("keeps the neutral highlight when the type cannot prove a mismatch", () => {
  const { container, rerender } = render(<FileUpload accept=".csv" />);
  const root = container.firstChild as HTMLElement;
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).toHaveAttribute("data-drag", "over");
  rerender(<FileUpload accept="image/*" />);
  fireEvent.dragOver(root, transfer(""));
  expect(zoneOf()).toHaveAttribute("data-drag", "over");
  rerender(<FileUpload />);
  fireEvent.dragOver(root, transfer("image/png"));
  expect(zoneOf()).not.toHaveClass("bg-semantic-error-surface");
});

it("does not highlight or tint while disabled", () => {
  const { container } = render(<FileUpload disabled accept="image/*" />);
  fireEvent.dragOver(container.firstChild as HTMLElement, transfer("text/csv"));
  expect(zoneOf()).not.toHaveAttribute("data-drag", "over");
  expect(zoneOf()).not.toHaveAttribute("data-drag", "reject");
});

it("draws the edge as an SVG stroke that closes its dashes while a file is over, and marks errors", () => {
  const { container, rerender } = render(<FileUpload accept=".csv" />);
  const edge = zoneOf().querySelector("svg rect")!;
  expect(edge).toHaveAttribute("pathLength");
  expect(edge.getAttribute("class")).toContain("[stroke-dasharray:1_1]");
  expect(edge.getAttribute("class")).toContain(
    "[button[data-drag]_&]:[stroke-dasharray:2_0]"
  );
  expect(zoneOf()).not.toHaveAttribute("data-invalid");
  rerender(<FileUpload accept=".csv" error="Too big" />);
  expect(zoneOf()).toHaveAttribute("data-invalid", "true");
  expect(screen.getByRole("alert")).toHaveTextContent("Too big");
  expect(container.querySelector("button svg[aria-hidden]")).toBeTruthy();
});

it("lists files in Arc rows with a size in the Arc format", () => {
  render(
    <FileUpload
      defaultValue={[
        new File([new Uint8Array(2048)], "report.csv", { type: "text/csv" }),
      ]}
    />
  );
  expect(screen.getByText("2 KB")).toBeInTheDocument();
  expect(screen.getByText("report.csv")).toHaveClass("font-medium", "truncate");
});

// ---------------------------------------------------------------------------
// Uploads: progress, failure and retry
// ---------------------------------------------------------------------------
const pdf = (name = "brief.pdf") =>
  new File([new Uint8Array(2048)], name, {
    type: "application/pdf",
    lastModified: 7,
  });
const png = (name = "photo.png") =>
  new File([new Uint8Array(4096)], name, {
    type: "image/png",
    lastModified: 9,
  });

describe("uploads", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uploads each added file and shows its progress, then Uploaded", async () => {
    vi.useFakeTimers();
    let report: (percent: number) => void = () => {};
    let finish: () => void = () => {};
    const onUpload = vi.fn(
      (_item, options) =>
        new Promise<void>((resolve) => {
          report = options.onProgress;
          finish = resolve;
        })
    );
    render(<FileUpload multiple onUpload={onUpload} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Upload files"), {
        target: { files: [pdf()] },
      });
    });

    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(onUpload.mock.calls[0][0]).toMatchObject({
      name: "brief.pdf",
      size: 2048,
      status: "uploading",
      progress: 0,
    });
    const bar = screen.getByRole("progressbar", {
      name: "Uploading brief.pdf",
    });
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("Uploading 0%")).toBeInTheDocument();

    await act(async () => report(40));
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("Uploading 40%")).toBeInTheDocument();
    // progress never runs backwards
    await act(async () => report(25));
    expect(bar).toHaveAttribute("aria-valuenow", "40");

    await act(async () => finish());
    // the bar reads 100% first, then the label turns to Uploaded
    expect(screen.getByText("Uploading 100%")).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.queryByText(/^Uploading/)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("brief.pdf uploaded");
  });

  it("shows the failure reason, offers Retry and uploads again from zero", async () => {
    const onUpload = vi
      .fn()
      .mockRejectedValueOnce(new Error("Connection lost"))
      .mockResolvedValueOnce(undefined);
    render(<FileUpload multiple onUpload={onUpload} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Upload files"), {
        target: { files: [pdf()] },
      });
    });

    expect(await screen.findByText("Connection lost")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "brief.pdf failed. Connection lost"
    );
    const retry = screen.getByRole("button", { name: "Retry brief.pdf" });
    expect(retry).toBeEnabled();
    expect(retry).toHaveAttribute("tabindex", "0");

    await act(async () => {
      fireEvent.click(retry);
    });
    expect(onUpload).toHaveBeenCalledTimes(2);
    expect(await screen.findByText(/Uploaded|Uploading/)).toBeInTheDocument();
    expect(screen.queryByText("Connection lost")).not.toBeInTheDocument();
  });

  it("hides Retry when a failed row says it cannot be retried, and without onUpload", () => {
    render(
      <FileUpload
        onUpload={vi.fn()}
        defaultItems={[
          {
            id: "a",
            name: "a.mov",
            size: 1000,
            status: "failed",
            error: "Too large for this plan",
            retryable: false,
          },
        ]}
      />
    );
    const retry = screen.getByRole("button", {
      name: "Retry a.mov",
      hidden: true,
    });
    expect(retry).toBeDisabled();
    expect(retry).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Too large for this plan")).toBeInTheDocument();
  });

  it("renders defaultItems with their statuses and does not report them as files", () => {
    const onFilesChange = vi.fn();
    render(
      <FileUpload
        onFilesChange={onFilesChange}
        defaultItems={[
          { id: "1", name: "brand.pdf", size: 2400000, status: "uploaded" },
          {
            id: "2",
            name: "launch.mov",
            size: 8600000,
            status: "failed",
            error: "Connection lost",
          },
        ]}
      />
    );
    expect(screen.getByText("brand.pdf")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("2.3 MB")).toBeInTheDocument();
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("removes a row, aborts its upload and moves focus to a neighbouring row", async () => {
    const user = userEvent.setup();
    let signal: AbortSignal | undefined;
    const onUpload = vi.fn(
      (_item, options) =>
        new Promise<void>(() => {
          signal = options.signal;
        })
    );
    render(
      <FileUpload
        multiple
        onUpload={onUpload}
        defaultValue={[pdf("one.pdf"), pdf("two.pdf")]}
      />
    );
    // defaultValue rows are plain selections: they are not uploaded until added
    expect(onUpload).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Upload files"), {
        target: { files: [pdf("three.pdf")] },
      });
    });
    expect(signal?.aborted).toBe(false);

    await user.click(screen.getByRole("button", { name: "Remove three.pdf" }));
    expect(signal?.aborted).toBe(true);
    expect(screen.queryByText("three.pdf")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove two.pdf" })
    ).toHaveFocus();
  });

  it("moves between rows with the arrow keys and removes the focused row with Delete", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileUpload
        multiple
        onFilesChange={onFilesChange}
        defaultValue={[pdf("one.pdf"), pdf("two.pdf"), pdf("three.pdf")]}
      />
    );
    screen.getByRole("button", { name: "Remove one.pdf" }).focus();

    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("button", { name: "Remove two.pdf" })
    ).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowUp}");
    expect(
      screen.getByRole("button", { name: "Remove two.pdf" })
    ).toHaveFocus();

    await user.keyboard("{Delete}");
    expect(screen.queryByText("two.pdf")).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: "one.pdf" }),
      expect.objectContaining({ name: "three.pdf" }),
    ]);
    expect(
      screen.getByRole("button", { name: "Remove three.pdf" })
    ).toHaveFocus();
  });

  it("refuses files beyond maxFiles with a message", async () => {
    const onReject = vi.fn();
    render(<FileUpload multiple maxFiles={2} onReject={onReject} />);
    await userEvent
      .setup()
      .upload(screen.getByLabelText("Upload files"), [
        pdf("a.pdf"),
        pdf("b.pdf"),
        pdf("c.pdf"),
      ]);

    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
    expect(screen.queryByText("c.pdf")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can add up to 2 files"
    );
    expect(onReject).toHaveBeenCalledWith(
      "You can add up to 2 files",
      expect.objectContaining({ name: "c.pdf" })
    );
  });

  it("adds pasted files while the pointer is over it, and ignores text fields", () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <>
        <input aria-label="notes" />
        <FileUpload multiple onFilesChange={onFilesChange} />
      </>
    );
    const root = container.querySelector("div") as HTMLElement;
    const paste = (target: Element) =>
      fireEvent.paste(target, { clipboardData: { files: [pdf("shot.pdf")] } });

    // nothing happens while the pointer is elsewhere
    paste(document.body);
    expect(onFilesChange).not.toHaveBeenCalled();

    fireEvent.pointerEnter(root);
    paste(screen.getByLabelText("notes"));
    expect(onFilesChange).not.toHaveBeenCalled();
    paste(document.body);
    expect(onFilesChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "shot.pdf" }),
    ]);
  });

  it("gives image files a thumbnail and releases it when the row goes", async () => {
    const create = vi.fn(() => "blob:thumb-1");
    const revoke = vi.fn();
    const original = {
      create: URL.createObjectURL,
      revoke: URL.revokeObjectURL,
    };
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    try {
      const user = userEvent.setup();
      const { container } = render(<FileUpload multiple />);
      await user.upload(screen.getByLabelText("Upload files"), png());
      expect(container.querySelector("img")).toHaveAttribute(
        "src",
        "blob:thumb-1"
      );
      await user.click(
        screen.getByRole("button", { name: "Remove photo.png" })
      );
      expect(revoke).toHaveBeenCalledWith("blob:thumb-1");
    } finally {
      URL.createObjectURL = original.create;
      URL.revokeObjectURL = original.revoke;
    }
  });

  it("swaps the prompt for dropLabel while a file is over the target, and shows a custom note", () => {
    const { container } = render(
      <FileUpload dropLabel="Release to upload" note="PDF or PNG, up to 5 MB" />
    );
    expect(screen.getByText("PDF or PNG, up to 5 MB")).toBeInTheDocument();
    expect(screen.getByText("Click to upload")).toBeInTheDocument();
    fireEvent.dragOver(
      container.firstChild as HTMLElement,
      transfer("text/csv")
    );
    expect(screen.getByText("Release to upload")).toBeInTheDocument();
    expect(screen.queryByText("Click to upload")).not.toBeInTheDocument();
  });

  it("folds the prompt to a slim bar at compactAt rows and unfolds for a drag", () => {
    const { container } = render(
      <FileUpload
        compactAt={2}
        defaultItems={[
          { id: "1", name: "a.pdf", size: 10, status: "uploaded" },
          { id: "2", name: "b.pdf", size: 10, status: "uploaded" },
        ]}
      />
    );
    expect(zoneOf()).toHaveAttribute("data-compact", "true");
    fireEvent.dragOver(
      container.firstChild as HTMLElement,
      transfer("text/csv")
    );
    expect(zoneOf()).not.toHaveAttribute("data-compact");
  });

  it("lights the target toward the pointer while a file is over it", () => {
    const { container } = render(<FileUpload />);
    expect(
      zoneOf().querySelectorAll("span[aria-hidden]").length
    ).toBeGreaterThan(1);
    fireEvent.dragOver(container.firstChild as HTMLElement, {
      ...transfer("text/csv"),
      clientX: 10,
      clientY: 10,
    });
    expect(zoneOf()).toHaveAttribute("data-drag", "over");
  });
});
