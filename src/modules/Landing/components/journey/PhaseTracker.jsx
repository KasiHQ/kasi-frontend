import React from 'react';

export const PhaseTracker = ({ activePhase = 'Prepared' }) => {
  const phases = [
    { id: 'Paid', label: 'Paid' },
    { id: 'Prepared', label: 'Prepared' },
    { id: 'Ready', label: 'Ready' },
    { id: 'PickedUp', label: 'Picked up' },
  ];

  const getPhaseIndex = (id) =>
    phases.findIndex((p) => p.id.toLowerCase() === id.toLowerCase() || p.label.toLowerCase() === id.toLowerCase());
  const currentIndex = Math.max(0, getPhaseIndex(activePhase));

  return (
    <div className="bg-white border border-[#141C17]/10 rounded-xl p-3 text-left shadow-sm select-none">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-[#141C17]/55 uppercase tracking-wider">
          Pathway Progress
        </span>
        <span className="font-mono text-[10px] text-[#0D6E42] font-medium">
          Auto-updated
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {phases.map((phase, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={phase.id}
              className={`px-2 py-1.5 rounded-lg text-center text-[10px] sm:text-[11px] font-mono transition-all ${
                isCurrent
                  ? 'bg-[#0D6E42] text-white font-semibold shadow-xs'
                  : isDone
                  ? 'bg-[#EBF8EF] text-[#0D6E42] font-medium'
                  : 'bg-[#141C17]/5 text-[#141C17]/40'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {isDone && (
                  <svg
                    viewBox="0 0 12 12"
                    className="w-3 h-3 stroke-current fill-none stroke-2"
                  >
                    <path d="M2.5 6.2L4.8 8.5L9.5 3.5" />
                  </svg>
                )}
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{phase.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
