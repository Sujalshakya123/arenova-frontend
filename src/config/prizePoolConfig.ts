/**
 * Prize pool funding model (Option B: entry-fee-funded 70/20/10).
 *
 * UNDO: set PRIZE_POOL_MODE to "fixed" and restart the frontend dev server.
 * Also set arenova.prize-pool.mode=fixed in application.properties and restart backend.
 */
export type PrizePoolMode = "fixed" | "entry_fee_funded";

export const PRIZE_POOL_MODE: PrizePoolMode = "entry_fee_funded";

export const isEntryFeeFundedPrizePool = () =>
  PRIZE_POOL_MODE === "entry_fee_funded";

export const PRIZE_SPLIT = {
  prize: 70,
  organizer: 20,
  platform: 10,
} as const;

/** % of total revenue (not % of prize pool). 40 + 30 = 70% player pool. */
export const PLACE_SPLIT = {
  first: 40,
  second: 30,
} as const;
