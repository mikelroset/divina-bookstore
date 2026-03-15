import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { ChevronDown, ChevronRight, Award, Target, ArrowLeft } from "lucide-react";
import { useMemberProfileData } from "../../hooks/useMemberProfileData";
import { BadgeGrid } from "../common/BadgeGrid";
import { CATALOG, getLevelInfo, getPointsForLevel } from "../../utils/levelCatalog";
import { ROUTES } from "../../utils/constants";
import { Box, BoxTitle, PageTitle, ProgressBar } from "../../design-system";

export const MemberProfileView = ({ memberUserId, memberDisplayName, memberPhotoURL, memberEmail, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stats, annualGoal, totalPoints, levelInfo, levelColorClass, toNextLevel, toNextLevelProgressPct, nextLevelInfo, unlockedIds, loading, error } = useMemberProfileData(memberUserId);

  const [levelsInfoOpen, setLevelsInfoOpen] = useState(false);

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

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(ROUTES.COMMUNITY);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <button type="button" onClick={handleBack} className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <ArrowLeft className="w-5 h-5" />
          {t("memberProfile.back")}
        </button>
        <Box>
          <p className="text-[var(--color-text-secondary)]">{t("memberProfile.userNotAvailable")}</p>
        </Box>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <button type="button" onClick={handleBack} className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <ArrowLeft className="w-5 h-5" />
          {t("memberProfile.back")}
        </button>
        <Box>
          <p className="text-[var(--color-text-secondary)]">{t("profile.loadingBadges")}</p>
        </Box>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={handleBack} className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] p-1 -m-1 rounded">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{t("memberProfile.back")}</span>
        </button>
      </div>

      <PageTitle subtitle={t("memberProfile.subtitle")}>
        {memberDisplayName || t("memberProfile.unknownMember")}
      </PageTitle>

      <Box>
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            src={memberPhotoURL}
            alt={memberDisplayName ? t("common.avatarOf", { name: memberDisplayName }) : t("common.avatarUnavailable")}
            displayName={memberDisplayName}
            className="w-20 h-20 rounded-full border-4 border-[var(--color-primary)] shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-serif text-[var(--color-text-primary)]">
              {memberDisplayName || t("memberProfile.unknownMember")}
            </h3>
            {memberEmail && <p className="text-[var(--color-text-secondary)]">{memberEmail}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Box padding="sm">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{t("profile.totalBooks")}</p>
            <p className="text-3xl font-serif text-[var(--color-text-primary)]">{stats.totalBooks}</p>
          </Box>
          <Box padding="sm">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{t("profile.completedBooks")}</p>
            <p className="text-3xl font-serif text-[var(--color-text-primary)]">{stats.completedBooks}</p>
          </Box>
        </div>
        {stats.totalBooks === 0 && stats.completedBooks === 0 && (
          <p className="text-[var(--color-text-secondary)] mb-6">{t("memberProfile.noActivity")}</p>
        )}

        <Box padding="md" className="mb-6">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">{t("profile.badges")}</p>
          {loading ? (
            <p className="text-sm text-[var(--color-text-secondary)]">{t("profile.loadingBadges")}</p>
          ) : (
            <BadgeGrid unlockedIds={unlockedIds} />
          )}
        </Box>

        <div className="mb-6 space-y-4">
          <Box padding="sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-[var(--color-text-secondary)]">{t("profile.totalPoints")}</p>
              <p className="text-2xl font-serif text-[var(--color-primary)]">{totalPoints}</p>
            </div>
            <p className={`text-sm mb-2 font-medium ${levelColorClass}`}>
              {levelDisplayName}
            </p>
            {toNextLevel > 0 && nextLevelDisplayName && (
              <div className="space-y-1 mb-3">
                <p className="text-xs text-[var(--color-text-secondary)]">
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
              className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Award className="w-4 h-4" />
              {levelsInfoOpen ? t("profile.hide") : t("profile.viewAllLevels")}
              {levelsInfoOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {levelsInfoOpen && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white/50 p-2">
                <ul className="space-y-1 text-xs">
                  {CATALOG.map((entry) => (
                    <li key={entry.level} className="flex justify-between gap-2 py-0.5">
                      <span className={getLevelInfo(entry.level).colorClass}>
                        {getLevelDisplayName(getLevelInfo(entry.level))}
                      </span>
                      <span className="text-[var(--color-text-secondary)] shrink-0">
                        {getPointsForLevel(entry.level)} {t("profile.points")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Box>
        </div>

        <Box className="mb-6">
          <BoxTitle icon={Target}>{t("profile.annualGoalTitle")}</BoxTitle>
          {goal > 0 ? (
            <>
              <ProgressBar
                value={progressPct}
                max={100}
                variant="secondary"
                height="md"
                className="mb-2"
              />
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t("profile.annualProgress", { completed, goal })}
              </p>
            </>
          ) : (
            <p className="text-[var(--color-text-secondary)]">{t("memberProfile.noAnnualGoal")}</p>
          )}
        </Box>
      </Box>
    </div>
  );
};
