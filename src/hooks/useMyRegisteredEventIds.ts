import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyRegistrations } from "../services/registrationApi";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";

const ACTIVE = new Set(["PENDING", "REGISTERED"]);

/**
 * Event ids where the logged-in user has an active registration.
 * Empty when logged out or if the request fails.
 */
export const useMyRegisteredEventIds = () => {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    try {
      const response = await getMyRegistrations();
      const next = new Set(
        (response.data ?? [])
          .filter((row) => ACTIVE.has(row.status))
          .map((row) => String(row.eventId)),
      );
      setIds(next);
    } catch {
      setIds(new Set());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
    return subscribeRegistrationsUpdated(() => {
      void refresh();
    });
  }, [refresh]);

  return ids;
};
