import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { Typography } from "../../ui/typography";
import { inputVariants } from "../../ui/input";
import { Switch } from "../../ui/switch";

/** Figma: names start with a letter; only letters, digits, underscore. */
export const CATALOG_VARIABLE_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export const CATALOG_VARIABLE_NAME_HELP =
  "Variable name should start with alphabet; Cannot have special characters except underscore (_)";

export interface EditVariableFormValues {
  name: string;
  description: string;
  required: boolean;
}

export interface EditVariableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  /** Shown when the dialog opens; reset when `open` becomes true */
  initialValues?: Partial<
    Pick<EditVariableFormValues, "name" | "description" | "required">
  >;
  nameMaxLength?: number;
  descriptionMaxLength?: number;
  onSave: (values: EditVariableFormValues) => void;
  /** Shown under the name field (e.g. duplicate name from parent validation) */
  submitError?: string;
  /** Called when the name field changes while `submitError` is set (parent should clear it) */
  onClearSubmitError?: () => void;
  className?: string;
}

const DEFAULT_NAME_MAX = 30;
const DEFAULT_DESCRIPTION_MAX = 500;

export const EditVariableDialog = React.forwardRef<
  HTMLDivElement,
  EditVariableDialogProps
>(
  (
    {
      open,
      onOpenChange,
      mode,
      initialValues,
      nameMaxLength = DEFAULT_NAME_MAX,
      descriptionMaxLength = DEFAULT_DESCRIPTION_MAX,
      onSave,
      submitError,
      onClearSubmitError,
      className,
    },
    ref
  ) => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [required, setRequired] = React.useState(false);
    const [nameError, setNameError] = React.useState("");

    React.useEffect(() => {
      if (!open) return;
      setName(initialValues?.name ?? "");
      setDescription(initialValues?.description ?? "");
      setRequired(initialValues?.required ?? false);
      setNameError("");
    }, [
      open,
      initialValues?.name,
      initialValues?.description,
      initialValues?.required,
    ]);

    const combinedNameError = nameError || submitError || "";

    const validateAndSave = () => {
      const trimmed = name.trim();
      if (!trimmed) {
        setNameError("Variable name is required");
        return;
      }
      if (trimmed.length > nameMaxLength) {
        setNameError(`Variable name cannot exceed ${nameMaxLength} characters`);
        return;
      }
      if (!CATALOG_VARIABLE_NAME_PATTERN.test(trimmed)) {
        setNameError(CATALOG_VARIABLE_NAME_HELP);
        return;
      }
      setNameError("");
      onSave({
        name: trimmed,
        description: description.trim(),
        required,
      });
    };

    const title = mode === "edit" ? "Edit variable" : "Add new variable";

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          size="sm"
          className={cn(
            "gap-0 border-semantic-border-layout bg-semantic-bg-primary p-0",
            className
          )}
        >
          <DialogHeader className="border-b border-semantic-border-layout px-6 py-4 text-left">
            <DialogTitle className="m-0 pr-8 text-base font-semibold text-semantic-text-primary">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <TextField
              id="edit-var-name"
              label="Variable name"
              required
              value={name}
              maxLength={nameMaxLength}
              showCount
              helperText={combinedNameError ? undefined : CATALOG_VARIABLE_NAME_HELP}
              error={combinedNameError || undefined}
              placeholder="e.g. contact_name"
              autoFocus
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
                if (submitError) onClearSubmitError?.();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  validateAndSave();
                }
              }}
            />

            <div className="flex flex-col gap-1.5">
              <Typography
                kind="label"
                variant="large"
                color="secondary"
                htmlFor="edit-var-desc"
              >
                Description (optional)
              </Typography>
              <textarea
                id="edit-var-desc"
                value={description}
                maxLength={descriptionMaxLength}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description"
                rows={4}
                className={cn(
                  inputVariants({ state: "default" }),
                  "min-h-[120px] h-auto resize-none py-2.5",
                  "text-semantic-text-primary placeholder:text-semantic-text-placeholder"
                )}
              />
            </div>

            <Switch
              checked={required}
              onCheckedChange={setRequired}
              label="Required"
              labelPosition="right"
            />
          </div>

          <DialogFooter className="gap-2 border-t border-semantic-border-layout px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={validateAndSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

EditVariableDialog.displayName = "EditVariableDialog";
