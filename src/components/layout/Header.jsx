import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { ROUTES } from "../../utils/constants";

export const Header = ({ user }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-primary-500 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          aria-label={t("header.ariaGoHome")}
        >
          <img src="/logo.svg" alt={t("header.logoAlt")} className="w-8 h-8" />
          <h1 className="text-2xl font-serif text-slate-800">
            DivinaBookStore
          </h1>
        </Link>
        {user && (
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            aria-label={t("header.ariaGoProfile")}
          >
            <Avatar
              src={user.photoURL}
              alt={user.displayName ? t("common.avatarOf", { name: user.displayName }) : t("common.avatarUnavailable")}
              displayName={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-primary-500"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
