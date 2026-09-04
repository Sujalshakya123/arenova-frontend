const GENERIC_HOST_LABEL = "Tournament Organizer";

export const resolveHostedBy = (
  pageHostedBy?: string | null,
  organizerName?: string | null,
): string => {
  const page = pageHostedBy?.trim();
  const organizer = organizerName?.trim();

  if (page && page !== GENERIC_HOST_LABEL) {
    return page;
  }
  if (organizer) {
    return organizer;
  }
  if (page) {
    return page;
  }
  return GENERIC_HOST_LABEL;
};
