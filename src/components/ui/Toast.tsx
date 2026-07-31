"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  subtext?: string;
  show: boolean;
  onDone: () => void;
  duration?: number;
};

export default function Toast({
  message,
  subtext,
  show,
  onDone,
  duration = 2600,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    // trigger enter animation on next frame
    const enter = requestAnimationFrame(() => setVisible(true));

    const exitTimer = setTimeout(() => setVisible(false), duration);
    const doneTimer = setTimeout(onDone, duration + 300);

    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [show, duration, onDone]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4
        pt-[env(safe-area-inset-top)] pointer-events-none"
    >
      <div
        className={`flex items-center gap-3 bg-cocoa text-cream rounded-2xl pl-4 pr-6 py-4 shadow-xl
          w-full max-w-sm pointer-events-auto
          transition-all duration-300 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 4L6 11L3 8"
              stroke="#3A2317"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="font-body text-sm font-semibold leading-tight truncate">
            {message}
          </p>
          {subtext && (
            <p className="font-body text-xs text-cream/70 mt-0.5 truncate">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
