import * as React from "react"
import { CheckCheck } from "lucide-react"
import { Avatar } from "../../ui/avatar"
import { TextField } from "../../ui/text-field"

/* ── resolveVars ── */
export function resolveVars(
  text: string,
  vars: Record<string, string>,
): React.ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return parts.map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span key={i} className="text-semantic-text-link font-medium">
        {vars[part] || part}
      </span>
    ) : (
      part
    ),
  )
}

/* ── DeliveryRow ── */
export function DeliveryRow() {
  return (
    <div className="flex items-center justify-end gap-1.5 mt-1.5">
      <CheckCheck className="size-4 text-semantic-text-muted" />
      <span className="text-[12px] text-semantic-text-muted">Delivered</span>
      <span className="text-[10px] font-bold text-semantic-text-muted">
        &bull;
      </span>
      <span className="text-[12px] text-semantic-text-muted">2:30 PM</span>
      <Avatar initials="AS" size="xs" variant="filled" />
    </div>
  )
}

/* ── VarRow ── */
export function VarRow({
  varName,
  value,
  onChange,
}: {
  varName: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[13px] text-semantic-text-secondary w-[148px] shrink-0 truncate font-mono">
        {varName}
      </span>
      <TextField
        wrapperClassName="flex-1"
        placeholder="Enter value"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

/* ── VarSectionLabel ── */
export function VarSectionLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="m-0 text-[11px] font-semibold text-semantic-text-muted uppercase tracking-[0.4px] mt-4 mb-1">
      {children}
    </p>
  )
}
