import React from "react";

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "text-primary-600",
    slate: "text-slate-700",
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        {/* <Icon className={`w-8 h-8 ${colorClasses[color]}`} /> */}
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      </div>
      <p className="text-4xl font-serif text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
};
