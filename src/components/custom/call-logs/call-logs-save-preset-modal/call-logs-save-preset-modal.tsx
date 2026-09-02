import * as React from "react";

import { FormModal } from "../../../ui/form-modal";
import { TextField } from "../../../ui/text-field";
import type { CallLogsSavePresetModalProps } from "./types";

/**
 * CallLogsSavePresetModal is the confirmation dialog shown when a user clicks
 * "Save as New Preset" in the CallLogsFilterPanel. It captures a name for the
 * current filter combination; once saved, the parent is responsible for
 * adding it as a new removable tab in CallLogsViewTabs.
 *
 * @example
 * ```tsx
 * <CallLogsSavePresetModal
 *   open={isSaveModalOpen}
 *   onOpenChange={setIsSaveModalOpen}
 *   filterCount={4}
 *   defaultName="Incoming connected"
 *   onSave={(name) => addPreset(name)}
 * />
 * ```
 */
const CallLogsSavePresetModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      filterCount,
      defaultName = "",
      onSave,
      onCancel,
      loading = false,
      className,
    }: CallLogsSavePresetModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState(defaultName);

    React.useEffect(() => {
      if (open) setName(defaultName);
    }, [open, defaultName]);

    const handleSave = () => {
      const trimmed = name.trim();
      if (!trimmed) return;
      onSave(trimmed);
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Save as New Preset"
        description="You can find your saved view presets directly in the view tabs"
        onSave={handleSave}
        onCancel={onCancel}
        loading={loading}
        disableSave={!name.trim()}
        saveButtonText="Save"
        cancelButtonText="Cancel"
        size="default"
        className={className}
      >
        <div className="rounded bg-semantic-bg-ui px-4 py-2.5">
          <p className="m-0 text-sm text-semantic-text-muted">
            Captures: {filterCount} {filterCount === 1 ? "filter" : "filters"}
          </p>
        </div>
        <TextField
          label="Name"
          labelClassName="font-semibold text-semantic-text-secondary"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter a name for this preset"
        />
      </FormModal>
    );
  }
);
CallLogsSavePresetModal.displayName = "CallLogsSavePresetModal";

export { CallLogsSavePresetModal };
