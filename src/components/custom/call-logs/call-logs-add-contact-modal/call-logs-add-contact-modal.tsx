import * as React from "react";

import { FormModal } from "../../../ui/form-modal";
import { TextField } from "../../../ui/text-field";
import { PhoneInput } from "../../../ui/phone-input";
import type { CallLogsAddContactModalProps, CallLogsAddContactModalValues } from "./types";

/** Matches TextField's built-in label styling — PhoneInput has no label prop of its own. */
function PhoneFieldLabel() {
  return (
    <label className="text-sm font-semibold text-semantic-text-secondary">
      Phone Number <span className="text-semantic-error-primary">*</span>
    </label>
  );
}

/**
 * CallLogsAddContactModal is the dialog for saving a new contact — e.g. from
 * an unknown caller's number in the Call Logs page toolbar.
 *
 * @example
 * ```tsx
 * <CallLogsAddContactModal
 *   open={isAddContactOpen}
 *   onOpenChange={setIsAddContactOpen}
 *   onSave={(values) => createContact(values)}
 * />
 * ```
 */
const CallLogsAddContactModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      defaultPhoneNumber = "",
      countryCode = "+91",
      countryFlag = "🇮🇳",
      onSave,
      onCancel,
      loading = false,
      className,
    }: CallLogsAddContactModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [name, setName] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState(defaultPhoneNumber);
    const [email, setEmail] = React.useState("");

    React.useEffect(() => {
      if (open) {
        setName("");
        setPhoneNumber(defaultPhoneNumber);
        setEmail("");
      }
    }, [open, defaultPhoneNumber]);

    const handleSave = () => {
      const trimmedPhone = phoneNumber.trim();
      if (!trimmedPhone) return;
      const values: CallLogsAddContactModalValues = {
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
        title="Add New Contact"
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
          placeholder="Enter name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
        />
        <div className="flex flex-col gap-0.5">
          <PhoneFieldLabel />
          <PhoneInput
            countryCode={countryCode}
            countryFlag={countryFlag}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            disabled={loading}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </FormModal>
    );
  }
);
CallLogsAddContactModal.displayName = "CallLogsAddContactModal";

export { CallLogsAddContactModal };
