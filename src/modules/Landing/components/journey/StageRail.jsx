import React from 'react';
import { motion, useTransform } from 'framer-motion';

export const StageRail = ({
  stages = [],
  activeStageIndex = 0,
  progress,
  onStageClick,
  className = '',
}) => {
  const fallbackPct =
    stages.length > 1 ? (activeStageIndex / (stages.length - 1)) * 100 : 0;

  // Smooth liquid progress fill tied directly to scroll/spring motion value when available
  const smoothWidth = useTransform(
    progress || { get: () => fallbackPct / 100, on: () => () => {} },
    [0, 1],
    ['0%', '100%']
  );

  return (
    <nav
      aria-label="Journey Progress Steps"
      className={`relative z-20 w-full max-w-2xl mx-auto px-3 select-none ${className}`}
    >
      <div className="bg-white/85 backdrop-blur-md border border-[#141C17]/10 rounded-2xl px-4 sm:px-6 py-2.5 shadow-[0_4px_20px_-6px_rgba(20,28,23,0.08)]">
        <div className="relative flex items-start justify-between">
          {/* Background track line */}
          <div
            aria-hidden="true"
            className="absolute top-3.5 left-5 right-5 h-[2.5px] bg-[#141C17]/10 rounded-full overflow-hidden"
          >
            {progress ? (
              <motion.div
                className="h-full bg-gradient-to-r from-[#0D6E42] via-[#1A8C55] to-[#25D366] rounded-full"
                style={{ width: smoothWidth }}
              />
            ) : (
              <div
                className="h-full bg-[#0D6E42] transition-all duration-300 ease-out rounded-full"
                style={{ width: `${fallbackPct}%` }}
              />
            )}
          </div>

          {stages.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            const isPassed = idx < activeStageIndex;
            const nodeNum = String(stage.stepNumber).padStart(2, '0');

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onStageClick(stage.holdProgress)}
                className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E42] focus-visible:ring-offset-2 rounded-lg"
                aria-label={`Jump to stage ${stage.stepNumber}: ${stage.title}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Numbered node circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0D6E42] text-[#DBF361] font-bold shadow-sm ring-4 ring-[#DBF361]/45 scale-110'
                      : isPassed
                      ? 'bg-[#0D6E42] text-white'
                      : 'bg-white border border-[#141C17]/20 text-[#141C17]/55 group-hover:border-[#0D6E42]/50 group-hover:text-[#0D6E42]'
                  }`}
                >
                  {isPassed ? (
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
                    >
                      <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
                    </svg>
                  ) : (
                    <span>{nodeNum}</span>
                  )}
                </div>

                {/* Stage label text */}
                <span
                  className={`mt-1 text-[10px] md:text-xs text-center transition-colors ${
                    isActive
                      ? 'text-[#141C17] font-semibold'
                      : 'text-[#141C17]/60 group-hover:text-[#141C17]/90'
                  } max-w-[64px] sm:max-w-none truncate`}
                >
                  {stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
