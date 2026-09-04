import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ActionMenu from "./components/ActionMenu";
import GameModal from "./components/GameModal";
import { usePlatformGames } from "../../context/PlatformGamesContext";
import {
  resolveGameImage,
  type PlatformGame,
} from "../../data/platformGames";
import { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import {
  createGame,
  deleteGame,
  mapApiGameToPlatform,
  mapPlatformToApi,
  updateGame,
  uploadGameBanner,
  uploadGameIcon,
} from "../../services/gameApi";

type Filter = "all" | "available" | "coming_soon";

const normalizeGameSlug = (id: string) => id.replace(/-\d{10,}$/, "");

const Games = () => {
  const { games, setGames, refreshGames } = usePlatformGames();
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<PlatformGame | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PlatformGame | null>(null);
  const [pendingToggle, setPendingToggle] = useState<PlatformGame | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const persist = (next: PlatformGame[]) => {
    setGames(next);
  };

  const filtered = useMemo(() => {
    if (filter === "all") return games;
    return games.filter((g) => g.status === filter);
  }, [games, filter]);

  const openCreate = () => {
    setEditingGame(null);
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (game: PlatformGame) => {
    setEditingGame(game);
    setModalError(null);
    setModalOpen(true);
  };

  const resolveDbId = (game: PlatformGame) => {
    if (game.dbId) return game.dbId;
    const slug = normalizeGameSlug(game.id);
    const match = games.find(
      (g) =>
        g.dbId &&
        (g.id === game.id ||
          g.id === slug ||
          normalizeGameSlug(g.id) === slug),
    );
    return match?.dbId;
  };

  const handleSave = async (
    game: PlatformGame,
    files?: { banner?: File; cover?: File },
  ) => {
    try {
      setSaving(true);
      setError(null);
      setModalError(null);
      const payload = mapPlatformToApi(game);
      const dbId = resolveDbId(game);

      let saved: PlatformGame;
      if (dbId) {
        const response = await updateGame(dbId, payload);
        saved = mapApiGameToPlatform(response.data);
      } else {
        const response = await createGame(payload);
        saved = mapApiGameToPlatform(response.data);
      }

      if (saved.dbId && files?.banner) {
        const bannerResponse = await uploadGameBanner(saved.dbId, files.banner);
        saved = mapApiGameToPlatform(bannerResponse.data.game);
      }

      if (saved.dbId && files?.cover) {
        const iconResponse = await uploadGameIcon(saved.dbId, files.cover);
        saved = mapApiGameToPlatform(iconResponse.data.game);
      }

      const nextGames = dbId || game.dbId
        ? games.map((g) =>
            g.id === game.id || g.dbId === saved.dbId ? saved : g,
          )
        : [...games.filter((g) => g.id !== game.id), saved];
      persist(nextGames);
      setModalOpen(false);
      setEditingGame(null);
      await refreshGames();
      toast.success(dbId || game.dbId ? "Game updated." : "Game created.");
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Could not save game. Log in again as admin and retry.",
      );
      setModalError(message);
      setError(getApiErrorMessage(err, "Could not save game to the server."));
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (game: PlatformGame) => {
    const nextStatus =
      game.status === "available" ? "coming_soon" : "available";
    const nextGame = { ...game, status: nextStatus as PlatformGame["status"] };

    if (!game.dbId) {
      persist(games.map((g) => (g.id === game.id ? nextGame : g)));
      setPendingToggle(null);
      return;
    }

    try {
      setToggling(true);
      setError(null);
      const response = await updateGame(game.dbId, mapPlatformToApi(nextGame));
      const mapped = mapApiGameToPlatform(response.data);
      persist(games.map((g) => (g.dbId === game.dbId ? mapped : g)));
      toast.success(
        nextStatus === "available" ? "Game marked available." : "Game marked coming soon.",
      );
      setPendingToggle(null);
    } catch (err) {
      persist(games.map((g) => (g.id === game.id ? nextGame : g)));
      const message = getApiErrorMessage(err, "Status updated locally only.");
      setError(message);
      toast.error(message);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async (game: PlatformGame) => {
    if (!game.dbId) {
      persist(games.filter((g) => g.id !== game.id));
      toast.success("Game removed.");
      setPendingDelete(null);
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await deleteGame(game.dbId);
      persist(games.filter((g) => g.dbId !== game.dbId));
      toast.success(`"${game.name}" deleted.`);
      setPendingDelete(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not delete game on server.");
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-700">
            {games.length} titles · syncs to /games and game detail pages
          </p>
          {saving && (
            <p className="text-xs text-gray-400 mt-1">Saving to server...</p>
          )}
          {error && (
            <p className="text-xs text-amber-600 mt-1 font-medium">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          <FiPlus size={14} />
          Add game
        </button>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["all", "All"],
            ["available", "Available"],
            ["coming_soon", "Coming Soon"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${
              filter === id
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No games found</h3>
          <p className="text-sm text-gray-700 mt-2">
            {games.length === 0
              ? "Add a game to start listing titles on the public pages."
              : "Nothing matches this filter. Try All, or add a new title."}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-[repeat(auto-fill,300px)] gap-5">
        {filtered.map((game) => (
          <article
            key={game.dbId ?? game.id}
            className="relative w-[300px] h-[400px] rounded-xl overflow-hidden group"
          >
            <img
              src={resolveGameImage(game)}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {game.status === "coming_soon" && (
              <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase px-2 py-1 rounded bg-black/70 text-white">
                Coming Soon
              </span>
            )}
            <div className="absolute top-3 right-3">
              <ActionMenu
                variant="overlay"
                items={[
                    { label: "Edit", onClick: () => openEdit(game), tone: "primary" },
                    {
                      label:
                        game.status === "available"
                          ? "Mark coming soon"
                          : "Mark available",
                      onClick: () => setPendingToggle(game),
                    },
                    {
                      label: "Delete",
                      tone: "danger",
                      onClick: () => setPendingDelete(game),
                    },
                  ]}
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-4">
              <p className="text-white text-sm font-semibold">{game.name}</p>
              <p className="text-gray-300 text-xs mt-1">
                {game.status === "available" ? "Live on platform" : "Not listed yet"}
              </p>
            </div>
          </article>
        ))}
      </div>
      )}

      <GameModal
        isOpen={modalOpen}
        game={editingGame}
        saving={saving}
        error={modalError}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setModalError(null);
          }
        }}
        onSave={(game, files) => void handleSave(game, files)}
      />

      <ConfirmModal
        open={Boolean(pendingToggle)}
        title={
          pendingToggle?.status === "available"
            ? "Mark coming soon?"
            : "Mark available?"
        }
        message={
          pendingToggle
            ? pendingToggle.status === "available"
              ? `Hide "${pendingToggle.name}" from the public games list?`
              : `List "${pendingToggle.name}" on the public games pages?`
            : ""
        }
        confirmLabel="Confirm"
        busy={toggling}
        onConfirm={() => {
          if (pendingToggle) void handleToggleStatus(pendingToggle);
        }}
        onCancel={() => {
          if (!toggling) setPendingToggle(null);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete game?"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        danger
        busy={deleting}
        onConfirm={() => {
          if (pendingDelete) void handleDelete(pendingDelete);
        }}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default Games;
