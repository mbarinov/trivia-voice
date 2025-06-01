interface StatusIndicatorProps {
  label: string;
  status: string;
  color: string;
  indicator?: string;
  animated?: boolean;
}

export function StatusIndicator({
  label,
  status,
  color,
  indicator,
  animated = false,
}: StatusIndicatorProps) {
  return (
    <div className="text-center sm:text-right min-w-0">
      <div className="text-amber-400 text-xs sm:text-sm font-bold truncate">
        {label}
      </div>
      <div
        className={`${color} font-mono flex items-center justify-center sm:justify-end gap-1 text-xs sm:text-sm`}
      >
        {indicator && (
          <span className={`flex-shrink-0 ${animated ? "animate-spin" : ""}`}>
            {indicator}
          </span>
        )}
        <span className="truncate">{status}</span>
      </div>
    </div>
  );
}
