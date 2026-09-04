import { createContext, useContext } from "react";
import type { ResolvedTournamentDetail } from "./resolveTournamentDetail";
import { getDefaultTournamentDetail } from "./resolveTournamentDetail";

export type TournamentDetailContextValue = ResolvedTournamentDetail;

const TournamentDetailContext = createContext<TournamentDetailContextValue>(
  getDefaultTournamentDetail(),
);

export const TournamentDetailProvider = TournamentDetailContext.Provider;

export const useTournamentDetail = () => useContext(TournamentDetailContext);
