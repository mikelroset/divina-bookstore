import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ChevronDown, ChevronUp, Search, Plus } from "lucide-react";
import { PrimaryButton } from "../common/Button";
import { PageTitle, Select, LikeButton, Textarea, Box } from "../../design-system";
import { Avatar } from "../common/Avatar";
import { dateUtils } from "../../utils/dateUtils";
import {
  getReviews,
  getLikedReviewIdsForReviews,
  toggleLike,
  addReview,
} from "../../services/reviewService";
import { useTranslation } from "react-i18next";
import { useDisabledUsers } from "../../hooks/useDisabledUsers";

const TRUNCATE_LENGTH = 250;
const PAGE_SIZE = 10;

function timestampToMs(ts) {
  if (!ts) return 0;
  return ts.toMillis?.() ?? (ts.seconds != null ? ts.seconds * 1000 : 0);
}

/** Prevè spam de clics al botó like */
function useLikeDebounce(handler) {
  const blockedRef = useRef(new Set());
  return useCallback(
    async (reviewId) => {
      if (blockedRef.current.has(reviewId)) return;
      blockedRef.current.add(reviewId);
      try {
        await handler(reviewId);
      } finally {
        setTimeout(() => blockedRef.current.delete(reviewId), 400);
      }
    },
    [handler]
  );
}

export const ReviewsView = ({ currentUser, books }) => {
  const { t } = useTranslation();
  const { disabledIds } = useDisabledUsers();
  const [allReviews, setAllReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishBook, setPublishBook] = useState(null);
  const [publishText, setPublishText] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  const completedBooks = useMemo(
    () => books.filter((b) => b.status === "completed"),
    [books]
  );

  const loadReviews = useCallback(async (append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      const opts = append && lastDoc ? { startAfterDoc: lastDoc, pageSize: 50 } : { pageSize: 50 };
      const { reviews, lastDoc: nextDoc } = await getReviews(opts);
      if (append) {
        setAllReviews((prev) => {
          const byId = new Map(prev.map((r) => [r.id, r]));
          reviews.forEach((r) => byId.set(r.id, r));
          return Array.from(byId.values()).sort(
            (a, b) => timestampToMs(b.createdAt) - timestampToMs(a.createdAt)
          );
        });
      } else {
        setAllReviews(reviews);
      }
      setLastDoc(nextDoc);
    } catch (err) {
      console.error("Error carregant ressenyes:", err);
      setError("No s'han pogut carregar les ressenyes. Torna-ho a intentar.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    loadReviews();
  }, []);

  const reviewIds = useMemo(() => allReviews.map((r) => r.id), [allReviews]);
  useEffect(() => {
    if (!currentUser?.uid || reviewIds.length === 0) return;
    getLikedReviewIdsForReviews(currentUser.uid, reviewIds).then(setLikedIds);
  }, [currentUser?.uid, reviewIds.join(",")]);

  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      const matchSearch =
        !searchTerm ||
        [r.bookTitle, r.bookAuthor, r.authorDisplayName]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchAuthor =
        !filterAuthor ||
        (r.bookAuthor || "").toLowerCase().includes(filterAuthor.toLowerCase());
      const matchMember =
        !filterMember ||
        (r.authorDisplayName || "Membre eliminat")
          .toLowerCase()
          .includes(filterMember.toLowerCase());
      const ts = timestampToMs(r.createdAt);
      const matchFrom =
        !filterDateFrom || ts >= new Date(filterDateFrom).getTime();
      const matchTo =
        !filterDateTo ||
        ts <= new Date(filterDateTo).getTime() + 86400000;
      return matchSearch && matchAuthor && matchMember && matchFrom && matchTo;
    });
  }, [
    allReviews,
    searchTerm,
    filterAuthor,
    filterMember,
    filterDateFrom,
    filterDateTo,
  ]);

  const totalFilteredPages = Math.ceil(filteredReviews.length / PAGE_SIZE) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReviews.slice(start, start + PAGE_SIZE);
  }, [filteredReviews, currentPage]);

  const hasActiveFilters =
    searchTerm || filterAuthor || filterMember || filterDateFrom || filterDateTo;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterAuthor("");
    setFilterMember("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setCurrentPage(1);
  };

  const handleLike = useCallback(
    async (reviewId) => {
      if (!currentUser?.uid) return;
      const currentLiked = likedIds.has(reviewId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (currentLiked) next.delete(reviewId);
        else next.add(reviewId);
        return next;
      });
      const prevCount = allReviews.find((r) => r.id === reviewId)?.likeCount ?? 0;
      setAllReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                likeCount: currentLiked ? Math.max(0, prevCount - 1) : prevCount + 1,
              }
            : r
        )
      );
      try {
        const { likeCount } = await toggleLike(reviewId, currentUser.uid, currentLiked);
        setAllReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, likeCount } : r))
        );
      } catch (err) {
        console.error("Error al fer like:", err);
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (currentLiked) next.add(reviewId);
          else next.delete(reviewId);
          return next;
        });
        setAllReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, likeCount: prevCount } : r
          )
        );
      }
    },
    [currentUser?.uid, likedIds, allReviews]
  );

  const debouncedLike = useLikeDebounce(handleLike);

  const handlePublish = async () => {
    if (!publishBook || !publishText?.trim() || !currentUser) return;
    setPublishing(true);
    try {
      const originalTitle = (publishBook.originalTitle?.trim() || publishBook.title?.trim()) ?? "";
      if (!originalTitle || !publishBook.author?.trim()) {
        setError("El títol original i l'autor són obligatoris per publicar una ressenya.");
        setPublishing(false);
        return;
      }
      await addReview(
        currentUser.uid,
        currentUser.displayName || "Membre",
        currentUser.photoURL,
        {
          id: publishBook.id,
          title: publishBook.title,
          author: publishBook.author,
          originalTitle,
        },
        publishText.trim()
      );
      setShowPublishModal(false);
      setPublishBook(null);
      setPublishText("");
      loadReviews();
    } catch (err) {
      console.error("Error publicant ressenya:", err);
      setError(err?.message || "No s'ha pogut publicar la ressenya.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle subtitle="Descobreix opinions i comparteix les teves">
          Ressenyes
        </PageTitle>
        {completedBooks.length > 0 && (
          <PrimaryButton
            type="button"
            onClick={() => setShowPublishModal(true)}
            icon={Plus}
          >
            Publicar ressenya
          </PrimaryButton>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per títol, autor o membre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <input
          type="text"
          placeholder="Filtre per autor"
          value={filterAuthor}
          onChange={(e) => {
            setFilterAuthor(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400"
        />
        <input
          type="text"
          placeholder="Filtre per membre"
          value={filterMember}
          onChange={(e) => {
            setFilterMember(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          placeholder="Data des de"
          value={filterDateFrom}
          onChange={(e) => {
            setFilterDateFrom(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400"
        />
        <input
          type="date"
          placeholder="Data fins"
          value={filterDateTo}
          onChange={(e) => {
            setFilterDateTo(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Netejar filtres
        </button>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {filteredReviews.length === 0 ? (
        <Box className="text-center py-16 !bg-white/60">
          <p className="text-slate-600 mb-2">
            No s'han trobat ressenyes amb aquests criteris.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Netejar filtres
            </button>
          )}
        </Box>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedReviews.map((review) => {
              const isExpanded = expandedId === review.id;
              const text = review.text || "";
              const truncated = text.length > TRUNCATE_LENGTH ? text.slice(0, TRUNCATE_LENGTH) + "…" : text;
              const showReadMore = text.length > TRUNCATE_LENGTH;
              const liked = likedIds.has(review.id);
              const authorName = disabledIds.has(review.authorUserId)
                ? t("common.userDisabled")
                : (review.authorDisplayName?.trim() || "Membre eliminat");
              const createdAt = review.createdAt
                ? new Date(timestampToMs(review.createdAt))
                : null;

              return (
                <Box
                  as="article"
                  key={review.id}
                  padding="md"
                  className={`!shadow-sm ${showReadMore ? "cursor-pointer" : ""}`}
                  onClick={() =>
                    showReadMore &&
                    setExpandedId((id) => (id === review.id ? null : review.id))
                  }
                  role={showReadMore ? "button" : undefined}
                  tabIndex={showReadMore ? 0 : undefined}
                  onKeyDown={
                    showReadMore
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setExpandedId((id) =>
                              id === review.id ? null : review.id
                            );
                          }
                        }
                      : undefined
                  }
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {review.bookTitle}
                      </h3>
                      <p className="text-sm text-slate-600 truncate">
                        {review.bookAuthor}
                      </p>
                    </div>
                    <LikeButton
                      liked={liked}
                      count={review.likeCount ?? 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        debouncedLike(review.id);
                      }}
                      size="md"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar
                      src={review.authorPhotoURL}
                      displayName={authorName}
                      alt={authorName}
                      className="w-8 h-8 rounded-full border border-primary-500"
                    />
                    <span className="text-sm text-slate-600">{authorName}</span>
                    <span className="text-xs text-slate-400">
                      {createdAt ? dateUtils.formatShortDate(createdAt) : ""}
                    </span>
                  </div>
                  <div className="mt-3 text-slate-700">
                    {isExpanded ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <p className="whitespace-pre-wrap">{truncated}</p>
                    )}
                    {showReadMore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : review.id);
                        }}
                        className="mt-1 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Mostrar menys
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Llegir més
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Box>
              );
            })}
          </div>

          {totalFilteredPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg border border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-slate-600">
                {currentPage} / {totalFilteredPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalFilteredPages, p + 1))
                }
                disabled={currentPage >= totalFilteredPages}
                className="px-4 py-2 rounded-lg border border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Següent
              </button>
            </div>
          )}

          {lastDoc && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => loadReviews(true)}
                disabled={loadingMore}
                className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
              >
                {loadingMore ? "Carregant…" : "Carregar més ressenyes"}
              </button>
            </div>
          )}
        </>
      )}

      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => !publishing && setShowPublishModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Publicar ressenya
            </h3>
            <Select
              label="Llibre"
              value={publishBook?.id ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                setPublishBook(
                  id ? completedBooks.find((b) => b.id === id) ?? null : null
                );
              }}
              options={[
                { value: "", label: "Selecciona un llibre (completat)" },
                ...completedBooks.map((b) => ({
                  value: b.id,
                  label: `${b.title} – ${b.author}`,
                })),
              ]}
              className="mb-4"
            />
            <Textarea
              label="Ressenya"
              value={publishText}
              onChange={(e) => setPublishText(e.target.value)}
              placeholder="Què t'ha semblat el llibre?"
              rows={5}
              className="mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => !publishing && setShowPublishModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel·lar
              </button>
              <button
                onClick={handlePublish}
                disabled={!publishBook || !publishText?.trim() || publishing}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium"
              >
                {publishing ? "Publicant…" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
