import * as React from "react";

import { FormModal } from "../../../ui/form-modal";
import { TextField } from "../../../ui/text-field";
import { PhoneInput } from "../../../ui/phone-input";
import type { CallLogsEditContactModalProps, CallLogsEditContactModalValues } from "./types";

/** Matches TextField's built-in label styling — PhoneInput has no label prop of its own. */
function PhoneFieldLabel() {
  return (
    <label className="text-sm font-semibold text-semantic-text-secondary">
      Phone Number <span className="text-semantic-error-primary">*</span>
    </label>
  );
}

/**
 * CallLogsEditContactModal is the dialog opened from CallDetailPanel's
 * "Edit Contact" action to update the name, phone number, and email of the
 * contact associated with a call.
 *
 * @example
 * ```tsx
 * <CallLogsEditContactModal
 *   open={isEditContactOpen}
 *   onOpenChange={setIsEditContactOpen}
 *   defaultName="Khushboo Rawat"
 *   defaultPhoneNumber="68484 44444"
 *   defaultEmail="khushboo123@gmail.com"
 *   onSave={(values) => updateContact(values)}
 * />
 * ```
 */
const CallLogsEditContactModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      defaultName = "",
      defaultPhoneNumber = "",
      defaultEmail = "",
      countryCode = "+91",
      countryFlag = "🇮🇳",
      onSave,
      onCancel,
      loading = false,
      className,
    }: CallLogsEditContactModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState(defaultName);
    const [phoneNumber, setPhoneNumber] = React.useState(defaultPhoneNumber);
    const [email, setEmail] = React.useState(defaultEmail);

    React.useEffect(() => {
      if (open) {
        setName(defaultName);
        setPhoneNumber(defaultPhoneNumber);
        setEmail(defaultEmail);
      }
    }, [open, defaultName, defaultPhoneNumber, defaultEmail]);

    const handleSave = () => {
      const trimmedPhone = phoneNumber.trim();
      if (!trimmedPhone) return;
      const values: CallLogsEditContactModalValues = {
        name: name.trim(),
        phoneNumber: trimmedPhone,
        email: email.trim(),
      };
      onSave(values);
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Contact"
        onSave={handleSave}
        onCancel={onCancel}
        loading={loading}
        disableSave={!phoneNumber.trim()}
        saveButtonText="Save"
        cancelButtonText="Cancel"
        className={className}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
        />
        <div className="flex flex-col gap-0.5">
          <PhoneFieldLabel />
          <PhoneInput
            countryCode={countryCode}
            countryFlag={countryFlag}
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            disabled={loading}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </FormModal>
    );
  }
);
CallLogsEditContactModal.displayName = "CallLogsEditContactModal";

export { CallLogsEditContactModal };
