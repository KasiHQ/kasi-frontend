import React, { useState, useEffect, useId } from 'react';
import { motion, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Pause, ArrowsLeftRight } from '@phosphor-icons/react';
import { useJourneyProgress } from './useJourneyProgress';
import { LANDING_STAGES, FULL_STAGES } from './stages';
import { PhoneChat } from './PhoneChat';
import { VendorPanel } from './VendorPanel';
import { StageRail } from './StageRail';
import { ReducedMotionStoryboard } from './ReducedMotionStoryboard';

function CenterFlowBridge({ stageNumber, isFull }) {
  // Determine flow direction & concise label
  let reverse = false;
  let badge = 'Live Sync';

  if (!isFull) {
    if (stageNumber === 1) {
      reverse = true;
      badge = 'Linking';
    } else if (stageNumber === 2) {
      reverse = true;
      badge = 'Rules Ready';
    } else if (stageNumber === 3) {
      reverse = false;
      badge = 'Closing';
    } else {
      reverse = true;
      badge = 'Auto Ping';
    }
  } else {
    if (stageNumber === 1) {
      reverse = false;
      badge = 'DM In';
    } else if (stageNumber === 2) {
      reverse = true;
      badge = 'Match';
    } else if (stageNumber === 3) {
      reverse = false;
      badge = 'Agreed';
    } else if (stageNumber === 4) {
      reverse = true;
      badge = 'Pay Link';
    } else if (stageNumber === 5) {
      reverse = false;
      badge = 'Verified';
    } else {
      reverse = true;
      badge = 'Updated';
    }
  }

  return (
    <div className="hidden lg:flex flex-col items-center justify-center gap-2 px-1 select-none">
      <div className="relative w-16 h-10 flex items-center justify-center">
        {/* Track */}
        <div className="w-full h-[2px] bg-[#0D6E42]/20 rounded-full relative overflow-hidden">
          <motion.div
            key={`${isFull}-${stageNumber}`}
            className="absolute top-0 h-full w-7 rounded-full bg-gradient-to-r from-transparent via-[#0D6E42] to-[#DBF361]"
            initial={{ left: reverse ? '100%' : '-40%' }}
            animate={{ left: reverse ? '-40%' : '100%' }}
            transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Center Node */}
        <motion.div
          key={`node-${stageNumber}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute w-7 h-7 rounded-full bg-white border border-[#0D6E42]/25 shadow-xs flex items-center justify-center text-[#0D6E42]"
        >
          <ArrowsLeftRight size={13} weight="bold" />
        </motion.div>
      </div>

      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DBF361]/55 text-[#141C17] whitespace-nowrap">
        {badge}
      </span>
    </div>
  );
}

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

  const { containerRef, progress, scrollToProgress, isLowPower } = useJourneyProgress({
    prefersReducedMotion,
  });

  // Track active stage index
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

  useMotionValueEvent(progress, 'change', (latest) => {
    const stageIdx = stages.findIndex(
      (s) => latest >= s.range[0] && latest <= s.range[1]
    );
    if (stageIdx !== -1 && stageIdx !== activeStageIndex) {
      setActiveStageIndex(stageIdx);
    }
  });

  // Optional smooth auto-play stepper when user clicks "Auto-flow"
  useEffect(() => {
    if (!autoPlaying || prefersReducedMotion) return;
    const timer = setInterval(() => {
      const nextIdx = (activeStageIndex + 1) % stages.length;
      scrollToProgress(stages[nextIdx].holdProgress);
      if (nextIdx === stages.length - 1) {
        setAutoPlaying(false);
      }
    }, 2800);
    return () => clearInterval(timer);
  }, [autoPlaying, activeStageIndex, stages, scrollToProgress, prefersReducedMotion]);

  const activeStage = stages[activeStageIndex] || stages[0];

  // Subtle balanced camera focus shifts
  const phoneScale = useTransform(
    progress,
    [0, 0.45, 0.75, 1],
    [1, 1, 0.985, 0.975]
  );

  const vendorScale = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    [0.98, 0.995, 1, 1]
  );

  const glowX = useTransform(progress, [0, 0.5, 1], ['-10%', '20%', '50%']);

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
        style={{ height: isFull ? '620vh' : '440vh' }}
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

        {/* Accessibility: Screen-reader-only structured list of steps */}
        <ol className="sr-only">
          {stages.map((stage) => (
            <li key={stage.id}>
              <strong>Stage {stage.stepNumber}: {stage.title}</strong> — {stage.desc}
            </li>
          ))}
        </ol>

        {/* Pinned Stage: fills 100svh viewport with zero collision across all viewports */}
        <div
          className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 md:px-8 pt-16 pb-3 md:pt-20 md:pb-5 select-none"
          aria-hidden="true"
        >
          {/* Paper Background with subtle Dot-Grid */}
          <div
            className="absolute inset-0 bg-[#F6F8F3] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(20, 28, 23, 0.055) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Bar: Step Counter + Active Title with Lime Highlight + Auto-Flow Control */}
          <header className="relative z-20 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-0.5 text-center sm:text-left shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-mono text-xs font-bold text-[#0D6E42] bg-[#0D6E42]/10 px-2.5 py-0.5 rounded-full">
                    0{activeStage.stepNumber} / 0{stages.length}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-[#141C17] tracking-tight">
                    <span className="bg-[#DBF361] px-2.5 py-0.5 rounded-lg inline-block">
                      {activeStage.title}
                    </span>
                  </h3>
                </div>
                <p className="text-[#141C17]/70 text-xs sm:text-sm md:text-base font-normal">
                  {activeStage.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setAutoPlaying((prev) => !prev)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#141C17]/12 text-xs font-medium text-[#141C17]/80 hover:border-[#0D6E42]/40 hover:text-[#0D6E42] shadow-2xs transition-all cursor-pointer shrink-0"
            >
              {autoPlaying ? (
                <>
                  <Pause size={13} weight="fill" className="text-[#0D6E42]" />
                  <span>Pause flow</span>
                </>
              ) : (
                <>
                  <Play size={13} weight="fill" className="text-[#0D6E42]" />
                  <span>Play flow</span>
                </>
              )}
            </button>
          </header>

          {/* Center Stage: Customer Channel ⇄ Live Sync Conduit ⇄ Vendor OS */}
          <main className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex items-center justify-center my-auto min-h-0 overflow-hidden py-2">
            {/* Desktop Dual-Surface + Bridge Layout */}
            <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 w-full px-2">
              {/* Left: Customer WhatsApp / Multi-channel Phone */}
              <motion.div
                style={{ scale: phoneScale }}
                className="w-[360px] xl:w-[380px] shrink-0"
              >
                <PhoneChat
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                />
              </motion.div>

              {/* Center: Animated Directional Flow Bridge */}
              <CenterFlowBridge
                stageNumber={activeStage.stepNumber}
                isFull={isFull}
              />

              {/* Right: Crisp Native Vendor OS Panel */}
              <motion.div
                style={{ scale: vendorScale }}
                className="flex-1 max-w-[530px] min-w-0"
              >
                <VendorPanel
                  stageNumber={activeStage.stepNumber}
                  isFull={isFull}
                />
              </motion.div>
            </div>

            {/* Mobile / Tablet Layout */}
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

          {/* Bottom Rail: Floating Glass Progress Pill with Continuous Liquid Bar */}
          <footer className="relative z-20 max-w-3xl mx-auto w-full flex flex-col items-center pb-1 shrink-0">
            <StageRail
              stages={stages}
              activeStageIndex={activeStageIndex}
              progress={progress}
              onStageClick={(targetHold) => {
                setAutoPlaying(false);
                scrollToProgress(targetHold);
              }}
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
          className="relative z-20 w-full py-14 bg-[#F6F8F3] border-t border-[#141C17]/10 text-center"
        >
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0D6E42] text-white hover:bg-[#1C774E] transition-all font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <span>See how Kasi works</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default JourneyScene;
