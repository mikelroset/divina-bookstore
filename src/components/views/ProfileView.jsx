import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { ChevronDown, ChevronRight, Award, Target, Globe } from "lucide-react";
import { useSuperadmin } from "../../hooks/useSuperadmin";
import { useGamification } from "../../hooks/useGamification";
import { useBadges } from "../../hooks/useBadges";
import { BadgeGrid } from "../common/BadgeGrid";
import { useToast } from "../../context/ToastContext";
import { CATALOG, getLevelInfo, getPointsForLevel } from "../../utils/levelCatalog";
import { ROUTES } from "../../utils/constants";
import { Box, BoxTitle, PageTitle, ProgressBar, Select } from "../../design-system";

export const ProfileView = ({ user, onLogout, stats, annualGoal = 0, setAnnualGoal, books = [], readingActivityDays = [], locale = "ca", setLocale }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSuperadmin, loading } = useSuperadmin(user?.uid);
  const { totalPoints, level, levelInfo, levelColorClass, toNextLevel, toNextLevelProgressPct, nextLevelInfo, showInLeaderboard, setShowInLeaderboard, loading: gamificationLoading } = useGamification(user?.uid);

  const getLevelDisplayName = (info) => {
    if (!info) return "";
    if (info.isLegend) return t("levels.legend");
    return `${t(`levels.roles.${info.roleIndex}`)} — ${t(`levels.minerals.${info.mineralIndex}`)}`;
  };
  const levelDisplayName = levelInfo ? getLevelDisplayName(levelInfo) : "";
  const nextLevelDisplayName = nextLevelInfo ? getLevelDisplayName(nextLevelInfo) : null;
  const completed = stats?.completedBooks ?? 0;
  const goal = Math.max(0, parseInt(annualGoal, 10) || 0);
  const progressPct = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0;

  const [inputStr, setInputStr] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [levelsInfoOpen, setLevelsInfoOpen] = useState(false);

  const { showSuccess } = useToast();
  const handleNewUnlocks = React.useCallback(
    (newlyUnlocked) => {
      newlyUnlocked.forEach((b) => showSuccess(`Has desbloquejat un nou badge: ${b.name}!`));
    },
    [showSuccess],
  );
  const { unlockedIds, loading: badgesLoading } = useBadges(
    user?.uid,
    { books, readingActivityDays },
    handleNewUnlocks,
  );

  useEffect(() => {
    if (!isFocused) {
      setInputStr(goal > 0 ? String(goal) : "");
    }
  }, [goal, isFocused]);

  const languageOptions = [
    { value: "ca", label: t("profile.languageOption_ca") },
    { value: "es", label: t("profile.languageOption_es") },
    { value: "en", label: t("profile.languageOption_en") },
  ];

  return (
    <div className="space-y-6">
      <PageTitle subtitle={t("profile.subtitle")}>
        {t("profile.title")}
      </PageTitle>

      <Box>
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            src={user.photoURL}
            alt={user.displayName ? t("common.avatarOf", { name: user.displayName }) : t("common.avatarUnavailable")}
            displayName={user.displayName}
            className="w-20 h-20 rounded-full border-4 border-primary-500 shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-serif text-slate-800">
              {user.displayName}
            </h3>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Box padding="sm">
            <p className="text-sm text-slate-600 mb-1">{t("profile.totalBooks")}</p>
            <p className="text-3xl font-serif text-slate-800">
              {stats.totalBooks}
            </p>
          </Box>
          <Box padding="sm">
            <p className="text-sm text-slate-600 mb-1">{t("profile.completedBooks")}</p>
            <p className="text-3xl font-serif text-slate-800">
              {stats.completedBooks}
            </p>
          </Box>
        </div>

        <Box padding="md" className="mb-6">
          <p className="text-sm text-slate-600 mb-3">{t("profile.badges")}</p>
          {badgesLoading ? (
            <p className="text-sm text-slate-500">{t("profile.loadingBadges")}</p>
          ) : (
            <BadgeGrid unlockedIds={unlockedIds} />
          )}
        </Box>

        {!gamificationLoading && (
          <div className="mb-6 space-y-4">
            <Box padding="sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-slate-600">{t("profile.totalPoints")}</p>
                <p className="text-2xl font-serif text-primary-800">{totalPoints}</p>
              </div>
              <p className={`text-sm mb-2 font-medium ${levelColorClass}`}>
                {levelDisplayName}
              </p>
              {toNextLevel > 0 && nextLevelDisplayName && (
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-slate-600">
                    {t("profile.progressTo", { level: nextLevelDisplayName, pct: toNextLevelProgressPct })}
                  </p>
                  <ProgressBar
                    value={toNextLevelProgressPct}
                    max={100}
                    variant="secondary"
                    height="sm"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => setLevelsInfoOpen(!levelsInfoOpen)}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-primary-600 transition-colors"
              >
                <Award className="w-4 h-4" />
                {levelsInfoOpen ? t("profile.hide") : t("profile.viewAllLevels")}
                {levelsInfoOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {levelsInfoOpen && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-primary-200 bg-white/50 p-2">
                  <ul className="space-y-1 text-xs">
                    {CATALOG.map((entry) => (
                      <li key={entry.level} className="flex justify-between gap-2 py-0.5">
                        <span className={getLevelInfo(entry.level).colorClass}>
                          {getLevelDisplayName(getLevelInfo(entry.level))}
                        </span>
                        <span className="text-slate-500 shrink-0">
                          {getPointsForLevel(entry.level)} {t("profile.points")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Box>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInLeaderboard}
                onChange={(e) => setShowInLeaderboard(e.target.checked)}
                className="rounded border-primary-500 text-primary-600 focus:ring-primary-200"
              />
              <span className="text-sm text-slate-700">{t("profile.showInLeaderboard")}</span>
            </label>
          </div>
        )}

        {setLocale && (
          <Box className="mb-6">
            <BoxTitle icon={Globe}>{t("profile.language")}</BoxTitle>
            <Select
              label={t("profile.language")}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              options={languageOptions}
              aria-label={t("profile.language")}
            />
          </Box>
        )}

        {setAnnualGoal && (
          <Box className="mb-6">
            <BoxTitle icon={Target}>{t("profile.annualGoalTitle")}</BoxTitle>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={t("profile.annualGoalTitle")}
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                const num = Math.max(0, parseInt(inputStr, 10) || 0);
                setAnnualGoal(num);
                setInputStr(num > 0 ? String(num) : "");
              }}
              placeholder={t("profile.annualGoalPlaceholder")}
              className="w-full rounded-xl border border-primary-500 px-4 py-2 text-slate-800 mb-4"
            />
            {goal > 0 && (
              <>
                <ProgressBar
                  value={progressPct}
                  max={100}
                  variant="secondary"
                  height="md"
                  className="mb-2"
                />
                <p className="text-sm text-slate-600">
                  {t("profile.annualProgress", { completed, goal })}
                </p>
              </>
            )}
          </Box>
        )}

        {!loading && isSuperadmin && (
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_COMMUNITIES)}
              className="w-full bg-primary-100 hover:bg-primary-200 text-primary-800 py-3 rounded-xl font-medium border border-primary-500 transition-all"
            >
              {t("profile.adminCommunities")}
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
              className="w-full bg-primary-100 hover:bg-primary-200 text-primary-800 py-3 rounded-xl font-medium border border-primary-500 transition-all"
            >
              {t("profile.adminUsers")}
            </button>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          {t("profile.logout")}
        </button>
      </Box>
    </div>
  );
};
