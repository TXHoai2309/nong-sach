import Breadcrumb, { type BreadcrumbItem } from "@/components/layout/Breadcrumb";

interface PageShellProps {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
  eyebrow?: string;
  subtitle?: string;
  title?: string;
}

export default function PageShell({
  breadcrumb,
  children,
  className = "",
  eyebrow,
  subtitle,
  title,
}: PageShellProps) {
  return (
    <main className={`page-surface ${className}`}>
      <div className="site-container page-enter py-6 sm:py-8">
        {breadcrumb && <Breadcrumb className="mb-5" items={breadcrumb} />}

        {(eyebrow || title || subtitle) && (
          <header className="mb-6 max-w-[760px]">
            {eyebrow && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-on-surface sm:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-3 text-sm leading-6 text-on-surface-variant sm:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {children}
      </div>
    </main>
  );
}
