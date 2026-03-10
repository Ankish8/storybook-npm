import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IvrBotConfig } from "../ivr-bot-config";

describe("IvrBotConfig", () => {
  it("renders page header with default title", () => {
    render(<IvrBotConfig />);
    expect(screen.getByText("IVR bot")).toBeInTheDocument();
    expect(screen.getByText("Voicebot")).toBeInTheDocument();
  });

  it("renders custom title and botType", () => {
    render(<IvrBotConfig botTitle="My Bot" botType="Chatbot" />);
    expect(screen.getByText("My Bot")).toBeInTheDocument();
    expect(screen.getByText("Chatbot")).toBeInTheDocument();
  });

  it("renders Save as Draft and Publish Bot buttons", () => {
    render(<IvrBotConfig />);
    expect(screen.getByRole("button", { name: /Save as Draft/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publish Bot/i })).toBeInTheDocument();
  });

  it("calls onSaveAsDraft when Save as Draft is clicked", async () => {
    const user = userEvent.setup();
    const onSaveAsDraft = vi.fn();
    render(<IvrBotConfig onSaveAsDraft={onSaveAsDraft} />);
    await user.click(screen.getByRole("button", { name: /Save as Draft/i }));
    expect(onSaveAsDraft).toHaveBeenCalledTimes(1);
  });

  it("calls onPublish when Publish Bot is clicked", async () => {
    const user = userEvent.setup();
    const onPublish = vi.fn();
    render(<IvrBotConfig onPublish={onPublish} />);
    await user.click(screen.getByRole("button", { name: /Publish Bot/i }));
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("renders always-open sections: Who The Bot Is, How It Behaves", () => {
    render(<IvrBotConfig />);
    expect(screen.getByText("Who The Bot Is")).toBeInTheDocument();
    expect(screen.getByText("How It Behaves")).toBeInTheDocument();
  });

  it("renders always-open sections: Knowledge Base, Functions", () => {
    render(<IvrBotConfig />);
    expect(screen.getByText("Knowledge Base")).toBeInTheDocument();
    // "Functions" appears as section heading and button label — confirm heading exists
    const functionHeadings = screen.getAllByText("Functions");
    expect(functionHeadings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders accordion sections: Fallback Prompts, Frustration Handover, Advanced Settings", () => {
    render(<IvrBotConfig />);
    expect(screen.getByText("Fallback Prompts")).toBeInTheDocument();
    expect(screen.getByText("Frustration Handover")).toBeInTheDocument();
    expect(screen.getByText("Advanced Settings")).toBeInTheDocument();
  });

  it("renders built-in functions from default data", () => {
    render(<IvrBotConfig />);
    expect(screen.getByText(/transfer_to_extension/)).toBeInTheDocument();
    expect(screen.getByText(/end_call/)).toBeInTheDocument();
  });

  it("renders knowledge base files passed via initialData", () => {
    render(
      <IvrBotConfig
        initialData={{
          knowledgeBaseFiles: [
            { id: "f1", name: "Lead validation bot", status: "training" },
          ],
        }}
      />
    );
    expect(screen.getByText(/Lead validation bot/)).toBeInTheDocument();
    expect(screen.getByText("Training")).toBeInTheDocument();
  });

  it("calls onDeleteKnowledgeFile when delete is clicked", async () => {
    const user = userEvent.setup();
    const onDeleteKnowledgeFile = vi.fn();
    render(
      <IvrBotConfig
        initialData={{
          knowledgeBaseFiles: [{ id: "f1", name: "Test File", status: "trained" }],
        }}
        onDeleteKnowledgeFile={onDeleteKnowledgeFile}
      />
    );
    await user.click(screen.getByLabelText("Delete file"));
    expect(onDeleteKnowledgeFile).toHaveBeenCalledWith("f1");
  });

  it("opens CreateFunctionModal when + Functions is clicked", async () => {
    const user = userEvent.setup();
    render(<IvrBotConfig />);
    await user.click(screen.getByRole("button", { name: /Functions/i }));
    expect(screen.getByText("Create Function")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<IvrBotConfig onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: /Go back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("frustration handover toggle enables department select", async () => {
    const user = userEvent.setup();
    render(<IvrBotConfig />);
    // Open the Frustration Handover accordion first
    await user.click(screen.getByText("Frustration Handover"));
    // The escalation department select is disabled before toggle
    const allSelects = screen.getAllByRole("combobox");
    const disabledSelect = allSelects.find((el) => (el as HTMLSelectElement).disabled);
    expect(disabledSelect).toBeTruthy();
    // Toggle on — first switch in the accordion is the frustration toggle
    const switches = screen.getAllByRole("switch");
    await user.click(switches[0]);
    // After enabling, the escalation select should be enabled
    const allSelectsAfter = screen.getAllByRole("combobox");
    const stillDisabled = allSelectsAfter.find(
      (el) => (el as HTMLSelectElement).disabled
    );
    expect(stillDisabled).toBeUndefined();
  });

  it("accepts custom className", () => {
    const { container } = render(<IvrBotConfig className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<IvrBotConfig ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
