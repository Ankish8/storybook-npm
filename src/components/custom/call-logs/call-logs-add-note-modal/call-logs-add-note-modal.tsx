import * as React from "react";

import { FormModal } from "../../../ui/form-modal";
import { Textarea } from "../../../ui/textarea";
import type { CallLogsAddNoteModalProps } from "./types";

const DEFAULT_MAX_LENGTH = 100;

/**
 * CallLogsAddNoteModal is the dialog opened from a call-logs row's "More
 * actions" menu ("Notes") to add a note for that call. Saving calls
 * `onSave(note)`; the parent is responsible for attaching it to the row
 * (e.g. as an entry in CallDetailPanel's Notes tab).
 *
 * @example
 * ```tsx
 * <CallLogsAddNoteModal
 *   open={isNoteModalOpen}
 *   onOpenChange={setIsNoteModalOpen}
 *   onSave={(note) => addNoteToRow(rowId, note)}
 * />
 * ```
 */
const CallLogsAddNoteModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      defaultValue = "",
      maxLength = DEFAULT_MAX_LENGTH,
      onSave,
      onCancel,
      loading = false,
      className,
    }: CallLogsAddNoteModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [note, setNote] = React.useState(defaultValue);

    React.useEffect(() => {
      if (open) setNote(defaultValue);
    }, [open, defaultValue]);

    const handleSave = () => {
      const trimmed = note.trim();
      if (!trimmed) return;
      onSave(trimmed);
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Notes"
        onSave={handleSave}
        onCancel={onCancel}
        loading={loading}
        disableSave={!note.trim()}
        saveButtonText="Save Note"
        cancelButtonText="Cancel"
        className={className}
      >
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSave();
            }
          }}
          placeholder="Add notes with key info, summary about the call for future context..."
          helperText='Press "Enter" to save.'
          showCount
          maxLength={maxLength}
          rows={4}
          disabled={loading}
          autoFocus
        />
      </FormModal>
    );
  }
);
CallLogsAddNoteModal.displayName = "CallLogsAddNoteModal";

export { CallLogsAddNoteModal };
