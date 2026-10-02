# Breadcrumbs action review

Browser-only follow-up on 2026-10-01, using the stable production preview at http://127.0.0.1:6029. The primary component reviewer owns the remaining geometry, Controls, keyboard and Docs checks.

## Finding

- Opened **More Pages**, clicked **Show hidden pages**, then **Settings**.
- The overflow menu stayed visible after the click.
- Browser SecurityError count increased from two historical UiCard errors to three. The new error occurred at `2026-10-01T13:03:51.512Z`, from the 6029 preview, while Storybook attempted to stringify the raw React event and read `Window.toJSON` across origins.
- All three story `onNavigate` wrappers forwarded the raw React event to the action spy. The event is needed by the component callback and by each demo's `preventDefault`; it should be omitted from serialized story action arguments.

Evidence: `design/review/breadcrumbs/overflow-action-before-fix.png`. Reported to the source owner for repair and browser recheck.

This is a story callback issue. It does not reopen the already verified DropdownMenu `asChild` composition or change the library callback signature.

## Serialization repair recheck

On the latest live preview at http://127.0.0.1:6008, the owner changed story actions to serialize only destination label/href and its index.

- **More Pages**: selecting Settings logged `(2) [Object, 2]` in Actions. The error count remained three, with no new SecurityError. A repeated selection without any subsequent focus change still left the menu open. This remaining close issue was reported separately: the demo's anchor `preventDefault` stops Radix's composed click/select path.
- **With Icons**: clicking Home logged `(2) [Object, 0]`, omitting both the React event and icon nodes. No new SecurityError appeared.
- **Usage**: selecting Workspace changed the current-page text from Settings to Workspace, reduced the rendered path to Home / Workspace and logged `(2) [Object, 1]`. Restore path returned the path to Settings. No new SecurityError appeared.

Evidence: `design/review/breadcrumbs/{serialization-fixed-menu-open,icons-action-fixed,usage-action-fixed}.png`.

The console retains the three earlier serialization errors; this recheck uses the unchanged error count, rather than claiming the entire log is empty.

## Final overflow repair recheck

The owner then controlled the overflow's open state and closed it after destination selection, independently of preventing anchor navigation. Rechecked the latest 6008 preview:

- Mouse selection of Settings repeated twice: the menu unmounted (`menu` count zero) and focus returned to **Show hidden pages** both times.
- Keyboard selection: opened using ArrowDown, moved from Workspace to Settings with ArrowDown, confirmed Settings had focus, then pressed Enter. The menu unmounted and focus returned to the overflow trigger.
- All three selections logged the serializable destination and index `2`. The SecurityError count remained at baseline three; there were no new serialization errors.
- With Icons and Usage actions passed as described above. Restore path was subsequently confirmed to return `Current page: Settings`.

Final evidence: `design/review/breadcrumbs/{overflow-action-fixed,keyboard-selection-fixed}.png`.

Both findings are resolved in the source and rechecked in the browser. The focused component regression test belongs to the source owner; this report records the manual browser proof.

## Frozen production confirmation

Confirmed the final frozen production preview at http://127.0.0.1:6030 on 2026-10-01:

- Mouse selection of Settings closed the menu (`menu` count zero) and returned focus to **Show hidden pages**.
- Keyboard ArrowDown opened the menu; ArrowDown moved from Workspace to focused Settings; Enter selected it. The menu unmounted and focus returned to the trigger.
- Actions recorded two serializable arguments, destination and index `2`, for both selections.
- The fresh review tab had zero console errors before selection and zero after both selections. No action serialization error appeared.

Frozen-build evidence: `design/review/breadcrumbs/{final-production-mouse,final-production-keyboard}.png`. All other previously reviewed Breadcrumbs paths remain source-identical in this snapshot.
