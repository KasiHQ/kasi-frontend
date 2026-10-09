import React from "react";

/**
 * DesignedPlaceholder component
 * Built per Task 2B section 1.2:
 * "warm brand-tinted panel, subtle dot-grid, the slot's art direction as a small mono caption, tagged data-swap='vendor-real'"
 */
export function DesignedPlaceholder({
  caption,
  className = "",
  aspectRatio = "aspect-[4/3]",
  tag = "VENDOR PHOTO SLOT",
}) {
  return (
    <div
      data-swap="vendor-real"
      className={`relative w-full ${aspectRatio} rounded-[22px] overflow-hidden bg-[#F6F8F3] border border-[#141C17]/10 flex flex-col items-center justify-center p-6 text-center select-none shadow-xs group ${className}`}
    >
      {/* Subtle Dot-grid Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* Soft Ambient Brand Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D6E42]/[0.05] via-transparent to-[#DBF361]/[0.08] pointer-events-none" />

      {/* Inner Frame */}
      <div className="relative z-10 flex flex-col items-center max-w-[260px]">
        {/* Subtle camera aperture / viewfinder motif */}
        <div className="w-10 h-10 rounded-full border border-[#0D6E42]/25 bg-white/80 shadow-xs flex items-center justify-center mb-3">
          <div className="w-4 h-4 rounded-full border border-[#0D6E42]/40" />
        </div>

        {tag && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D6E42] bg-[#0D6E42]/10 px-2.5 py-0.5 rounded-full mb-2">
            {tag}
          </span>
        )}

        <p className="font-mono text-xs text-[#141C17]/70 leading-relaxed font-medium">
          &ldquo;{caption}&rdquo;
        </p>

        <span className="text-[10px] font-mono text-[#141C17]/40 mt-1">
          Pending photoshoot swap
        </span>
      </div>
    </div>
  );
}

export default DesignedPlaceholder;
