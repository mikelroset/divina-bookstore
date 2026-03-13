import React from "react";
import { Box } from "../../design-system";

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
    <Box>
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`w-6 h-6 ${colorClasses[color]}`} />}
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      </div>
      <p className="text-4xl font-serif text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </Box>
  );
};
