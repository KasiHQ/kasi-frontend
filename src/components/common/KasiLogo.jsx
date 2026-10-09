import React from "react";

/**
 * KasiLogo component
 * @param {'mark' | 'full'} variant - 'mark' for icon only, 'full' for icon + wordmark
 * @param {'light' | 'dark'} theme - 'light' for light backgrounds, 'dark' for dark backgrounds
 * @param {string} className - extra container classes
 * @param {number} size - base size in pixels (default 32)
 */
export function KasiLogo({
  variant = "full",
  theme = "light",
  className = "",
  size = 32,
}) {
  const isDark = theme === "dark";

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/kasi-icon.svg"
          alt="Kasi mark"
          width={size}
          height={size}
          className="rounded-[22%] select-none object-contain"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <img
        src="/kasi-icon.svg"
        alt="Kasi mark"
        width={size}
        height={size}
        className="rounded-[22%] select-none object-contain shadow-xs"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      {isDark ? (
        <span
          className="font-poppins font-extrabold text-white tracking-[-0.03em] select-none lowercase leading-none"
          style={{ fontSize: `${Math.round(size * 0.75)}px` }}
        >
          kasi
        </span>
      ) : (
        <img
          src="/kasi-logo.svg"
          alt="kasi"
          height={Math.round(size * 0.72)}
          className="w-auto select-none object-contain"
          style={{ height: `${Math.round(size * 0.72)}px` }}
        />
      )}
    </div>
  );
}

export default KasiLogo;
