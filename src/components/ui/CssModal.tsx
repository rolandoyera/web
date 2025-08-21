"use client";

import React, { useEffect, useId, useRef } from "react";
import styles from "./CssModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** If you prefer to fully unmount when closed, set keepMounted={false} */
  keepMounted?: boolean;
};

export default function CssModal({
  open,
  onClose,
  title,
  children,
  className,
  keepMounted = true,
}: Props) {
  const titleId = `modal-title-${useId().replace(/:/g, "-")}`;
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock scroll while open + focus the card
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    cardRef.current?.focus?.();
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Optional: fully unmount when closed (no initial blur, no overlay at all)
  if (!keepMounted && !open) return null;

  return (
    <div
      className={`${styles.root} ${open ? styles.open : ""} ${
        className ?? ""
      }`}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}>
        <div
          className={styles.card}
          ref={cardRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}>
          <header className={styles.header}>
            <h3 id={titleId} className={styles.title}>
              {title}
            </h3>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close">
              ×
            </button>
          </header>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  );
}
