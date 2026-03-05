import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookMarked, Users, Plus, Mail, Shield, UserX, UserCheck, Trash2, Compass, BarChart2, Trophy } from "lucide-react";
import { ReadingBookCard } from "../common/ReadingBookCard";
import { getDaysReading, safeProgress } from "../../utils/helpers";
import { communityService } from "../../services/communityService";
import { encouragementService } from "../../services/encouragementService";
import { authService } from "../../services/authService";
import {
  getUserCommunities,
  createCommunity,
  getCommunity,
  getCommunityMembers,
  getMemberRole,
  createOrResendInvite,
  requestSendInviteEmail,
  setMemberStatus,
  updateMemberRole,
  getPendingInvitesForEmail,
  acceptInvite,
  rejectInvite,
  dissolveCommunity,
  getOpenCommunities,
  joinOpenCommunity,
} from "../../services/communityManagementService";
import { getLeaderboard } from "../../services/gamificationService";
import { DEFAULT_COMMUNITY_ID, ROUTES } from "../../utils/constants";

/** Ordena per activitat: lastUpdatedAt desc, startDate desc, títol asc */
function sortByActivity(items) {
  return [...items].sort((a, b) => {
    const adate = a.book?.lastUpdatedAt ?? a.book?.startDate ?? 0;
    const bdate = b.book?.lastUpdatedAt ?? b.book?.startDate ?? 0;
    if (adate !== bdate) return (bdate || 0) - (adate || 0);
    const at = (a.book?.title ?? "").toLowerCase();
    const bt = (b.book?.title ?? "").toLowerCase();
    return at.localeCompare(bt);
  });
}

function readerBookKey(reader, book) {
  const bookId = book?.id ?? reader.currentBook?.id ?? "";
  return `${reader.uid}-${bookId}`;
}

export const CommunityView = ({ currentUser, userBooks, activeCommunityId, onSelectCommunity, userCommunityIds = [], addCommunityToUser, syncUserCommunityIds }) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [communityReaders, setCommunityReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingToKey, setSendingToKey] = useState(null);
  const [sendErrorKey, setSendErrorKey] = useState(null);
  const [sentKeys, setSentKeys] = useState(() => new Set());
  const [cooldownKeys, setCooldownKeys] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createVisibility, setCreateVisibility] = useState("private");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [dissolveError, setDissolveError] = useState(null);
  const [openCommunities, setOpenCommunities] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("week");
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const currentUserReadingBooks = userBooks.filter((b) => b.status === "reading");
  const canManageMembers = myRole === "owner" || myRole === "admin";

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUserCommunities(currentUser.uid, userCommunityIds).then(({ communities: list, activeCommunityIds }) => {
      setCommunities(list);
      const idsChanged =
        activeCommunityIds.length !== userCommunityIds.length ||
        activeCommunityIds.some((id, i) => userCommunityIds[i] !== id);
      if (idsChanged && syncUserCommunityIds) {
        syncUserCommunityIds(activeCommunityIds);
      }
    });
  }, [currentUser?.uid, userCommunityIds, syncUserCommunityIds]);

  useEffect(() => {
    if (!activeCommunityId || !currentUser?.uid) return;
    getMemberRole(activeCommunityId, currentUser.uid).then(setMyRole);
    getCommunityMembers(activeCommunityId).then(setMembers);
  }, [activeCommunityId, currentUser?.uid]);

  useEffect(() => {
    if (!members.length) {
      setLeaderboard([]);
      return;
    }
    const memberUserIds = members.map((m) => m.userId);
    const displayNames = Object.fromEntries(
      members.map((m) => [m.userId, m.displayName ?? m.email ?? "Lector"]),
    );
    setLeaderboardLoading(true);
    getLeaderboard(memberUserIds, leaderboardPeriod, displayNames)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]))
      .finally(() => setLeaderboardLoading(false));
  }, [members, leaderboardPeriod]);

  useEffect(() => {
    if (!currentUser?.email) return;
    getPendingInvitesForEmail(currentUser.email).then(setPendingInvites);
  }, [currentUser?.email]);

  useEffect(() => {
    if (!currentUser?.uid || communities.length > 0) return;
    setLoadingOpen(true);
    getOpenCommunities(20, 5)
      .then(setOpenCommunities)
      .catch(() => setOpenCommunities([]))
      .finally(() => setLoadingOpen(false));
  }, [currentUser?.uid, communities.length]);

  // Carregar lectors de la comunitat (només membres de la comunitat activa; excloent l'usuari actual a "Estàs llegint")
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        setLoading(true);
        const readers = await communityService.getCommunityReaders(activeCommunityId);
        const otherReaders = readers.filter((r) => r.uid !== currentUser?.uid);
        setCommunityReaders(otherReaders);
      } catch (error) {
        console.error("Error carregant comunitat:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [currentUser?.uid, activeCommunityId]);

  // Comprovar cooldown (3 dies) per a cada lector+llibre
  useEffect(() => {
    if (!currentUser?.uid || communityReaders.length === 0) return;
    const check = async () => {
      const inCooldown = new Set();
      await Promise.all(
        communityReaders.flatMap((reader) =>
          (reader.currentBooks ?? []).map(async (book) => {
            const canSend = await encouragementService.canSendEncouragement(
              currentUser.uid,
              reader.uid,
              book.id,
            );
            if (!canSend) inCooldown.add(readerBookKey(reader, book));
          }),
        ),
      );
      setCooldownKeys(inCooldown);
    };
    check();
  }, [currentUser?.uid, communityReaders]);

  const activeCommunity = communities.find((c) => c.id === activeCommunityId) ?? communities[0];
  const canDissolve = myRole === "owner" && activeCommunityId && activeCommunityId !== DEFAULT_COMMUNITY_ID;

  const refetchCommunitiesAfterDissolve = () => {
    getUserCommunities(currentUser.uid, userCommunityIds).then(({ communities: list, activeCommunityIds }) => {
      setCommunities(list);
      syncUserCommunityIds?.(activeCommunityIds);
      onSelectCommunity?.(activeCommunityIds[0] ?? null);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-3xl font-serif text-slate-800">
            Comunitat de Lectors
          </h2>
          {communities.length > 0 && (
            <select
              value={activeCommunityId ?? activeCommunity?.id ?? ""}
              onChange={(e) => onSelectCommunity?.(e.target.value || null)}
              className="px-3 py-1.5 text-sm bg-white/80 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 text-slate-700"
              aria-label="Selecciona la comunitat"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear comunitat
          </button>
        </div>
        {communities.length === 0 ? (
          <div className="mt-4 space-y-4">
            <p className="text-slate-600">
              No formes part de cap comunitat. Descobreix comunitats obertes o crea’n una de nova.
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
              <h3 className="text-lg font-serif text-slate-800 mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary-600" />
                5 comunitats obertes més populars
              </h3>
              {loadingOpen ? (
                <p className="text-slate-600">Carregant...</p>
              ) : openCommunities.length === 0 ? (
                <p className="text-slate-600">No hi ha comunitats obertes ara mateix.</p>
              ) : (
                <ul className="space-y-2">
                  {openCommunities.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-medium text-slate-800">{c.name}</span>
                        {c.memberCount != null && (
                          <span className="ml-2 text-xs text-slate-500">{c.memberCount} membres</span>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={joiningId === c.id}
                        onClick={async () => {
                          setJoiningId(c.id);
                          try {
                            await joinOpenCommunity(c.id, currentUser.uid, {
                              displayName: currentUser.displayName ?? undefined,
                              photoURL: currentUser.photoURL ?? undefined,
                              email: currentUser.email ?? undefined,
                            });
                            await addCommunityToUser(c.id);
                            onSelectCommunity?.(c.id);
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setJoiningId(null);
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        {joiningId === c.id ? "Unint..." : "Unir-me"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-600">
            Descobreix què està llegint la comunitat ara mateix
          </p>
        )}
      </div>

      {/* Modal Crear comunitat */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="create-community-title">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-primary-500">
            <h3 id="create-community-title" className="text-xl font-serif text-slate-800 mb-4">
              Crear comunitat
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                if (!createName.trim()) {
                  setCreateError("El nom és obligatori.");
                  return;
                }
                setCreating(true);
                try {
                  const { id, name } = await createCommunity(
                    currentUser.uid,
                    {
                      name: createName.trim(),
                      description: createDescription.trim() || null,
                      visibility: createVisibility,
                    },
                    {
                      displayName: currentUser.displayName ?? undefined,
                      photoURL: currentUser.photoURL ?? undefined,
                      email: currentUser.email ?? undefined,
                    },
                  );
                  await addCommunityToUser(id);
                  onSelectCommunity?.(id);
                  setShowCreateModal(false);
                  setCreateName("");
                  setCreateDescription("");
                  setCreateVisibility("private");
                  getUserCommunities(currentUser.uid, [...(userCommunityIds || []), id]).then(({ communities: list }) => setCommunities(list));
                } catch (err) {
                  setCreateError(err.message || "Error en crear la comunitat.");
                } finally {
                  setCreating(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-200"
                  placeholder="Nom de la comunitat"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripció (opcional)</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-200"
                  placeholder="Descripció breu"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipus</label>
                <select
                  value={createVisibility}
                  onChange={(e) => setCreateVisibility(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-200"
                >
                  <option value="private">Privada (només per invitació)</option>
                  <option value="open">Oberta (qualsevol pot unir-se)</option>
                </select>
              </div>
              {createError && (
                <p className="text-sm text-red-600" role="alert">{createError}</p>
              )}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  disabled={creating || !createName.trim()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg"
                >
                  {creating ? "Creant…" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invitacions pendents */}
      {pendingInvites.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-6 border border-amber-200">
          <h3 className="text-sm font-medium text-amber-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invitacions pendents
          </h3>
          <ul className="space-y-2">
            {pendingInvites.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-amber-100 last:border-0">
                <span className="text-slate-800">{inv.communityName ?? inv.communityId}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const { communityId } = await acceptInvite(inv.id, currentUser.uid, currentUser.email ?? "", {
                          displayName: currentUser.displayName ?? undefined,
                          photoURL: currentUser.photoURL ?? undefined,
                        });
                        await addCommunityToUser(communityId);
                        onSelectCommunity?.(communityId);
                        setPendingInvites((prev) => prev.filter((i) => i.id !== inv.id));
                        getUserCommunities(currentUser.uid, [...(userCommunityIds || []), communityId]).then(({ communities: list }) => setCommunities(list));
                      } catch (e) {
                        console.error(e);
                        setInviteError(e.message ?? "No s’ha pogut acceptar la invitació.");
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <UserCheck className="w-4 h-4" /> Acceptar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await rejectInvite(inv.id);
                      setPendingInvites((prev) => prev.filter((i) => i.id !== inv.id));
                    }}
                    className="px-2 py-1 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    Rebutjar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gestió de membres (owner/admin) — només si l’usuari té comunitats */}
      {communities.length > 0 && canManageMembers && activeCommunityId && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
              Membres
            </h3>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          {canDissolve && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 mb-2">Dissoldre la comunitat és permanent. Tots els membres deixaran de tenir accés.</p>
              <button
                type="button"
                disabled={dissolving}
                onClick={async () => {
                  if (!window.confirm("Segur que vols dissoldre aquesta comunitat? L’acció és permanent.")) return;
                  setDissolveError(null);
                  setDissolving(true);
                  try {
                    await dissolveCommunity(activeCommunityId, currentUser.uid);
                    refetchCommunitiesAfterDissolve();
                  } catch (err) {
                    setDissolveError(err.message || "Error en dissoldre la comunitat.");
                  } finally {
                    setDissolving(false);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {dissolving ? "Dissolent…" : "Dissoldre comunitat"}
              </button>
              {dissolveError && <p className="text-sm text-red-600 mt-2" role="alert">{dissolveError}</p>}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setInviteError(null); setInviteSuccessMessage(null); }}
              placeholder="Email a convidar"
              className="flex-1 min-w-0 px-3 py-2 border border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-200"
            />
            <button
              type="button"
              disabled={inviting || !inviteEmail.trim()}
              onClick={async () => {
                setInviteError(null);
                setInviteSuccessMessage(null);
                const email = inviteEmail.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                  setInviteError("Introdueix un correu vàlid.");
                  return;
                }
                setInviting(true);
                try {
                  const { inviteId } = await createOrResendInvite(activeCommunityId, email, currentUser.uid);
                  requestSendInviteEmail(inviteId, () => authService.getIdToken());
                  setInviteEmail("");
                  setInviteSuccessMessage("Hem enviat la invitació si aquest correu és vàlid.");
                  setTimeout(() => setInviteSuccessMessage(null), 8000);
                } catch (err) {
                  setInviteError(err.message || "Error en enviar la invitació.");
                } finally {
                  setInviting(false);
                }
              }}
              className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" /> Convidar
            </button>
          </div>
          {inviteError && <p className="text-sm text-red-600 mb-2" role="alert">{inviteError}</p>}
          {inviteSuccessMessage && <p className="text-sm text-primary-700 mb-2" role="status">{inviteSuccessMessage}</p>}
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
                <span className="font-medium text-slate-800">{m.email || m.displayName || m.userId}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {m.role === "owner" ? "Propietari" : m.role === "admin" ? "Admin" : "Participant"}
                </span>
                {m.userId !== currentUser.uid && m.role !== "owner" && (
                  <div className="flex gap-1">
                    {myRole === "owner" && m.role === "participant" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await updateMemberRole(activeCommunityId, m.userId, "admin");
                          getCommunityMembers(activeCommunityId).then(setMembers);
                        }}
                        className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                      >
                        Fer admin
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm("Expulsar aquest membre de la comunitat?")) {
                          await setMemberStatus(activeCommunityId, m.userId, "left");
                          getCommunityMembers(activeCommunityId).then(setMembers);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                    >
                      <UserX className="w-3 h-3" /> Expulsar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          </div>
        </div>
      )}

      {/* Llibres que l'usuari està llegint — 1 card per llibre */}
      {communities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
              Estàs llegint
            </h3>
          </div>
          {currentUserReadingBooks.length === 0 ? (
            <p className="text-slate-600">Ara mateix no estàs llegint cap llibre.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortByActivity(
                currentUserReadingBooks.map((book) => ({
                  reader: currentUser,
                  book,
                }))
              ).map(({ reader, book }) => (
                <ReadingBookCard
                  key={readerBookKey(reader, book)}
                  reader={reader}
                  book={book}
                  isCurrentUser
                  onBookClick={(b) => navigate(`${ROUTES.ADD}/${b.id}`)}
                  onReaderClick={() => navigate(ROUTES.PROFILE)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rànquing (leaderboard) */}
      {communities.length > 0 && members.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
              Rànquing
            </h3>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
            <div className="flex gap-2 mb-4">
              {[
                { value: "week", label: "Setmanal" },
                { value: "month", label: "Mensual" },
                { value: "all", label: "Tot" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setLeaderboardPeriod(tab.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    leaderboardPeriod === tab.value
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {leaderboardLoading ? (
              <p className="text-slate-600 text-sm">Carregant rànquing...</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-slate-600 text-sm">Encara no hi ha puntuacions en aquest període.</p>
            ) : (
              <ul className="space-y-2">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.userId}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-sm w-6">#{entry.rank}</span>
                      <span className="font-medium text-slate-800">{entry.displayName}</span>
                    </span>
                    <span className="text-amber-600 font-semibold">{entry.points} pt</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* La resta de lectors — 1 card per llibre */}
      {communities.length > 0 && (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
            La resta de lectors ara mateix
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Carregant comunitat...</p>
          </div>
        ) : (() => {
          const otherReaderBooks = communityReaders.flatMap((reader) =>
            (reader.currentBooks ?? []).map((book) => ({ reader, book }))
          );
          return otherReaderBooks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-primary-500 shadow-lg text-center">
              <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-serif text-slate-800 mb-2">
                Encara no hi ha altres lectors
              </h4>
              <p className="text-slate-600">
                Sigues el primer en compartir què estàs llegint!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortByActivity(otherReaderBooks).map(({ reader, book }) => {
                const key = readerBookKey(reader, book);
                return (
                  <ReadingBookCard
                    key={key}
                    reader={reader}
                    book={book}
                    isCurrentUser={false}
                    onEncourage={async () => {
                      setSendErrorKey(null);
                      setSendingToKey(key);
                      try {
                        await encouragementService.sendEncouragement(
                          currentUser.uid,
                          currentUser.displayName ?? "Algú",
                          reader.uid,
                          book.id,
                          book.title ?? "Llibre",
                        );
                        setSentKeys((prev) => new Set([...prev, key]));
                        setCooldownKeys((prev) => new Set([...prev, key]));
                      } catch (err) {
                        setSendErrorKey(key);
                        console.error(err);
                      } finally {
                        setSendingToKey(null);
                      }
                    }}
                    onBookClick={null}
                    onReaderClick={null}
                    isSent={sentKeys.has(key)}
                    isCooldown={cooldownKeys.has(key)}
                    isSending={sendingToKey === key}
                    sendError={sendErrorKey === key}
                  />
                );
              })}
            </div>
          );
        })()}
      </div>
      )}

      {/* Estadístiques - inclou usuari actual + la resta de lectors */}
      {communities.length > 0 && !loading &&
        (communityReaders.length > 0 || currentUserReadingBooks.length > 0) && (() => {
          const totalBooksInProgress =
            currentUserReadingBooks.length +
            communityReaders.reduce((sum, r) => sum + (r.currentBooks?.length ?? 0), 0);
          const activeReadersCount =
            (currentUserReadingBooks.length > 0 ? 1 : 0) +
            communityReaders.filter((r) => (r.currentBooks?.length ?? 0) > 0).length;
          const allBooksForProgress = [
            ...currentUserReadingBooks.map((b) => ({ currentPage: b.currentPage, pages: b.pages })),
            ...communityReaders.flatMap((r) => (r.currentBooks ?? []).map((b) => ({ currentPage: b.currentPage, pages: b.pages }))),
          ];
          const progressValues = allBooksForProgress
            .map((b) => safeProgress(b.currentPage, b.pages))
            .filter((p) => p != null);
          const avgProgress = progressValues.length > 0
            ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
            : 0;
          const allGenres = [
            ...currentUserReadingBooks.map((b) => b.genre),
            ...communityReaders.flatMap((r) => (r.currentBooks ?? []).map((b) => b.genre)),
          ].filter(Boolean);
          return (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
                  Estadístiques de la Comunitat
                </h3>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-serif text-slate-800">{activeReadersCount}</p>
                  <p className="text-sm text-slate-600">Lectors actius</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-serif text-slate-800">{totalBooksInProgress}</p>
                  <p className="text-sm text-slate-600">Llibres en curs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-serif text-slate-800">{avgProgress}%</p>
                  <p className="text-sm text-slate-600">Progrés mitjà</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-serif text-slate-800">{new Set(allGenres).size}</p>
                  <p className="text-sm text-slate-600">Gèneres diversos</p>
                </div>
              </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
