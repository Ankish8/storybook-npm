import * as React from "react";
import { FormModal } from "@/components/ui/form-modal";
import { Input } from "@/components/ui/input";

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
        {/* Minimum Balance Input */}
        <div className="grid gap-2">
          <label
            htmlFor="minimum-balance"
            className="text-sm font-medium text-semantic-text-secondary"
          >
            Minimum balance
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted">
              {currencySymbol}
            </span>
            <Input
              id="minimum-balance"
              type="number"
              value={minimumBalance}
              onChange={(e) => setMinimumBalance(e.target.value)}
              className="pl-8"
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Minimum Top-up Input */}
        <div className="grid gap-2">
          <label
            htmlFor="minimum-topup"
            className="text-sm font-medium text-semantic-text-secondary"
          >
            Minimum topup
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-semantic-text-muted">
              {currencySymbol}
            </span>
            <Input
              id="minimum-topup"
              type="number"
              value={minimumTopup}
              onChange={(e) => setMinimumTopup(e.target.value)}
              className="pl-8"
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>
      </FormModal>
    );
  }
);

AlertValuesModal.displayName = "AlertValuesModal";
