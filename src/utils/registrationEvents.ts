export const REGISTRATIONS_UPDATED_EVENT = "arenova-registrations-updated";

export const notifyRegistrationsUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REGISTRATIONS_UPDATED_EVENT));
};

/** Refetch tournament cards when registrations change or the tab regains focus. */
export const subscribeRegistrationsUpdated = (onChange: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(REGISTRATIONS_UPDATED_EVENT, onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener(REGISTRATIONS_UPDATED_EVENT, onChange);
    window.removeEventListener("focus", onChange);
  };
};
