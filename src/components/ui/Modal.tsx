// components/ui/Modal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(open); // controls presence for exit anim
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Mount on open; unmount after exit animation
  useEffect(() => {
    if (open) setIsMounted(true);
  }, [open]);

  // Trap ESC and disable page scroll when open
  useEffect(() => {
    if (!open) return;

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Unmount after animation ends when closing
  const handleAnimEnd = () => {
    if (!open) setIsMounted(false);
  };

  if (!isMounted) return null;

  const overlayAnim = open
    ? "animate-[modal-overlay-in_220ms_ease-out]"
    : "animate-[modal-overlay-out_160ms_ease-in]";

  const dialogAnim = open
    ? "animate-[modal-in_360ms_cubic-bezier(0.18,0.9,0.2,1.1)_both]"
    : "animate-[modal-out_200ms_ease_forwards]";

  const modal = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] grid place-items-center"
      onMouseDown={(e) => {
        // close on click outside dialog
        if (e.target === e.currentTarget) onClose();
      }}
      onAnimationEnd={handleAnimEnd}
      aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/60 backdrop-blur-sm will-change-[opacity,filter]",
          overlayAnim,
        ].join(" ")}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          "relative m-4 w-full max-w-lg rounded-2xl bg-white/90 p-6 shadow-2xl ring-1 ring-black/10 backdrop-blur-xl",
          "dark:bg-neutral-900/90 dark:text-white",
          "will-change-[transform,opacity,filter]",
          dialogAnim,
        ].join(" ")}>
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-4">
          {title ? (
            <h2 className="text-lg font-semibold leading-6">{title}</h2>
          ) : (
            <span aria-hidden />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/70 ring-1 ring-black/10 transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:bg-white/10 dark:text-white/80 dark:ring-white/10 dark:hover:bg-white/15">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
