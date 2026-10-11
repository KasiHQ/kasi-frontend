import React from "react";

/**
 * KasiLogo component
 * Reads the authentic brand logo from /kasi.png (or /kasi-32.png).
 *
 * @param {'mark' | 'full' | 'avatar'} variant
 *   - 'mark': mark only (kasi.png)
 *   - 'full': mark + "Kasi" clean wordmark
 *   - 'avatar': circular cropped mark for chat stage
 * @param {'light' | 'dark'} theme - 'light' for light backgrounds, 'dark' for dark backgrounds
 * @param {string} className - extra container classes
 * @param {number} size - base mark size in pixels (default 32)
 */
export function KasiLogo({
  variant = "full",
  theme = "light",
  className = "",
  size = 32,
}) {
  const isDark = theme === "dark";

  if (variant === "avatar") {
    return (
      <div
        className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#F6F8F3] shadow-xs ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src="/kasi.png"
          alt="Kasi avatar"
          width={size}
          height={size}
          className="w-full h-full object-cover select-none scale-110"
        />
      </div>
    );
  }

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/kasi.png"
          alt="Kasi logo"
          width={size}
          height={size}
          className="select-none object-contain"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <img
        src="/kasi.png"
        alt="Kasi mark"
        width={size}
        height={size}
        className="select-none object-contain"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <span
        className={`font-poppins font-bold tracking-tight select-none leading-none ${
          isDark ? "text-white" : "text-[#141C17]"
        }`}
        style={{ fontSize: `${Math.round(size * 0.72)}px` }}
      >
        Kasi
      </span>
    </div>
  );
}

export default KasiLogo;
