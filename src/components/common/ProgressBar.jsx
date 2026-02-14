import React from "react";

export const ProgressBar = ({
  percentage,
  showLabel = true,
  color = "amber",
}) => {
  const gradientClasses = {
    amber: "from-amber-500 to-amber-600",
    slate: "from-slate-500 to-slate-600",
  };

  return (
    <div className="relative">
      <div className="bg-amber-100 rounded-full h-4 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${gradientClasses[color]} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-right mt-2 text-sm font-medium text-slate-700">
          {percentage}% completat
        </p>
      )}
    </div>
  );
};
