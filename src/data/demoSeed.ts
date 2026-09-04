/** Bump when default datasets change so stale localStorage resets. */
export const DEMO_DATA_VERSION = "2026-08-26-polish-no-demo-catalog";

const VERSION_KEY = "arenova_demo_data_version";

/** Clears outdated local caches. Does not insert demo rows. */
export const ensureDemoSeedVersion = () => {
  if (typeof window === "undefined") return false;

  if (localStorage.getItem(VERSION_KEY) === DEMO_DATA_VERSION) return false;

  localStorage.removeItem("arenova_organizer_tournaments");
  localStorage.removeItem("arenova_organizer_projects");
  localStorage.removeItem("arenova_platform_games");
  localStorage.removeItem("arenova_game_catalog_v1");
  localStorage.removeItem("arenova_tournament_catalog_v1");
  localStorage.removeItem("arenova_player_announcements");
  try {
    sessionStorage.removeItem("arenova_game_catalog_v1");
    sessionStorage.removeItem("arenova_tournament_catalog_v1");
  } catch {
    // ignore
  }
  // Keep arenova_custom_games — titles added in Super Admin must survive seed bumps.
  localStorage.setItem(VERSION_KEY, DEMO_DATA_VERSION);
  return true;
};
