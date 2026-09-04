import { useEffect, useState, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
  /** Background for the main content area */
  className?: string;
  filterLabel?: string;
};

/**
 * Desktop: sidebar stays visible (unchanged layout at lg+).
 * Mobile/tablet: sidebar becomes a slide-over drawer.
 */
const ResponsiveSidebarLayout = ({
  sidebar,
  children,
  className = "bg-[#0B0F1A]",
  filterLabel = "Filters",
}: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`flex flex-col lg:flex-row ${className}`}>
      <div className="lg:hidden px-4 pt-4 pb-2 shrink-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition cursor-pointer"
        >
          <SlidersHorizontal size={16} />
          {filterLabel}
        </button>
      </div>

      <div className="hidden lg:block shrink-0">{sidebar}</div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 bg-black/60 z-40 lg:hidden cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl">
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-3 z-10 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <FiX size={20} />
              </button>
              {sidebar}
            </div>
          </div>
        </>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

export default ResponsiveSidebarLayout;
