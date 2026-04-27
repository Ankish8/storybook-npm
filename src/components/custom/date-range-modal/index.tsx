import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { DateInput } from "./date-input";

export interface DateRangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Modal title. Defaults to "Select custom date" */
  title?: string;
  /** Called when the user confirms with both dates selected */
  onConfirm: (start: Date, end: Date) => void;
  /** Called when the user cancels */
  onCancel?: () => void;
  /** Confirm button label. Defaults to "Select custom date range" */
  confirmButtonText?: string;
  /** Cancel button label. Defaults to "Cancel" */
  cancelButtonText?: string;
  /** Disables confirm button and shows loading state */
  loading?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /**
   * When true, days before today cannot be selected. The effective minimum is the later of
   * today (start of local day) and `minDate` when both apply.
   */
  disablePastDates?: boolean;
  /** Preselected start date when modal opens (e.g. from URL when reopening custom date) */
  defaultStartDate?: Date;
  /** Preselected end date when modal opens (e.g. from URL when reopening custom date) */
  defaultEndDate?: Date;
}

function DateRangeModal({
  open,
  onOpenChange,
  title = "Select custom date",
  onConfirm,
  onCancel,
  confirmButtonText = "Select custom date range",
  cancelButtonText = "Cancel",
  loading = false,
  minDate,
  maxDate,
  disablePastDates = false,
  defaultStartDate,
  defaultEndDate,
}: DateRangeModalProps) {
  const [dialogContentEl, setDialogContentEl] =
    React.useState<HTMLElement | null>(null);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    defaultStartDate
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    defaultEndDate
  );
  /** Bumped when the other field’s calendar opens so only one popover stays open. */
  const [dismissStartCalendar, setDismissStartCalendar] = React.useState(0);
  const [dismissEndCalendar, setDismissEndCalendar] = React.useState(0);

  const canConfirm = !!startDate && !!endDate;

  const effectiveMinDate = React.useMemo(() => {
    if (!disablePastDates) return minDate;
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    if (!minDate) return todayStart;
    const minDay = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    return minDay.getTime() >= todayStart.getTime() ? minDay : todayStart;
  }, [disablePastDates, minDate]);

  function handleConfirm() {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
    }
  }

  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={setDialogContentEl}
        className="sm:max-w-md overflow-visible"
        onInteractOutside={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("[data-date-range-calendar]")
          ) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <hr className="border-semantic-border-layout -mx-6" />

        <div className="flex flex-col gap-4 py-2">
          <DateInput
            label="Start date"
            value={startDate}
            onChange={setStartDate}
            placeholder="MM/DD/YYYY"
            minDate={effectiveMinDate}
            maxDate={maxDate}
            dismissSignal={dismissStartCalendar}
            onPopoverOpened={() => setDismissEndCalendar((n) => n + 1)}
            portalContainer={dialogContentEl}
          />
          <DateInput
            label="End date"
            value={endDate}
            onChange={setEndDate}
            placeholder="MM/DD/YYYY"
            minDate={startDate ?? effectiveMinDate}
            maxDate={maxDate}
            dismissSignal={dismissEndCalendar}
            onPopoverOpened={() => setDismissStartCalendar((n) => n + 1)}
            portalContainer={dialogContentEl}
          />
        </div>

        <hr className="border-semantic-border-layout -mx-6" />

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelButtonText}
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm || loading}>
            {loading ? "Loading..." : confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
DateRangeModal.displayName = "DateRangeModal";

export { DateRangeModal };
