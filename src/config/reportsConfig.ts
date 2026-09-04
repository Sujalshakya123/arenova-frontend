/**
 * Organizer financial reports + enhanced Super Admin settlement filters.
 *
 * UNDO: set REPORTS_ENABLED to false and restart the frontend dev server.
 * Also set arenova.reports.enabled=false in application.properties and restart backend.
 */
export const REPORTS_ENABLED = true;

// If you want to quickly undo the new settlement-status filter UI:
// set this to false and refresh the frontend.
export const REPORTS_STATUS_FILTER_ENABLED = true;

// If you want to hide 1st/2nd winner names inside the Super Admin settlements table.
export const SUPER_ADMIN_SETTLEMENT_WINNER_NAMES_ENABLED = true;
