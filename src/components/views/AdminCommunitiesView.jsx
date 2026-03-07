import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit2, Archive, UserX, UserCheck } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import { isSuperadmin } from "../../services/superadminService";
import {
  listCommunitiesForAdmin,
  updateCommunity,
  createCommunity,
  getCommunityMembersAllStatuses,
  setMemberStatus,
  updateMemberRole,
  createOrResendInvite,
  requestSendInviteEmail,
} from "../../services/communityManagementService";

const PAGE_SIZE = 10;
const STATUS_LABELS = { active: "Activa", archived: "Arxivada", dissolved: "Dissolta", inactive: "Inactiva" };

export const AdminCommunitiesView = ({ currentUser, onBack }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [members, setMembers] = useState({});
  const [memberLoading, setMemberLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;
    let cancelled = false;
    isSuperadmin(currentUser.uid)
      .then((v) => {
        if (!cancelled) {
          setAuthorized(v);
          if (!v) navigate(ROUTES.PROFILE, { replace: true });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error comprovant superadmin:", err);
          setAuthorized(false);
          navigate(ROUTES.PROFILE, { replace: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid, navigate]);

  const loadCommunities = async (startAfterDoc = null) => {
    if (!authorized) return;
    setLoading(true);
    setError(null);
    try {
      const { communities: list, lastDoc: doc } = await listCommunitiesForAdmin({
        pageSize: PAGE_SIZE,
        startAfterDoc,
      });
      setCommunities((prev) => (startAfterDoc ? [...prev, ...list] : list));
      setLastDoc(doc);
    } catch (err) {
      setError(err.message || "Error carregant comunitats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized === true) loadCommunities();
  }, [authorized]);

  const filteredCommunities = search.trim()
    ? communities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : communities;

  const handleCreate = async (data) => {
    try {
      await createCommunity(currentUser.uid, data, {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        email: currentUser.email,
      });
      setShowCreate(false);
      loadCommunities();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (communityId, data) => {
    try {
      await updateCommunity(communityId, data);
      setEditingId(null);
      loadCommunities();
    } catch (err) {
      throw err;
    }
  };

  const handleArchive = async (c) => {
    if (!window.confirm(`Desactivar la comunitat "${c.name}"?`)) return;
    try {
      await updateCommunity(c.id, { status: "archived" });
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReactivate = async (c) => {
    try {
      await updateCommunity(c.id, { status: "active" });
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const loadMembers = async (communityId) => {
    setMemberLoading(true);
    try {
      const list = await getCommunityMembersAllStatuses(communityId);
      setMembers((prev) => ({ ...prev, [communityId]: list }));
    } catch (err) {
      setError(err.message);
    } finally {
      setMemberLoading(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!members[id]) loadMembers(id);
    }
  };

  const handleRemoveMember = async (communityId, userId) => {
    if (!window.confirm("Expulsar aquest membre?")) return;
    try {
      await setMemberStatus(communityId, userId, "left");
      loadMembers(communityId);
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlockMember = async (communityId, userId) => {
    if (!window.confirm("Bloquejar aquest membre?")) return;
    try {
      await setMemberStatus(communityId, userId, "banned");
      loadMembers(communityId);
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnblockMember = async (communityId, userId) => {
    try {
      await setMemberStatus(communityId, userId, "active");
      loadMembers(communityId);
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeRole = async (communityId, userId, role) => {
    try {
      await updateMemberRole(communityId, userId, role);
      loadMembers(communityId);
      loadCommunities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInvite = async (communityId) => {
    const email = inviteEmail.trim();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Introdueix un correu electrònic vàlid.");
      return;
    }
    setInviteLoading(true);
    setInviteSuccess(null);
    setError(null);
    try {
      const { inviteId } = await createOrResendInvite(communityId, email, currentUser.uid);
      requestSendInviteEmail(inviteId, () => currentUser.getIdToken());
      setInviteSuccess("Hem enviat la invitació si aquest correu és vàlid.");
      setInviteEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  if (authorized === null || authorized === false) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-slate-800">Gestió de comunitats</h2>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-primary-700 hover:text-primary-800"
          >
            ← Tornar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-red-800">{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-red-600 hover:underline">
            Tancar
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cercar comunitat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-primary-500 rounded-lg"
        />
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" /> Crear comunitat
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
          <p className="text-slate-600 mt-4">Carregant comunitats...</p>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 border border-primary-500 text-center">
          <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 mb-4">Cap comunitat. Crea la primera.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Crear comunitat
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredCommunities.map((c) => (
            <li
              key={c.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-primary-500 shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg text-slate-800">{c.name}</h3>
                  <p className="text-sm text-slate-600">
                    {STATUS_LABELS[c.status] ?? c.status} · {c.memberCount} membres
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(c.id)}
                    className="p-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {c.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => handleArchive(c)}
                      className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg"
                      aria-label="Desactivar"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReactivate(c)}
                      className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                      aria-label="Reactivar"
                    >
                      Reactivar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleExpand(c.id)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {expandedId === c.id ? "Amagar membres" : "Veure membres"}
                  </button>
                </div>
              </div>

              {expandedId === c.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  {memberLoading && !members[c.id] ? (
                    <p className="text-slate-500">Carregant membres...</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Afegir membre per email
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="email@exemple.cat"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1 px-3 py-2 border border-primary-500 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleInvite(c.id)}
                            disabled={inviteLoading || !inviteEmail.trim()}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                          >
                            Invitar
                          </button>
                        </div>
                        {inviteSuccess && (
                          <p className="text-sm text-primary-700 mt-1">{inviteSuccess}</p>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {(members[c.id] ?? []).map((m) => (
                          <li
                            key={m.userId}
                            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                          >
                            <div>
                              <span className="font-medium text-slate-800">
                                {m.email || m.displayName || m.userId}
                              </span>
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100">
                                {m.role}
                              </span>
                              {m.status !== "active" && (
                                <span className="ml-2 text-xs text-amber-700">({m.status})</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {m.status === "active" && (
                                <>
                                  <select
                                    value={m.role}
                                    onChange={(e) => handleChangeRole(c.id, m.userId, e.target.value)}
                                    className="text-sm border rounded px-2 py-1"
                                  >
                                    <option value="participant">Participant</option>
                                    <option value="admin">Admin</option>
                                    <option value="owner">Owner</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleBlockMember(c.id, m.userId)}
                                    className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                                    aria-label="Bloquejar"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(c.id, m.userId)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    aria-label="Expulsar"
                                  >
                                    Eliminar
                                  </button>
                                </>
                              )}
                              {m.status === "banned" && (
                                <button
                                  type="button"
                                  onClick={() => handleUnblockMember(c.id, m.userId)}
                                  className="flex items-center gap-1 px-2 py-1 text-sm bg-primary-100 text-primary-800 rounded"
                                >
                                  <UserCheck className="w-4 h-4" /> Desbloquejar
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && lastDoc && (
        <button
          type="button"
          onClick={() => loadCommunities(lastDoc)}
          className="w-full py-2 border border-primary-500 rounded-lg text-primary-700 hover:bg-primary-50"
        >
          Carregar més
        </button>
      )}

      {showCreate && (
        <CreateCommunityModal
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingId && (
        <EditCommunityModal
          communityId={editingId}
          community={communities.find((x) => x.id === editingId)}
          onSave={(data) => handleUpdate(editingId, data)}
          onCancel={() => setEditingId(null)}
        />
      )}
    </div>
  );
};

function CreateCommunityModal({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr("El nom és obligatori.");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await onSave({ name: name.trim(), description: description.trim() || null, visibility });
    } catch (error) {
      setErr(error.message || "Error al crear.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-serif text-slate-800 mb-4">Crear comunitat</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripció</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Privacitat</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
            >
              <option value="private">Privada</option>
              <option value="open">Pública</option>
            </select>
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600">
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? "Creant..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCommunityModal({ communityId, community, onSave, onCancel }) {
  const [name, setName] = useState(community?.name ?? "");
  const [description, setDescription] = useState(community?.description ?? "");
  const [visibility, setVisibility] = useState(community?.visibility ?? "private");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr("El nom és obligatori.");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await onSave({ name: name.trim(), description: description.trim() || null, visibility });
    } catch (error) {
      setErr(error.message || "Error al desar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-serif text-slate-800 mb-4">Editar comunitat</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripció</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Privacitat</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-2 border border-primary-500 rounded-lg"
            >
              <option value="private">Privada</option>
              <option value="open">Pública</option>
            </select>
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600">
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? "Desant..." : "Desar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
