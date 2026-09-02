import * as React from "react";

import { FormModal } from "../../../ui/form-modal";
import { TextField } from "../../../ui/text-field";
import { PhoneInput } from "../../../ui/phone-input";
import { Textarea } from "../../../ui/textarea";
import type { CallLogsBlockContactModalProps, CallLogsBlockContactModalValues } from "./types";

const DEFAULT_REASON_MAX_LENGTH = 160;

/** Matches TextField's built-in label styling — PhoneInput has no label prop of its own. */
function PhoneFieldLabel() {
  return (
    <label className="text-sm font-semibold text-semantic-text-secondary">
      Number to Block <span className="text-semantic-error-primary">*</span>
    </label>
  );
}

/**
 * CallLogsBlockContactModal is the confirmation dialog opened from
 * CallDetailPanel's "Block Caller" action. The number being blocked is
 * always read-only; the contact name is optional and editable, and a
 * reason is required before the block can be confirmed.
 *
 * @example
 * ```tsx
 * <CallLogsBlockContactModal
 *   open={isBlockContactOpen}
 *   onOpenChange={setIsBlockContactOpen}
 *   phoneNumber="68484 44444"
 *   defaultName="Khushboo Rawat"
 *   onBlock={({ name, reason }) => blockContact(phoneNumber, name, reason)}
 * />
 * ```
 */
const CallLogsBlockContactModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      phoneNumber,
      defaultName = "",
      countryCode = "+91",
      countryFlag = "🇮🇳",
      reasonMaxLength = DEFAULT_REASON_MAX_LENGTH,
      onBlock,
      onCancel,
      loading = false,
      className,
    }: CallLogsBlockContactModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState(defaultName);
    const [reason, setReason] = React.useState("");

    React.useEffect(() => {
      if (open) {
        setName(defaultName);
        setReason("");
      }
    }, [open, defaultName]);

    const handleBlock = () => {
      const trimmedReason = reason.trim();
      if (!trimmedReason) return;
      const values: CallLogsBlockContactModalValues = { name: name.trim(), reason: trimmedReason };
      onBlock(values);
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Block Contact"
        onSave={handleBlock}
        onCancel={onCancel}
        loading={loading}
        disableSave={!reason.trim()}
        saveButtonText="Block & Close"
        cancelButtonText="Cancel"
        className={className}
      >
        <div className="flex flex-col gap-0.5">
          <PhoneFieldLabel />
          <PhoneInput
            countryCode={countryCode}
            countryFlag={countryFlag}
            showChevron={false}
            value={phoneNumber}
            disabled
          />
        </div>
        <TextField
          label="Name (optional)"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
        />
        <Textarea
          label="Reason to Block"
          required
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Type reason here"
          showCount
          maxLength={reasonMaxLength}
          rows={4}
          disabled={loading}
        />
      </FormModal>
    );
  }
);
CallLogsBlockContactModal.displayName = "CallLogsBlockContactModal";

export { CallLogsBlockContactModal };
