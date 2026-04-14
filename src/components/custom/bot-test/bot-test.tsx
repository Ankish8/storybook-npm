import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { SelectField } from "../../ui/select-field";
import { PhoneInput } from "../../ui/phone-input";
import { Button } from "../../ui/button";
import type { BotTestProps } from "./types";

/** Digits only, for length math (E.164 / formatted numbers). */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** National subscriber length: full number digits minus dial-code digits from `countryCode`. */
function nationalDigitLength(
  fullNumber: string | undefined,
  dialCode: string
): number {
  if (!fullNumber?.trim()) return 0;
  const national = digitsOnly(fullNumber).length - digitsOnly(dialCode).length;
  return national > 0 ? national : 0;
}

const BotTest: React.FC<BotTestProps> = ({
  open,
  onOpenChange,
  description = "Send 'Hi \ud83d\udc4b ' to the selected number to begin.",
  whatsappNumbers = [],
  selectedNumber,
  onNumberChange,
  numberPlaceholder = "Select number",
  countryFlag,
  countryCode,
  showCountryChevron,
  onCountryClick,
  phoneNumber,
  onPhoneNumberChange,
  phonePlaceholder = "Enter your number",
  phoneNumberMaxLength = 10,
  onTest,
  testDisabled,
  testLoading = false,
  testLabel = "Test",
  disabled = false,
}) => {
  const resolvedCountryCode = countryCode ?? "+91";
  const derivedNationalLen = nationalDigitLength(
    selectedNumber,
    resolvedCountryCode
  );
  const effectivePhoneMaxLength =
    selectedNumber?.trim() && derivedNationalLen > 0
      ? derivedNationalLen
      : phoneNumberMaxLength;

  const isTestDisabled =
    testDisabled !== undefined
      ? testDisabled
      : disabled || !selectedNumber || !phoneNumber?.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-semibold text-semantic-text-primary">
            Test your bot
          </DialogTitle>
          <DialogDescription className="text-sm text-semantic-text-muted mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
          {/* Connected whatsapp number */}
          <SelectField
            label="Connected whatsapp number"
            required
            placeholder={numberPlaceholder}
            options={whatsappNumbers}
            value={selectedNumber}
            onValueChange={onNumberChange}
            disabled={disabled}
          />

          {/* Phone number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-semantic-text-primary">
              Phone number{" "}
              <span className="text-semantic-error-primary">*</span>
            </label>
            <PhoneInput
              placeholder={phonePlaceholder}
              value={
                phoneNumber !== undefined ? digitsOnly(phoneNumber) : undefined
              }
              onChange={(e) => {
                const next = digitsOnly(e.target.value);
                onPhoneNumberChange?.(next);
              }}
              maxLength={effectivePhoneMaxLength}
              inputMode="numeric"
              pattern="[0-9]*"
              countryFlag={countryFlag}
              countryCode={countryCode}
              showChevron={showCountryChevron}
              onCountryClick={onCountryClick}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 pb-6">
          <Button
            variant="primary"
            onClick={onTest}
            disabled={isTestDisabled}
            loading={testLoading}
          >
            {testLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
BotTest.displayName = "BotTest";

export { BotTest };
