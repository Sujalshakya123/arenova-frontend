/**
 * User-side page shell theme (account area + related player pages).
 *
 * UNDO: set USER_SHELL_VARIANT to "light" to restore the previous gray shell
 * without reverting git — then save / refresh.
 */
export type UserShellVariant = "dark" | "light";

export const USER_SHELL_VARIANT: UserShellVariant = "dark";

export const isUserShellDark = USER_SHELL_VARIANT === "dark";

function pick<T>(dark: T, light: T): T {
  return isUserShellDark ? dark : light;
}

export const userShell = {
  page: pick("min-h-screen bg-[#0B0F1A]", "min-h-screen bg-[#f3f4f6]"),
  pageAlt: pick("min-h-screen bg-[#0B0F1A]", "min-h-screen bg-gray-100"),
  pagePlain: pick("min-h-screen bg-[#0B0F1A]", "min-h-screen bg-gray-50"),
  pageFlex: pick(
    "min-h-screen bg-[#0B0F1A] flex flex-col",
    "min-h-screen bg-gray-50 flex flex-col",
  ),
  content: pick(
    "flex-1 bg-[#0B0F1A] px-4 sm:px-6 py-8",
    "flex-1 bg-[#f3f4f6] px-4 sm:px-6 py-8",
  ),
  contentAlt: pick(
    "flex-1 bg-[#0B0F1A] px-4 sm:px-6 py-8",
    "flex-1 bg-gray-100 px-4 sm:px-6 py-8",
  ),
  contentWide: pick(
    "flex-1 bg-[#0B0F1A] px-4 sm:px-6 xl:px-[60px] py-8 xl:py-10",
    "flex-1 px-4 sm:px-6 xl:px-[60px] py-8 xl:py-10",
  ),
  section: pick("bg-[#0B0F1A] pb-16", "bg-gray-50 pb-16"),
  sectionMin: pick("bg-[#0B0F1A] min-h-screen", "bg-gray-100 min-h-screen"),

  h1: pick("text-2xl font-bold text-white", "text-2xl font-bold text-gray-900"),
  h2: pick("font-semibold text-white", "font-semibold text-gray-900"),
  h2Base: pick("font-bold text-white text-base", "font-bold text-gray-900 text-base"),
  h2Lg: pick("text-lg font-bold text-white", "text-lg font-bold text-gray-900"),
  h3: pick("text-lg font-semibold text-white", "text-lg font-semibold text-gray-900"),
  subtitle: pick("text-gray-400 text-sm mt-1", "text-gray-500 text-sm mt-1"),
  iconBack: pick("text-white cursor-pointer", "cursor-pointer"),

  card: pick(
    "bg-[#111827] rounded-xl border border-white/10 shadow-sm",
    "bg-white rounded-xl border border-gray-100 shadow-sm",
  ),
  cardPad4: pick(
    "bg-[#111827] rounded-xl p-4 border border-white/10",
    "bg-white rounded-xl p-4 border border-gray-100",
  ),
  cardPad5: pick(
    "bg-[#111827] rounded-xl p-5 border border-white/10 shadow-sm",
    "bg-white rounded-xl p-5 border border-gray-100 shadow-sm",
  ),
  cardPad6: pick(
    "bg-[#111827] rounded-xl p-6 border border-white/10",
    "bg-white rounded-xl p-6",
  ),
  cardPad8: pick(
    "bg-[#111827] rounded-xl p-8 border border-white/10 max-w-[660px]",
    "bg-white rounded-xl p-8 max-w-[660px]",
  ),
  cardOverflow: pick(
    "bg-[#111827] rounded-xl border border-white/10 shadow-sm overflow-hidden",
    "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
  ),
  cardRow: pick(
    "bg-[#111827] rounded-xl overflow-hidden border border-white/10 shadow-sm flex flex-col sm:flex-row",
    "bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col sm:flex-row",
  ),
  cardHeader: pick(
    "flex items-center justify-between px-5 py-4 border-b border-white/10",
    "flex items-center justify-between px-5 py-4 border-b border-gray-100",
  ),
  cardHeaderMuted: pick(
    "flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/10",
    "flex items-center justify-between px-5 py-4 bg-[#f0f1f3] border-b border-gray-200",
  ),
  cardHeaderTitle: pick(
    "flex items-center gap-2 font-semibold text-gray-200",
    "flex items-center gap-2 font-semibold text-gray-800",
  ),

  statLabel: pick(
    "text-sm text-gray-400 uppercase tracking-wide",
    "text-sm text-gray-500 uppercase tracking-wide",
  ),
  statValue: pick("text-3xl font-bold text-white", "text-3xl font-bold text-gray-900"),
  statValueSm: pick("text-2xl font-bold text-white", "text-2xl font-bold text-gray-900"),
  statHint: pick("text-sm text-gray-400 mt-1", "text-sm text-gray-500 mt-1"),

  body: pick("text-sm text-gray-300", "text-sm text-gray-700"),
  bodySm: pick("text-sm text-gray-400", "text-sm text-gray-500"),
  muted: pick("text-sm text-gray-400", "text-sm text-gray-500"),
  mutedXs: pick("text-xs text-gray-500", "text-xs text-gray-500"),
  empty: pick("text-sm text-gray-500", "text-sm text-gray-400"),
  emptyCenter: pick(
    "text-sm text-gray-500 text-center",
    "text-sm text-gray-400 text-center",
  ),
  strong: pick("text-sm font-medium text-white", "text-sm font-medium text-gray-900"),
  strongSm: pick("text-sm font-semibold text-white", "text-sm font-semibold text-gray-900"),

  input: pick(
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  ),
  inputLg: pick(
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  ),
  textarea: pick(
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
  ),
  inputSearch: pick(
    "w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
    "w-full bg-[#f3f4f6] rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  ),
  label: pick(
    "text-sm font-medium text-gray-300 mb-1 block",
    "text-sm font-medium text-gray-700 mb-1 block",
  ),
  labelPlain: pick("text-sm text-gray-400 mb-1 block", "text-sm text-gray-600 mb-1 block"),

  btnOutline: pick(
    "px-4 py-2 text-sm font-medium border border-white/20 text-gray-200 rounded-lg hover:bg-white/5 cursor-pointer",
    "px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer",
  ),
  btnOutlineSm: pick(
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-white/15 text-gray-200 rounded-lg hover:bg-white/5 transition cursor-pointer disabled:opacity-60",
    "px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition",
  ),
  tournamentBtnPrimary:
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  tournamentBtnSuccess:
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  tournamentBtnSecondary: pick(
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-medium border border-white/15 text-gray-200 rounded-lg hover:bg-white/5 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition disabled:opacity-60",
  ),
  tournamentBtnAccent: pick(
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-medium border border-blue-500/40 text-blue-400 rounded-lg hover:bg-blue-500/10 transition cursor-pointer",
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition",
  ),
  tournamentBtnDanger: pick(
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-medium border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
    "inline-flex items-center justify-center min-h-[38px] px-4 py-2 text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition disabled:opacity-60",
  ),
  tournamentActions: pick(
    "flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10",
    "flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100",
  ),
  tournamentGameBadge: pick(
    "text-xs font-semibold px-2.5 py-1 rounded-full uppercase bg-white/5 text-gray-400 border border-white/10",
    "text-sm text-gray-600",
  ),
  btnDiscard: pick(
    "border border-white/20 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition cursor-pointer disabled:opacity-60",
    "border border-gray-400 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer disabled:opacity-60",
  ),
  btnGhost: pick(
    "border border-white/20 text-gray-300 px-5 py-2 rounded-lg text-sm hover:bg-white/5 cursor-pointer transition",
    "border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 cursor-pointer transition",
  ),
  btnPhoto: pick(
    "w-full text-center border border-white/20 text-gray-300 text-sm font-medium py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition",
    "w-full text-center border border-gray-400 text-gray-700 text-sm font-medium py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition",
  ),

  link: pick("text-sm text-blue-400 hover:underline", "text-sm text-blue-600 hover:underline"),
  linkBold: pick(
    "text-sm font-semibold text-blue-400 hover:underline",
    "text-sm font-semibold text-blue-600 hover:underline",
  ),
  backLink: pick(
    "inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6",
    "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6",
  ),

  listDivide: pick("divide-y divide-white/5", "divide-y divide-gray-50"),
  listRowHover: pick("hover:bg-white/5", "hover:bg-gray-50"),
  tabBorder: pick("border-b border-white/10", "border-b border-gray-200"),
  innerPanel: pick(
    "text-sm text-gray-300 mt-3 bg-white/5 rounded-lg px-3 py-2",
    "text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg px-3 py-2",
  ),
  innerPanelBox: pick(
    "bg-white/5 rounded-xl p-4 space-y-2 text-sm text-gray-300",
    "bg-gray-50 rounded-xl p-4 space-y-2 text-sm",
  ),

  modal: pick(
    "relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-xl shadow-xl overflow-hidden",
    "relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden",
  ),
  modalMd: pick(
    "bg-[#111827] border border-white/10 rounded-xl shadow-xl w-full max-w-md p-6",
    "bg-white rounded-xl shadow-xl w-full max-w-md p-6",
  ),
  modalLg: pick(
    "bg-[#111827] border border-white/10 rounded-xl p-6 w-[500px] flex flex-col gap-4",
    "bg-white rounded-xl p-6 w-[500px] flex flex-col gap-4",
  ),

  messagesShell: pick(
    "bg-[#111827] border border-white/10 rounded-2xl shadow-sm overflow-hidden min-h-[620px] flex flex-col md:flex-row",
    "bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[620px] flex flex-col md:flex-row",
  ),
  messagesAside: pick(
    "w-full md:w-[320px] border-b md:border-b-0 md:border-r border-white/10 flex flex-col max-h-[40vh] md:max-h-none",
    "w-full md:w-[320px] border-b md:border-b-0 md:border-r border-gray-100 flex flex-col max-h-[40vh] md:max-h-none",
  ),
  messagesPanel: pick(
    "flex-1 min-w-0 p-3 sm:p-4 bg-[#0B0F1A]",
    "flex-1 min-w-0 p-3 sm:p-4 bg-[#f7f8fb]",
  ),

  contactPage: pick("min-h-screen bg-[#0B0F1A]", "min-h-screen bg-white"),
  contactCard: pick(
    "bg-[#111827] border border-white/10 rounded-2xl p-8",
    "bg-gray-50 border border-gray-200 rounded-2xl p-8",
  ),
  contactTile: pick(
    "bg-[#111827] border border-white/10 rounded-2xl px-6 py-5 flex items-center gap-4 hover:border-blue-500/50 transition",
    "bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 hover:border-blue-400 transition",
  ),
  contactTileLabel: pick(
    "text-sm text-gray-400 uppercase tracking-widest mb-1",
    "text-sm text-gray-600 uppercase tracking-widest mb-1",
  ),
  contactTileValue: pick(
    "text-sm font-semibold text-white",
    "text-sm font-semibold text-gray-900",
  ),
  selectTrigger: pick(
    "w-full flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-left text-white cursor-pointer transition hover:border-white/20",
    "w-full flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-left text-gray-700 cursor-pointer transition hover:border-gray-300",
  ),
  selectTriggerOpen: pick(
    "border-blue-500 ring-2 ring-blue-500/30",
    "border-blue-400 ring-2 ring-blue-400/30",
  ),
  selectMenu: pick(
    "bg-[#111827] border border-white/10 rounded-xl shadow-xl overflow-hidden p-1.5 flex flex-col gap-0.5",
    "bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden p-1.5 flex flex-col gap-0.5",
  ),
  selectOption: pick(
    "flex w-full items-center px-3 py-2.5 text-sm text-left rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer",
    "flex w-full items-center px-3 py-2.5 text-sm text-left rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer",
  ),
  selectOptionActive: pick(
    "flex w-full items-center px-3 py-2.5 text-sm text-left rounded-lg bg-blue-600 text-white cursor-pointer",
    "flex w-full items-center px-3 py-2.5 text-sm text-left rounded-lg bg-blue-600 text-white cursor-pointer",
  ),

  footer: "bg-black",

  gameChip: pick(
    "relative flex items-center gap-3 border border-white/10 rounded-lg px-3 py-3 group",
    "relative flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-3 group",
  ),
  gamePick: pick(
    "w-full flex items-center gap-3 border border-white/10 hover:border-blue-400 hover:bg-white/5 rounded-lg px-3 py-3 text-left transition cursor-pointer",
    "w-full flex items-center gap-3 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg px-3 py-3 text-left transition cursor-pointer",
  ),
  gameIconWrap: pick(
    "w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0",
    "w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0",
  ),

  detailStatCard: pick(
    "bg-[#111827] border border-white/10 rounded-xl p-4",
    "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
  ),
  detailPanel: pick(
    "bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-sm",
    "bg-white border border-gray-200 rounded-2xl p-5 shadow-sm",
  ),
  detailPanelLg: pick(
    "bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-sm",
    "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm",
  ),
  detailInset: pick(
    "bg-white/5 border border-white/5 rounded-lg px-3 py-2.5",
    "bg-gray-50 rounded-lg px-3 py-2.5",
  ),
  detailSupportCard: pick(
    "bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center",
    "bg-gray-100 border border-gray-200 rounded-2xl p-5 text-center",
  ),
  detailIconWrap: pick(
    "w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0",
    "w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0",
  ),
  detailIconWrapLg: pick(
    "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0",
    "w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0",
  ),
  detailPrizeHighlight: pick("text-4xl font-bold text-blue-400", "text-4xl font-bold text-blue-600"),
  detailAlertWarning: pick(
    "rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-center",
    "rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-center",
  ),
  detailAlertWarningTitle: pick("text-sm font-semibold text-amber-400", "text-sm font-semibold text-amber-800"),
  detailAlertWarningBody: pick("text-xs text-amber-300/90 mt-1", "text-xs text-amber-700 mt-1"),
  detailAlertSuccess: pick(
    "rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-center",
    "rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-center",
  ),
  detailAlertPending: pick(
    "rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-center",
    "rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-center",
  ),
  detailAwardCard: pick(
    "rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-2",
    "rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2",
  ),
  detailBorder: pick("border-white/10", "border-gray-100"),
  detailBorderSubtle: pick("border-white/5", "border-gray-50"),
  carouselBtn: pick(
    "w-9 h-9 rounded-full border border-white/15 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:text-gray-300 disabled:hover:border-white/15 cursor-pointer",
    "w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 cursor-pointer",
  ),
  carouselDot: pick("w-2 bg-white/20 hover:bg-white/30", "w-2 bg-gray-300 hover:bg-gray-400"),
  carouselDotActive: "w-6 bg-blue-600",
} as const;

export function accountTabClass(active: boolean): string {
  if (active) {
    return pick(
      "pb-3 text-sm font-semibold border-b-2 -mb-px transition cursor-pointer text-blue-400 border-blue-500",
      "pb-3 text-sm font-semibold border-b-2 -mb-px transition cursor-pointer text-blue-600 border-blue-600",
    );
  }
  return pick(
    "pb-3 text-sm font-semibold border-b-2 -mb-px transition cursor-pointer text-gray-400 border-transparent hover:text-gray-200",
    "pb-3 text-sm font-semibold border-b-2 -mb-px transition cursor-pointer text-gray-500 border-transparent hover:text-gray-800",
  );
}

const badgeBase = "text-xs font-bold px-2.5 py-1 rounded-full uppercase border";

export function tournamentStatusBadge(
  status: "ongoing" | "upcoming" | "history",
): string {
  const map = {
    ongoing: pick(
      "bg-green-500/15 text-green-400 border-green-500/30",
      "bg-green-100 text-green-700 border-transparent",
    ),
    upcoming: pick(
      "bg-blue-500/15 text-blue-400 border-blue-500/30",
      "bg-blue-100 text-blue-700 border-transparent",
    ),
    history: pick(
      "bg-white/10 text-gray-400 border-white/15",
      "bg-gray-100 text-gray-600 border-transparent",
    ),
  };
  return `${badgeBase} ${map[status]}`;
}

export function myTournamentRegistrationBadge(status?: string | null): string {
  if (status === "PENDING") {
    return `${badgeBase} ${pick(
      "bg-amber-500/15 text-amber-400 border-amber-500/30",
      "bg-amber-100 text-amber-700 border-transparent",
    )}`;
  }
  if (status === "REGISTERED") {
    return `${badgeBase} ${pick(
      "bg-green-500/15 text-green-400 border-green-500/30",
      "bg-green-100 text-green-700 border-transparent",
    )}`;
  }
  if (status === "REJECTED") {
    return `${badgeBase} ${pick(
      "bg-red-500/15 text-red-400 border-red-500/30",
      "bg-red-100 text-red-700 border-transparent",
    )}`;
  }
  return `${badgeBase} ${pick(
    "bg-white/10 text-gray-400 border-white/15",
    "bg-gray-100 text-gray-600 border-transparent",
  )}`;
}

export function myTournamentPaymentBadge(status?: string | null): string {
  const s = status?.toUpperCase();
  if (s === "COMPLETED") {
    return `${badgeBase} ${pick(
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      "bg-emerald-100 text-emerald-800 border-transparent",
    )}`;
  }
  if (s === "INITIATED") {
    return `${badgeBase} ${pick(
      "bg-sky-500/15 text-sky-400 border-sky-500/30",
      "bg-sky-100 text-sky-700 border-transparent",
    )}`;
  }
  if (s === "FAILED") {
    return `${badgeBase} ${pick(
      "bg-rose-500/15 text-rose-400 border-rose-500/30",
      "bg-rose-100 text-rose-700 border-transparent",
    )}`;
  }
  return `${badgeBase} ${pick(
    "bg-white/10 text-gray-400 border-white/15",
    "bg-gray-100 text-gray-600 border-transparent",
  )}`;
}

export function notificationTabClass(active: boolean): string {
  const base = "pb-3 text-sm font-medium border-b-2 -mb-px cursor-pointer flex items-center gap-2";
  if (active) {
    return `${base} ${pick("text-white border-white", "text-gray-900 border-gray-900")}`;
  }
  return `${base} ${pick(
    "text-gray-400 border-transparent hover:text-gray-200",
    "text-gray-500 border-transparent hover:text-gray-800",
  )}`;
}

export function notificationBadgeClass(active: boolean): string {
  const base = "text-xs font-semibold px-2 py-0.5 rounded";
  if (active) return `${base} bg-[#f4a89a] text-white`;
  return `${base} ${pick("bg-white/10 text-gray-400", "bg-gray-200 text-gray-600")}`;
}

export function notificationListRowClass(index: number): string {
  const hover = pick("hover:bg-white/5", "hover:bg-gray-50");
  const bg = pick(
    index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent",
    index % 2 === 0 ? "bg-white" : "bg-[#f7f8fa]",
  );
  return `flex items-center gap-3 px-5 py-3.5 cursor-pointer transition ${hover} ${bg}`;
}

export function messagesRoomClass(active: boolean): string {
  const base = "w-full flex items-center gap-3 px-4 py-3 text-left transition";
  if (active) {
    return `${base} ${pick(
      "bg-blue-600/20 border-l-4 border-blue-500",
      "bg-blue-50 border-l-4 border-blue-600",
    )}`;
  }
  return `${base} ${pick(
    "hover:bg-white/5 border-l-4 border-transparent",
    "hover:bg-gray-50 border-l-4 border-transparent",
  )}`;
}

export function detailTabClass(active: boolean): string {
  const base =
    "pb-3 text-sm font-semibold border-b-2 -mb-px transition cursor-pointer flex items-center gap-2 whitespace-nowrap";
  if (active) {
    return `${base} ${pick(
      "text-blue-400 border-blue-500",
      "text-blue-600 border-blue-600",
    )}`;
  }
  return `${base} ${pick(
    "text-gray-400 border-transparent hover:text-gray-200",
    "text-gray-500 border-transparent hover:text-gray-800",
  )}`;
}

export function detailIconChipBg(
  tone: "purple" | "amber" | "blue" | "gray",
): string {
  const map = {
    purple: pick("bg-purple-500/15", "bg-purple-100"),
    amber: pick("bg-amber-500/15", "bg-amber-100"),
    blue: pick("bg-blue-500/15", "bg-blue-100"),
    gray: pick("bg-white/10", "bg-gray-100"),
  };
  return map[tone];
}
