import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex flex-wrap items-center gap-2 text-xs font-semibold leading-4 text-on-surface-variant", className].join(" ")}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-bold text-on-surface" : ""}>{item.label}</span>
            )}
            {!isLast && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
          </span>
        );
      })}
    </nav>
  );
}
