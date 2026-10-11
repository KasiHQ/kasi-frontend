import React from 'react';

export const StageRail = ({
  stages = [],
  activeStageIndex = 0,
  onStageClick,
  className = '',
}) => {
  const progressPct =
    stages.length > 1
      ? (activeStageIndex / (stages.length - 1)) * 100
      : 0;

  return (
    <nav
      aria-label="Journey Progress Steps"
      className={`relative z-20 w-full max-w-2xl mx-auto px-4 select-none ${className}`}
    >
      <div className="relative flex items-start justify-between">
        {/* Background track line */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-4 right-4 h-[2px] bg-[#141C17]/10"
        >
          {/* Active progress fill */}
          <div
            className="h-full bg-[#0D6E42] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
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
              className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E42] focus-visible:ring-offset-2 rounded-lg"
              aria-label={`Jump to stage ${stage.stepNumber}: ${stage.title}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Numbered node circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-xs transition-all ${
                  isActive
                    ? 'bg-[#0D6E42] text-white font-semibold shadow-sm ring-4 ring-[#0D6E42]/10 scale-105'
                    : isPassed
                    ? 'bg-[#0D6E42] text-white'
                    : 'bg-white border border-[#141C17]/20 text-[#141C17]/50 group-hover:border-[#141C17]/40 group-hover:text-[#141C17]/80'
                }`}
              >
                {isPassed ? (
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 stroke-white fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round"
                  >
                    <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
                  </svg>
                ) : (
                  <span>{nodeNum}</span>
                )}
              </div>

              {/* Stage label text (spec text only) */}
              <span
                className={`mt-1.5 text-[11px] md:text-xs text-center transition-colors ${
                  isActive
                    ? 'text-[#141C17] font-semibold'
                    : 'text-[#141C17]/60 group-hover:text-[#141C17]/90'
                } max-w-[72px] sm:max-w-none truncate`}
              >
                {stage.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
