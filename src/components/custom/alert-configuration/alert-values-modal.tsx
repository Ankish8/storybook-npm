import * as React from "react";
import { FormModal } from "@/components/ui/form-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AlertValueOption {
  /** The numeric value */
  value: number;
  /** Display label (e.g. "₹ 250"). If omitted, formatted automatically from value + currencySymbol */
  label?: string;
}

export interface AlertValuesModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onOpenChange: (open: boolean) => void;
  /** Initial minimum balance value */
  initialMinimumBalance?: number;
  /** Initial minimum top-up value */
  initialMinimumTopup?: number;
  /** Currency symbol (default: ₹) */
  currencySymbol?: string;
  /** Options for the minimum balance dropdown */
  balanceOptions: AlertValueOption[];
  /** Options for the minimum topup dropdown */
  topupOptions: AlertValueOption[];
  /** Callback when values are saved */
  onSave?: (values: { minimumBalance: number; minimumTopup: number }) => void;
  /** Loading state for save button */
  loading?: boolean;
}

/**
 * AlertValuesModal component for editing alert configuration values.
 * Displays a form with inputs for minimum balance and minimum top-up.
 */
export const AlertValuesModal = React.forwardRef<
  HTMLDivElement,
  AlertValuesModalProps
>(
  (
    {
      open,
      onOpenChange,
      initialMinimumBalance = 0,
      initialMinimumTopup = 0,
      currencySymbol = "₹",
      balanceOptions,
      topupOptions,
      onSave,
      loading = false,
    },
    ref
  ) => {
    const [minimumBalance, setMinimumBalance] = React.useState(
      initialMinimumBalance.toString()
    );
    const [minimumTopup, setMinimumTopup] = React.useState(
      initialMinimumTopup.toString()
    );

    const formatOptionLabel = (option: AlertValueOption) =>
      option.label ?? `${currencySymbol} ${option.value}`;

    // Update form values when initial values change
    React.useEffect(() => {
      setMinimumBalance(initialMinimumBalance.toString());
      setMinimumTopup(initialMinimumTopup.toString());
    }, [initialMinimumBalance, initialMinimumTopup, open]);

    const handleSave = () => {
      const balanceValue = parseFloat(minimumBalance) || 0;
      const topupValue = parseFloat(minimumTopup) || 0;

      onSave?.({
        minimumBalance: balanceValue,
        minimumTopup: topupValue,
      });
    };

    const handleCancel = () => {
      // Reset to initial values
      setMinimumBalance(initialMinimumBalance.toString());
      setMinimumTopup(initialMinimumTopup.toString());
    };

    return (
      <FormModal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Alert values"
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        size="sm"
      >
        {/* Minimum Balance Select */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-semantic-text-secondary">
            Minimum balance
          </label>
          <Select value={minimumBalance} onValueChange={setMinimumBalance}>
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {balanceOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                >
                  {formatOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Top-up Select */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-semantic-text-secondary">
            Minimum topup
          </label>
          <Select value={minimumTopup} onValueChange={setMinimumTopup}>
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {topupOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                >
                  {formatOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormModal>
    );
  }
);

AlertValuesModal.displayName = "AlertValuesModal";
