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
    primary: "text-[var(--color-primary)]",
    slate: "text-[var(--color-text-secondary)]",
  };

  return (
    <Box>
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`w-6 h-6 ${colorClasses[color]}`} />}
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</h3>
      </div>
      <p className="text-4xl font-serif text-[var(--color-text-primary)]">{value}</p>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
    </Box>
  );
};
