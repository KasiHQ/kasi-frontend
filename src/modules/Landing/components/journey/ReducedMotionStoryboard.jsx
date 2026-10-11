import React from 'react';
import { PhoneChat } from './PhoneChat';
import { VendorPanel } from './VendorPanel';

export const ReducedMotionStoryboard = ({ stages = [], isFull = true }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12 text-left bg-[#F6F8F3] select-none">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-[#141C17] tracking-tight">
          How Kasi Works: Step-by-Step
        </h2>
        <p className="mt-2 text-[#141C17]/70 text-sm">
          A static overview of the complete social commerce flow from inquiry to delivery.
        </p>
      </div>

      <div className="space-y-10">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="p-6 md:p-8 rounded-3xl bg-white border border-[#141C17]/10 shadow-[0_1px_2px_rgba(20,28,23,0.06),0_14px_32px_-14px_rgba(20,28,23,0.14)] grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF8EF] text-[#0D6E42] font-mono text-xs font-semibold mb-3">
                <span>Stage {stage.stepNumber}</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-[#141C17]">
                {stage.title}
              </h3>
              <p className="mt-2 text-[#141C17]/70 text-sm leading-relaxed">
                {stage.desc}
              </p>
            </div>

            <div className="w-full flex justify-center">
              {stage.stepNumber <= 3 ? (
                <PhoneChat
                  stageNumber={stage.stepNumber}
                  isFull={isFull}
                  className="max-w-[340px]"
                />
              ) : (
                <VendorPanel
                  stageNumber={stage.stepNumber}
                  isFull={isFull}
                  className="max-w-[420px]"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
