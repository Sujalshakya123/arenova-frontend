import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical } from "react-icons/fi";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger" | "primary";
};

type Props = {
  items: ActionMenuItem[];
  variant?: "default" | "overlay";
};

const toneClass = {
  default: "text-gray-700 hover:bg-gray-50",
  primary: "text-blue-600 hover:bg-blue-50",
  danger: "text-rose-600 hover:bg-rose-50",
};

const ActionMenu = ({ items, variant = "default" }: Props) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 176;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    );
    setCoords({
      top: rect.bottom + 4,
      left,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  if (!items.length) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          variant === "overlay"
            ? "w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-500 hover:text-gray-700 cursor-pointer transition"
            : "p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
        }
        aria-label="Actions"
        aria-expanded={open}
      >
        <FiMoreVertical size={variant === "overlay" ? 14 : 16} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={`w-full text-left px-4 py-2 text-sm cursor-pointer ${
                  toneClass[item.tone ?? "default"]
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ActionMenu;
