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
    <div className="text-right">
      <div className="text-amber-400 text-sm font-bold">{label}</div>
      <div className={`${color} font-mono flex items-center gap-1`}>
        {indicator && (
          <span className={animated ? "animate-spin" : ""}>{indicator}</span>
        )}
        {status}
      </div>
    </div>
  );
}
