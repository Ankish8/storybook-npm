import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  clearAllMocks,
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { useState } from "react";
import { FileUpload, type FileUploadProps } from "./file-upload";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const sample = () =>
  new File(["name,email\nAda,ada@example.test"], "contacts.csv", {
    type: "text/csv",
    lastModified: 1,
  });
const meta: Meta<typeof FileUpload> = {
  title: "V2/Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "label",
        "helperText",
        "accept",
        "multiple",
        "maxSize",
        "disabled",
        "error",
        "onFilesChange",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "file-upload",
          hasV1: false,
          summary:
            "Native file selection and drag-and-drop with validation and removable file rows.",
          changes: [
            ["Typography", "—", "Inter; 14px label and 12px supporting text"],
            ["Drop zone", "—", "12px corners; dashed border; 24px padding"],
            ["File rows", "—", "8px corners; 12px padding"],
            ["Validation", "—", "Allowed extensions/MIME types and size limit"],
          ],
          tokens: [
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            [
              "Active drop target",
              "--semantic-border-accent",
              "#27ABB8",
              "#27ABB8",
            ],
            ["Error", "--semantic-error-text", "#B42318", "#B42318"],
          ],
          guidance:
            "Files are held locally; this component does not upload them. onFilesChange receives accepted selections; onReject reports invalid files. Drop-zone geometry uses the v2 card/input language. The File Upload node exists in Figma, but its exact inner values were not verified after Chrome lost WebGL; see the completion notes.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-7516",
    },
  },
  args: {
    label: "Contact list",
    helperText: "Choose a CSV file to import.",
    accept: ".csv",
    multiple: false,
    maxSize: 10485760,
    disabled: false,
    error: "",
    value: [],
    onFilesChange: fn(),
    onReject: fn(),
  },
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    maxSize: { control: "number" },
    disabled: { control: "boolean" },
    error: { control: "text" },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <section className="w-[440px] max-w-full space-y-4">
        <FileUpload
          {...args}
          onFilesChange={(files) => {
            args.onFilesChange?.(files);
            updateArgs({ value: files });
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={args.disabled}
          onClick={() => {
            const files = [sample()];
            args.onFilesChange?.(files);
            updateArgs({ value: files });
          }}
        >
          Load sample file
        </Button>
      </section>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const MultipleFiles: Story = {
  args: {
    multiple: true,
    accept: "image/*,.pdf",
    helperText: "Choose images or PDF documents.",
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = {
  args: {
    error: "The selected file could not be read. Please choose another.",
  },
};
export const WithFiles: Story = { args: { value: [sample()] } };
function Sample(args: FileUploadProps) {
  const [files, setFiles] = useState(args.value || []);
  return (
    <FileUpload
      {...args}
      value={files}
      onFilesChange={(next) => {
        setFiles(next);
        args.onFilesChange?.(next);
      }}
    />
  );
}
export const AllVariants: Story = {
  parameters: gallery(
    ["multiple", "value"],
    "Single- and multiple-file upload. Labels, validation rules and disabled controls apply to both."
  ),
  render: (args) => (
    <div className="grid w-[940px] max-w-full gap-6 lg:grid-cols-2">
      {[false, true].map((multiple) => (
        <section key={String(multiple)} className="min-w-0 space-y-3">
          <h3 className="m-0 text-base font-medium">
            {multiple ? "Multiple files" : "Single file"}
          </h3>
          <Sample {...args} value={[]} multiple={multiple} />
        </section>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["disabled", "error", "value"],
    "Default, selected, error and disabled. Labels and allowed-file rules remain editable."
  ),
  render: (args) => (
    <div className="grid w-[940px] max-w-full gap-6 lg:grid-cols-2">
      {["Default", "Selected", "Error", "Disabled"].map((state) => (
        <section key={state} className="min-w-0 space-y-3">
          <h3 className="m-0 text-base font-medium">{state}</h3>
          <Sample
            {...args}
            value={state === "Selected" ? [sample()] : []}
            error={state === "Error" ? "The file exceeds the size limit." : ""}
            disabled={state === "Disabled"}
          />
        </section>
      ))}
    </div>
  ),
};
function Import(args: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="w-[440px] max-w-full space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <div>
        <h3 className="m-0 text-base font-medium">Import contacts</h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Choose a file or load the example, then import locally.
        </p>
      </div>
      <FileUpload
        {...args}
        value={files}
        onFilesChange={(next) => {
          setFiles(next);
          setSaved(false);
          args.onFilesChange?.(next);
        }}
      />
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={args.disabled}
          onClick={() => {
            setFiles([sample()]);
            setSaved(false);
          }}
        >
          Load sample file
        </Button>
        <Button
          type="submit"
          disabled={args.disabled || !files.length || Boolean(args.error)}
        >
          Import
        </Button>
      </div>
      <p
        role="status"
        className="m-0 text-xs text-[var(--v2-text-muted,#707070)]"
      >
        {saved
          ? `${files.length} file imported in this example.`
          : "No upload is sent to a server."}
      </p>
    </form>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "A local file import. File rules and labels are passed through; selections are local to this example."
  ),
  render: (args) => <Import {...args} />,
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  parameters: {
    // Every change calls updateArgs, which re-renders the story, and Storybook
    // restores (clears) all spies on each render. Keep their history instead.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Chooses, drops and removes real File objects against the action spies. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Contact list");

    await step("Choosing a CSV adds it to the list", async () => {
      await userEvent.upload(input, sample());
      await expect(args.onFilesChange).toHaveBeenCalledTimes(1);
      await expect(args.onFilesChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ name: "contacts.csv" }),
      ]);
      await expect(await canvas.findByText("contacts.csv")).toBeVisible();
    });

    await step("A dropped file of the wrong type is rejected", async () => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(
        new File(["png"], "logo.png", { type: "image/png" })
      );
      const drop = new DragEvent("drop", { bubbles: true, dataTransfer });
      const zone = canvas.getByRole("button", { name: "Choose contact list" });
      await fireEvent(zone, drop);
      await expect(args.onReject).toHaveBeenCalledWith(
        "File type not accepted: logo.png",
        expect.objectContaining({ name: "logo.png" })
      );
      await expect(await canvas.findByRole("alert")).toHaveTextContent(
        "logo.png"
      );
      await expect(input).toBeInvalid();
      await expect(args.onFilesChange).toHaveBeenCalledTimes(1);
    });

    await step("A new single selection replaces the old one", async () => {
      const leads = new File(["id"], "leads.csv", { type: "text/csv" });
      await userEvent.upload(input, leads);
      await expect(await canvas.findByText("leads.csv")).toBeVisible();
      await expect(canvas.queryByText("contacts.csv")).not.toBeInTheDocument();
      await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    });

    await step("Remove empties the list", async () => {
      const remove = canvas.getByRole("button", { name: "Remove leads.csv" });
      await userEvent.click(remove);
      await expect(args.onFilesChange).toHaveBeenLastCalledWith([]);
      await waitFor(() =>
        expect(canvas.queryByText("leads.csv")).not.toBeInTheDocument()
      );
    });
  },
};
