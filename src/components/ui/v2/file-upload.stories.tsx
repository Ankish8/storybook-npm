import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
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
          <h3 className="m-0 text-base font-semibold">
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
          <h3 className="m-0 text-base font-semibold">{state}</h3>
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
        <h3 className="m-0 text-base font-semibold">Import contacts</h3>
        <p className="m-0 mt-1 text-xs text-semantic-text-muted">
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
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
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
