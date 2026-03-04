import React, { useState, useEffect } from "react";
import { BookMarked, Users, Clock, Heart, Plus, Mail, Shield, UserX, UserCheck, Trash2, Compass } from "lucide-react";
import { getDaysReading, calculateProgress } from "../../utils/helpers";
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
import { DEFAULT_COMMUNITY_ID } from "../../utils/constants";

function readerBookKey(reader) {
  const bookId = reader.currentBook?.id ?? "";
  return `${reader.uid}-${bookId}`;
}

export const CommunityView = ({ currentUser, userBooks, activeCommunityId, onSelectCommunity, userCommunityIds = [], addCommunityToUser, syncUserCommunityIds }) => {
  const [communities, setCommunities] = useState([]);
  const [communityReaders, setCommunityReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingToUid, setSendingToUid] = useState(null);
  const [sendError, setSendError] = useState(null);
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

  const currentUserReading = userBooks.find((b) => b.status === "reading");
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
        communityReaders.map(async (reader) => {
          if (!reader.currentBook) return;
          const canSend = await encouragementService.canSendEncouragement(
            currentUser.uid,
            reader.uid,
            reader.currentBook.id,
          );
          if (!canSend) inCooldown.add(readerBookKey(reader));
        }),
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            Membres
          </h3>
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
              className="flex-1 min-w-[180px] px-3 py-2 border border-primary-500 rounded-lg focus:ring-2 focus:ring-primary-200"
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
      )}

      {/* Llibre actual de l'usuari — només si té comunitat activa */}
      {communities.length > 0 && currentUserReading && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary-500 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
              Estàs llegint
            </h3>
          </div>
          <div className="flex gap-4">
            <img
              src={currentUserReading.coverUrl}
              alt={currentUserReading.title}
              className="w-28 h-40 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h4 className="font-serif text-2xl text-slate-800 mb-1">
                {currentUserReading.title}
              </h4>
              <p className="text-slate-600 mb-1">{currentUserReading.author}</p>
              <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700 mb-3">
                {currentUserReading.genre}
              </span>
              {currentUserReading.currentPage && currentUserReading.pages && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-slate-700 mb-2">
                    <span>{currentUserReading.currentPage} pàgines</span>
                    <span>
                      {calculateProgress(
                        currentUserReading.currentPage,
                        currentUserReading.pages,
                      )}
                      %
                    </span>
                  </div>
                  <div className="bg-white/60 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all"
                      style={{
                        width: `${calculateProgress(currentUserReading.currentPage, currentUserReading.pages)}%`,
                      }}
                    />
                  </div>
                  {currentUserReading.startDate && (
                    <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Fa {getDaysReading(currentUserReading.startDate)} dies
                      llegint
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* La resta de lectors — només si té comunitat activa */}
      {communities.length > 0 && (
      <div>
        <h3 className="text-xl font-serif text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-700" />
          La resta de lectors ara mateix
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Carregant comunitat...</p>
          </div>
        ) : communityReaders.length === 0 ? (
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
            {communityReaders.map((reader) => (
              <div
                key={reader.uid}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary-500 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={reader.photoURL}
                    alt={reader.displayName}
                    className="w-12 h-12 rounded-full border-2 border-primary-500"
                  />
                  <div>
                    <h4 className="font-medium text-slate-800">
                      {reader.displayName}
                    </h4>
                    <p className="text-xs text-slate-500">està llegint</p>
                  </div>
                </div>

                {reader.currentBook && (
                  <div className="flex gap-3">
                    <img
                      src={reader.currentBook.coverUrl}
                      alt={reader.currentBook.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h5 className="font-serif text-lg text-slate-800 mb-1 line-clamp-2">
                        {reader.currentBook.title}
                      </h5>
                      <p className="text-sm text-slate-600 mb-2">
                        {reader.currentBook.author}
                      </p>
                      <span className="inline-block px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700 mb-2">
                        {reader.currentBook.genre}
                      </span>
                      <div className="mt-2">
                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                          <div
                            className="bg-slate-600 h-full rounded-full"
                            style={{
                              width: `${calculateProgress(reader.currentBook.currentPage, reader.currentBook.pages)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>
                            {reader.currentBook.currentPage} /{" "}
                            {reader.currentBook.pages}
                          </span>
                          <span>
                            {calculateProgress(
                              reader.currentBook.currentPage,
                              reader.currentBook.pages,
                            )}
                            %
                          </span>
                        </div>
                        {reader.currentBook.startDate && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getDaysReading(reader.currentBook.startDate)} dies
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!reader.currentBook) return;
                      setSendError(null);
                      setSendingToUid(reader.uid);
                      try {
                        await encouragementService.sendEncouragement(
                          currentUser.uid,
                          currentUser.displayName ?? "Algú",
                          reader.uid,
                          reader.currentBook.id,
                          reader.currentBook.title,
                        );
                        const key = readerBookKey(reader);
                        setSentKeys((prev) => new Set([...prev, key]));
                        setCooldownKeys((prev) => new Set([...prev, key]));
                      } catch (err) {
                        setSendError(reader.uid);
                        console.error(err);
                      } finally {
                        setSendingToUid(null);
                      }
                    }}
                    disabled={
                      sendingToUid !== null ||
                      sentKeys.has(readerBookKey(reader)) ||
                      !reader.currentBook ||
                      cooldownKeys.has(readerBookKey(reader))
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="w-4 h-4" />
                    {sentKeys.has(readerBookKey(reader))
                      ? "Enviat ✓"
                      : cooldownKeys.has(readerBookKey(reader))
                        ? "Enviat"
                        : sendingToUid === reader.uid
                          ? "Enviant..."
                          : sendError === reader.uid
                            ? "Error. Torna-ho a intentar"
                            : "Encoratja"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Estadístiques - inclou usuari actual + la resta de lectors */}
      {communities.length > 0 && !loading &&
        (communityReaders.length > 0 || currentUserReading) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
            <h3 className="text-lg font-serif text-slate-800 mb-4">
              Estadístiques de la Comunitat
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-serif text-slate-800">
                  {communityReaders.length +
                    (currentUserReading ? 1 : 0)}
                </p>
                <p className="text-sm text-slate-600">Lectors actius</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif text-slate-800">
                  {communityReaders.length +
                    (currentUserReading ? 1 : 0)}
                </p>
                <p className="text-sm text-slate-600">Llibres en curs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif text-slate-800">
                  {Math.round(
                    (communityReaders.reduce(
                      (sum, r) =>
                        sum +
                        calculateProgress(
                          r.currentBook?.currentPage,
                          r.currentBook?.pages,
                        ),
                      0,
                    ) +
                      calculateProgress(
                        currentUserReading?.currentPage,
                        currentUserReading?.pages,
                      )) /
                      (communityReaders.length +
                        (currentUserReading ? 1 : 0)),
                  )}
                  %
                </p>
                <p className="text-sm text-slate-600">Progrés mitjà</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif text-slate-800">
                  {
                    new Set(
                      [
                        ...communityReaders.map((r) => r.currentBook?.genre),
                        currentUserReading?.genre,
                      ].filter(Boolean),
                    ).size
                  }
                </p>
                <p className="text-sm text-slate-600">Gèneres diversos</p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
