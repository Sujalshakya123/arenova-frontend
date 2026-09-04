import {
  PLACE_SPLIT,
  PRIZE_SPLIT,
} from "../config/prizePoolConfig";

export type PrizePoolEconomics = {
  collectedTotalNpr: number;
  paidEntryCount: number;
  prizePoolCurrentNpr: number;
  prizePoolAtCapacityNpr: number;
  organizerShareNpr: number;
  platformShareNpr: number;
  prizeFirstNpr: number;
  prizeSecondNpr: number;
};

const percentOf = (amount: number, percent: number) =>
  amount > 0 && percent > 0 ? Math.floor((amount * percent) / 100) : 0;

export const formatRsNpr = (npr: number) =>
  npr > 0 ? `Rs. ${npr.toLocaleString("en-NP")}` : "Rs. 0";

export const calculatePrizePoolEconomics = (options: {
  entryFeeNpr: number;
  paidEntryCount: number;
  maxSlots: number;
}): PrizePoolEconomics => {
  const collected = options.entryFeeNpr * options.paidEntryCount;
  const atCapacityCollected = options.entryFeeNpr * options.maxSlots;
  const prizePoolCurrentNpr = percentOf(collected, PRIZE_SPLIT.prize);
  const prizePoolAtCapacityNpr = percentOf(atCapacityCollected, PRIZE_SPLIT.prize);

  return {
    collectedTotalNpr: collected,
    paidEntryCount: options.paidEntryCount,
    prizePoolCurrentNpr,
    prizePoolAtCapacityNpr,
    organizerShareNpr: percentOf(collected, PRIZE_SPLIT.organizer),
    platformShareNpr: percentOf(collected, PRIZE_SPLIT.platform),
    prizeFirstNpr: percentOf(collected, PLACE_SPLIT.first),
    prizeSecondNpr: percentOf(collected, PLACE_SPLIT.second),
  };
};

export const calculatePreviewEconomics = (options: {
  entryFeeNpr: number;
  maxSlots: number;
}): PrizePoolEconomics => {
  const atCapacityCollected = options.entryFeeNpr * options.maxSlots;
  const prizePoolAtCapacityNpr = percentOf(atCapacityCollected, PRIZE_SPLIT.prize);

  return {
    collectedTotalNpr: 0,
    paidEntryCount: 0,
    prizePoolCurrentNpr: 0,
    prizePoolAtCapacityNpr,
    organizerShareNpr: percentOf(atCapacityCollected, PRIZE_SPLIT.organizer),
    platformShareNpr: percentOf(atCapacityCollected, PRIZE_SPLIT.platform),
    prizeFirstNpr: percentOf(atCapacityCollected, PLACE_SPLIT.first),
    prizeSecondNpr: percentOf(atCapacityCollected, PLACE_SPLIT.second),
  };
};
