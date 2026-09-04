import { useEffect, useState, type ReactNode } from "react";
import { FiMenu, FiX } from "react-icons/fi";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  drawerCloseClassName?: string;
};

/**
 * Admin / organizer shell: fixed sidebar on lg+, drawer on smaller screens.
 */
const PanelSidebarLayout = ({
  sidebar,
  children,
  className = "",
  drawerCloseClassName = "text-gray-500 hover:bg-gray-100",
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
    <div className={`min-h-screen flex ${className}`}>
      <div className="hidden lg:flex shrink-0">{sidebar}</div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-2xl flex">
            <div className="relative h-full flex">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className={`absolute top-4 right-3 z-10 p-2 rounded-lg cursor-pointer ${drawerCloseClassName}`}
              >
                <FiX size={20} />
              </button>
              {sidebar}
            </div>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <FiMenu size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PanelSidebarLayout;
