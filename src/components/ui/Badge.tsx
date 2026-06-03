// =============================================
// Badge UI components — NôngSạch
// =============================================

interface BadgeProps {
  label: string;
  variant?: "green" | "blue" | "orange" | "gray";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "gray", size = "sm" }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    blue: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
    orange: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    gray: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };

  const sizeClasses: Record<string, string> = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
