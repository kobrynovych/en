"use client";

import { useEffect, type FocusEvent, type RefObject } from "react";

interface DismissOptions {
  open: boolean;
  onDismiss: () => void;
  /** Element that contains both the trigger and the panel. */
  containerRef: RefObject<HTMLElement | null>;
  /** Receives focus back when the panel is closed with Escape. */
  triggerRef: RefObject<HTMLElement | null>;
}

/**
 * Closes a disclosure panel on outside pointer down, on Escape and when keyboard focus leaves it.
 * Returns the blur handler to attach to the container.
 */
export function useDismiss({ open, onDismiss, containerRef, triggerRef }: DismissOptions) {
  useEffect(() => {
    if (!open) return;

    const dismissOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onDismiss();
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onDismiss();
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", dismissOnOutsidePointer);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOnOutsidePointer);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [open, onDismiss, containerRef, triggerRef]);

  return function dismissWhenFocusLeaves(event: FocusEvent<HTMLElement>) {
    if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) onDismiss();
  };
}
