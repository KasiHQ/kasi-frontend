import React, { useState, useEffect, useId } from 'react';
import { motion, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useJourneyProgress } from './useJourneyProgress';
import { LANDING_STAGES, FULL_STAGES } from './stages';
import { PhoneChat } from './PhoneChat';
import { VendorPanel } from './VendorPanel';
import { StageRail } from './StageRail';
import { ReducedMotionStoryboard } from './ReducedMotionStoryboard';

export const JourneyScene = ({ variant = 'landing' }) => {
  const isFull = variant === 'full';
  const stages = isFull ? FULL_STAGES : LANDING_STAGES;
  const skipId = useId();

  // Accessibility: detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const { containerRef, rawProgress, progress, scrollToProgress, isLowPower } = useJourneyProgress({
    prefersReducedMotion,
  });

  // Track active stage index (driven by the smoothed spring progress for fluid harmony)
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  useMotionValueEvent(progress, 'change', (latest) => {
    const stageIdx = stages.findIndex(
      (s) => latest >= s.range[0] && latest <= s.range[1]
    );
    if (stageIdx !== -1 && stageIdx !== activeStageIndex) {
      setActiveStageIndex(stageIdx);
    }
  });

  const activeStage = stages[activeStageIndex] || stages[0];

  // Motion transforms for camera depth and surface shifts
  const phoneScale = useTransform(
    progress,
    [0, 0.45, 0.55, 0.8, 1],
    [1, 1, 0.98, 0.95, 0.93]
  );
  const phoneDim = useTransform(
    progress,
    [0, 0.5, 0.75, 1],
    [1, 1, 0.88, 0.8]
  );

  const vendorScale = useTransform(
    progress,
    [0, 0.35, 0.65, 0.85, 1],
    [0.95, 0.97, 1, 1.01, 1]
  );
  const vendorDim = useTransform(
    progress,
    [0, 0.3, 0.6, 1],
    [0.72, 0.85, 1, 1]
  );

  // Soft lime ambient tint blob that tracks active stage
  const glowX = useTransform(
    progress,
    [0, 0.5, 1],
    ['-15%', '15%', '45%']
  );

  if (prefersReducedMotion) {
    return (
      <section className="relative w-full bg-[#F6F8F3] py-16 text-[#141C17] border-y border-[#141C17]/10">
        <ReducedMotionStoryboard stages={stages} isFull={isFull} />
      </section>
    );
  }

  return (
    <>
      <section
        ref={containerRef}
        style={{ height: isFull ? '780vh' : '540vh' }}
        className="relative w-full bg-[#F6F8F3] text-[#141C17]"
        aria-label={isFull ? 'Interactive Order Journey' : 'Kasi How It Works'}
      >
        {/* Accessibility: Skip link jumping directly past the pinned scene */}
        <a
          href={`#after-journey-${variant}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#0D6E42] focus:text-white focus:text-xs focus:rounded-full focus:shadow-xl focus:outline-none"
        >
          Skip interactive journey
        </a>

        {/* Accessibility: Screen-reader-only structured list of steps with spec text */}
        <ol className="sr-only">
          {stages.map((stage) => (
            <li key={stage.id}>
              <strong>Stage {stage.stepNumber}: {stage.title}</strong> — {stage.desc}
            </li>
          ))}
        </ol>

        {/* Pinned Stage: fills 100svh viewport, sticky at top */}
        <div
          className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 md:px-8 pt-16 pb-4 md:pt-20 md:pb-6 select-none"
          aria-hidden="true"
        >
          {/* Paper Background with subtle Dot-Grid */}
          <div
            className="absolute inset-0 bg-[#F6F8F3] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(20, 28, 23, 0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* At most one soft, blurred, low-opacity tint blob */}
          {!isLowPower && (
            <motion.div
              className="absolute top-1/4 w-[480px] h-[480px] rounded-full bg-[#DBF361]/15 blur-[120px] pointer-events-none"
              style={{ left: glowX }}
            />
          )}

          {/* Top Bar: Active Step Title with lime marker highlight + Spec Description */}
          <header className="relative z-20 max-w-5xl mx-auto w-full flex flex-col items-center sm:items-start pt-1 text-center sm:text-left shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <h3 className="font-display text-2xl md:text-3xl font-medium text-[#141C17] tracking-tight">
                  <span className="bg-[#D4FF5E] px-2 py-0.5 rounded-md inline-block mr-2">
                    {activeStage.title}
                  </span>
                </h3>
                <p className="text-[#141C17]/70 text-sm md:text-base font-normal mt-1 max-w-md">
                  {activeStage.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </header>

          {/* Center Stage: Split Screen (Customer Phone on Left, Vendor Dashboard on Right) */}
          <main className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex items-center justify-center my-auto min-h-0 overflow-visible py-2">
            {/* Desktop Dual-Surface Layout */}
            <div className="hidden lg:grid grid-cols-12 gap-8 items-center w-full px-2">
              {/* Left: Customer WhatsApp Phone */}
              <motion.div
                style={{ scale: phoneScale, opacity: phoneDim }}
                className="col-span-5 flex justify-end"
              >
                <PhoneChat
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                  className="w-full max-w-[370px]"
                />
              </motion.div>

              {/* Right: Vendor Dashboard Panel */}
              <motion.div
                style={{ scale: vendorScale, opacity: vendorDim }}
                className="col-span-7 flex justify-start"
              >
                <VendorPanel
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                  className="w-full max-w-[530px]"
                />
              </motion.div>
            </div>

            {/* Mobile Layout (One Surface at a time, perfectly centered at 380px) */}
            <div className="lg:hidden w-full max-w-[380px] mx-auto flex justify-center">
              {activeStage.stepNumber <= (isFull ? 3 : 2) ? (
                <PhoneChat
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                  className="w-full"
                />
              ) : (
                <VendorPanel
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                  className="w-full"
                />
              )}
            </div>
          </main>

          {/* Bottom Rail: Slim progress rail with display font numbered nodes */}
          <footer className="relative z-20 max-w-3xl mx-auto w-full flex flex-col items-center pb-2 shrink-0">
            <StageRail
              stages={stages}
              activeStageIndex={activeStageIndex}
              onStageClick={scrollToProgress}
            />
          </footer>
        </div>
      </section>

      {/* Target anchor for skip link */}
      <div id={`after-journey-${variant}`} />

      {/* For landing variant: spec 2.6 action button right below the pinned section in normal flow */}
      {!isFull && (
        <div
          data-testid="after-journey-cta"
          className="relative z-20 w-full py-16 bg-[#F6F8F3] border-t border-[#141C17]/10 text-center"
        >
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0D6E42] text-white hover:bg-[#1C774E] transition-all font-medium text-sm shadow-md hover:shadow-lg group"
          >
            <span>See how Kasi works</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      )}
    </>
  );
};

export default JourneyScene;
