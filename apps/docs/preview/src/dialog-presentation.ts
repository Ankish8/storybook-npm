/** A modal entered by a real user action may take the whole docs viewport. Initially-open samples stay inline. */
export function createDialogPresentation(
  now: () => number = () => performance.now()
) {
  let previous = new Set<HTMLElement>();
  let lastActivation = -Infinity;
  let fullscreen = false;
  return {
    activate() {
      lastActivation = now();
    },
    requestFullscreen() {
      fullscreen = previous.size > 0;
    },
    update(dialogs: HTMLElement[]) {
      if (
        dialogs.some((dialog) => !previous.has(dialog)) &&
        now() - lastActivation < 5000
      )
        fullscreen = true;
      previous = new Set(dialogs);
      if (!dialogs.length) fullscreen = false;
      return { dialogOpen: dialogs.length > 0, fullscreen };
    },
  };
}
