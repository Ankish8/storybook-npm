import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotKnowledgeBase } from "../bot-knowledge-base";
import type { KnowledgeBaseFile } from "../types";

const SAMPLE_FILES: KnowledgeBaseFile[] = [
  { id: "1", name: "FAQ.pdf", status: "ready" },
  { id: "2", name: "Catalog.csv", status: "training" },
  { id: "3", name: "Policies.docx", status: "pending" },
  { id: "4", name: "Broken.xlsx", status: "failed" },
];

describe("BotKnowledgeBase", () => {
  it("renders section title 'Knowledge base'", () => {
    render(<BotKnowledgeBase files={[]} />);
    expect(screen.getByText("Knowledge base")).toBeInTheDocument();
  });

  it("renders files with names and status badges", () => {
    render(
      <BotKnowledgeBase
        files={SAMPLE_FILES}
        onDownloadFile={() => {}}
        onDeleteFile={() => {}}
      />
    );
    expect(screen.getByText("FAQ.pdf")).toBeInTheDocument();
    expect(screen.getByText("Catalog.csv")).toBeInTheDocument();
    expect(screen.getByText("Policies.docx")).toBeInTheDocument();
    expect(screen.getByText("Broken.xlsx")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders empty state when files=[]", () => {
    render(<BotKnowledgeBase files={[]} />);
    expect(screen.getByText("No files added yet")).toBeInTheDocument();
  });

  it("calls onAddFile when add button clicked", async () => {
    const user = userEvent.setup();
    const onAddFile = vi.fn();
    render(<BotKnowledgeBase files={[]} onAddFile={onAddFile} />);
    await user.click(screen.getByRole("button", { name: /files/i }));
    expect(onAddFile).toHaveBeenCalledOnce();
  });

  it("calls onDownloadFile with file id when download clicked", async () => {
    const user = userEvent.setup();
    const onDownloadFile = vi.fn();
    render(
      <BotKnowledgeBase
        files={[SAMPLE_FILES[0]]}
        onDownloadFile={onDownloadFile}
      />
    );
    await user.click(screen.getByRole("button", { name: /download faq\.pdf/i }));
    expect(onDownloadFile).toHaveBeenCalledWith("1");
  });

  it("calls onDeleteFile with file id when delete clicked", async () => {
    const user = userEvent.setup();
    const onDeleteFile = vi.fn();
    render(
      <BotKnowledgeBase
        files={[SAMPLE_FILES[0]]}
        onDeleteFile={onDeleteFile}
      />
    );
    await user.click(screen.getByRole("button", { name: /delete faq\.pdf/i }));
    expect(onDeleteFile).toHaveBeenCalledWith("1");
  });

  it("custom className is applied", () => {
    const { container } = render(
      <BotKnowledgeBase files={[]} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("ref forwarding works", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BotKnowledgeBase files={[]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("data-testid spreads via ...props", () => {
    render(<BotKnowledgeBase files={[]} data-testid="kb-section" />);
    expect(screen.getByTestId("kb-section")).toBeInTheDocument();
  });

  it("disabled state disables add button", () => {
    render(<BotKnowledgeBase files={[]} disabled />);
    const addButton = screen.getByRole("button", { name: /files/i });
    expect(addButton).toBeDisabled();
  });

  it("disabled state disables download and delete buttons", () => {
    render(
      <BotKnowledgeBase
        files={[SAMPLE_FILES[0]]}
        onDownloadFile={() => {}}
        onDeleteFile={() => {}}
        disabled
      />
    );
    expect(
      screen.getByRole("button", { name: /download faq\.pdf/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /delete faq\.pdf/i })
    ).toBeDisabled();
  });
});
