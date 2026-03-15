import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Ban, ChevronLeft } from "lucide-react";
import { Box, BoxTitle } from "../../design-system";
import { ROUTES } from "../../utils/constants";
import { isSuperadmin } from "../../services/superadminService";
import {
  listUsersForAdmin,
  disableUserForAdmin,
} from "../../services/userManagementService";
import { ConfirmModal } from "../common/ConfirmModal";
import { useToast } from "../../context/ToastContext";

export const AdminUsersView = ({ currentUser, onBack }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [authorized, setAuthorized] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

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
    return () => { cancelled = true; };
  }, [currentUser?.uid, navigate]);

  const loadUsers = async () => {
    if (!authorized) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listUsersForAdmin();
      setUsers(result.users);
    } catch (err) {
      setError(err.message || "Error carregant usuaris.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized === true) loadUsers();
  }, [authorized]);

  const handleDisable = async (user) => {
    setConfirmModal({
      type: "disable",
      user,
      title: "Desactivar usuari",
      message: `Estàs segur que vols desactivar "${user.displayName || user.email}"? L'usuari no podrà iniciar sessió i el seu perfil deixarà de ser visible.`,
    });
  };

  const handleConfirm = async () => {
    if (!confirmModal) return;
    const { user } = confirmModal;
    setActionLoading("disable");
    setConfirmModal(null);
    try {
      await disableUserForAdmin(user.uid, currentUser.uid);
      showSuccess("Usuari desactivat correctament.");
      loadUsers();
    } catch (err) {
      showError(err.message || "Error en executar l'acció.");
    } finally {
      setActionLoading(null);
    }
  };

  if (authorized === null || authorized === false) {
    return null;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
          aria-label="Tornar"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--color-text-secondary)]" />
        </button>
        <h1 className="text-2xl font-serif text-[var(--color-text-primary)]">Gestió d'usuaris</h1>
      </div>

      <Box>
        <BoxTitle icon={Users}>Llistat d'usuaris</BoxTitle>
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}
        {loading ? (
          <p className="text-[var(--color-text-secondary)] py-8 text-center">Carregant usuaris...</p>
        ) : users.length === 0 ? (
          <p className="text-[var(--color-text-secondary)] py-8 text-center">No hi ha usuaris.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {users.map((u) => (
              <li key={u.uid} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--color-text-primary)] truncate">
                    {u.displayName || u.email || u.uid}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">{u.email || u.uid}</p>
                  {u.disabled && (
                    <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Desactivat
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDisable(u)}
                    disabled={u.disabled || u.uid === currentUser?.uid || actionLoading}
                    className="p-2 rounded-lg border border-amber-500 text-amber-700 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Desactivar usuari"
                  >
                    <Ban className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Box>

      <ConfirmModal
        open={!!confirmModal}
        title={confirmModal?.title || ""}
        message={confirmModal?.message || ""}
        confirmLabel="Confirmar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
};
