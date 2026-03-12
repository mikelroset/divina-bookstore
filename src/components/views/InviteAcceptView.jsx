import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Mail, UserCheck, AlertCircle } from "lucide-react";
import { getInviteById, acceptInvite, rejectInvite } from "../../services/communityManagementService";
import { ROUTES } from "../../utils/constants";

/**
 * Pàgina d’acceptació d’invitació per enllaç: /community/invite/:inviteId?token=...
 * Si l’usuari no està loguejat, es redirigeix a la pantalla principal (login es gestiona a App).
 * Si el token no coincideix o la invitació és invàlida/caducada, es mostra error i "Tornar a demanar invitació".
 */
export function InviteAcceptView({ currentUser, addCommunityToUser, onSelectCommunity }) {
  const { inviteId } = useParams();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!inviteId) {
      setError("Enllaç d’invitació invàlid.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    getInviteById(inviteId)
      .then((inv) => {
        if (cancelled) return;
        if (!inv) {
          setError("Aquesta invitació no existeix o ha caducat.");
          setLoading(false);
          return;
        }
        if (tokenFromUrl !== inv.inviteToken) {
          setError("El enllaç d’invitació no és vàlid.");
          setLoading(false);
          return;
        }
        setInvite(inv);
      })
      .catch(() => {
        if (!cancelled) setError("No s’ha pogut carregar la invitació.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [inviteId, tokenFromUrl]);

  useEffect(() => {
    if (!currentUser && !loading) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const handleAccept = async () => {
    if (!invite || !currentUser) return;
    setAccepting(true);
    setError(null);
    try {
      const { communityId } = await acceptInvite(invite.id, currentUser.uid, currentUser.email ?? "", {
        displayName: currentUser.displayName ?? undefined,
        photoURL: currentUser.photoURL ?? undefined,
      });
      await addCommunityToUser(communityId);
      onSelectCommunity?.(communityId);
      navigate(ROUTES.COMMUNITY, { replace: true });
    } catch (e) {
      setError(e.message ?? "No s’ha pogut acceptar la invitació.");
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!invite) return;
    setRejecting(true);
    try {
      await rejectInvite(invite.id);
      navigate(ROUTES.COMMUNITY, { replace: true });
    } finally {
      setRejecting(false);
    }
  };

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
        <p className="mt-4 text-slate-600">Carregant invitació...</p>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-12 min-w-0 box-border">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center min-w-0">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-serif text-slate-800 mb-2">Invitació no vàlida</h2>
          <p className="text-slate-600 mb-6">{error ?? "Aquesta invitació no existeix o ha caducat."}</p>
          <p className="text-sm text-slate-500 mb-4">Pots demanar que et tornin a enviar la invitació des de la comunitat.</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.COMMUNITY)}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
          >
            Anar a Comunitat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 min-w-0 box-border">
      <div className="bg-white/90 backdrop-blur-sm border border-primary-500 rounded-2xl p-6 shadow-lg min-w-0">
        <Mail className="w-12 h-12 mx-auto text-primary-600 mb-4" />
        <h2 className="text-xl font-serif text-slate-800 mb-2">Invitació a la comunitat</h2>
        <p className="text-slate-600 mb-4 break-words">
          T’han convidat a unir-te a <strong>{invite.communityName ?? invite.communityId}</strong>.
        </p>
        <p className="text-sm text-slate-500 mb-6">
          L’enllaç és vàlid per al correu amb què has iniciat sessió.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={handleReject}
            disabled={accepting || rejecting}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50"
          >
            {rejecting ? "Rebutjant…" : "Rebutjar"}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={accepting || rejecting}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            {accepting ? "Acceptant…" : "Acceptar"}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-600 text-center" role="alert">{error}</p>}
      </div>
    </div>
  );
}
