import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CHANNEL_THEMES, CHANNEL_SEQUENCE } from "./channel-themes";
import { CHAT_SCRIPTS } from "./chat-scripts";

function ReplyCounter({ seconds }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVal(current);
      if (current >= seconds) {
        clearInterval(interval);
      }
    }, Math.floor(350 / Math.max(seconds, 1)));
    return () => clearInterval(interval);
  }, [seconds]);

  return <span>{val}S</span>;
}

function TypingBubble({ isKasi, bubbleColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-[16px] shadow-sm ${
        isKasi ? "self-end mr-6" : "self-start ml-7"
      }`}
      style={{
        background: isKasi && bubbleColor ? bubbleColor : "#FFFFFF",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#141C17]/40 animate-bounce" />
    </motion.div>
  );
}

export function ChatStage({ activeChannel, onChannelChange, isPausedExternal = false }) {
  const shouldReduceMotion = useReducedMotion();
  const theme = CHANNEL_THEMES[activeChannel];
  const script = CHAT_SCRIPTS[activeChannel];

  const [isHovered, setIsHovered] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const isPaused = isHovered || isPausedExternal;

  useEffect(() => {
    if (shouldReduceMotion) {
      setTimelineStep(9);
      setProgress(100);
      return;
    }

    setTimelineStep(0);
    setProgress(0);

    const stepSchedule = [
      { step: 0, delay: 0 },
      { step: 1, delay: 500 },
      { step: 2, delay: 1200 },
      { step: 3, delay: 1800 },
      { step: 4, delay: 2400 },
      { step: 5, delay: 3200 },
      { step: 6, delay: 3800 },
      { step: 7, delay: 4500 },
      { step: 8, delay: 5100 },
      { step: 9, delay: 5800 },
    ];

    const cycleDuration = 7600;
    let elapsed = 0;
    const intervalMs = 50;

    const interval = setInterval(() => {
      if (isPaused) return;

      elapsed += intervalMs;
      const pct = Math.min((elapsed / cycleDuration) * 100, 100);
      setProgress(pct);

      for (let i = stepSchedule.length - 1; i >= 0; i--) {
        if (elapsed >= stepSchedule[i].delay) {
          setTimelineStep(stepSchedule[i].step);
          break;
        }
      }

      if (elapsed >= cycleDuration) {
        clearInterval(interval);
        const currentIndex = CHANNEL_SEQUENCE.indexOf(activeChannel);
        const nextIndex = (currentIndex + 1) % CHANNEL_SEQUENCE.length;
        onChannelChange(CHANNEL_SEQUENCE[nextIndex]);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeChannel, isPaused, shouldReduceMotion, onChannelChange]);

  const messagesToShow = [];
  if (shouldReduceMotion) {
    messagesToShow.push(...script.messages);
  } else {
    if (timelineStep >= 2) messagesToShow.push(script.messages[0]);
    if (timelineStep >= 4) messagesToShow.push(script.messages[1]);
    if (timelineStep >= 6) messagesToShow.push(script.messages[2]);
    if (timelineStep >= 8) messagesToShow.push(script.messages[3]);
  }

  const showCustomerTyping1 = !shouldReduceMotion && timelineStep === 1;
  const showKasiTyping1 = !shouldReduceMotion && timelineStep === 3;
  const showCustomerTyping2 = !shouldReduceMotion && timelineStep === 5;
  const showKasiTyping2 = !shouldReduceMotion && timelineStep === 7;
  const showOrderCard = shouldReduceMotion || timelineStep >= 9;

  return (
    <div
      className="relative w-full max-w-[440px] mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* WhatsApp Lime glow */}
      <div
        className={`absolute -inset-6 sm:-inset-10 rounded-full bg-[#DBF361]/25 blur-[72px] -z-10 transition-opacity duration-700 pointer-events-none ${
          theme.hasLimeGlow ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="sr-only" aria-live="polite">
        Example exchange on {theme.name}: Customer asks about availability; Kasi replies
        and confirms payment and delivery automatically.
      </div>

      <div
        aria-hidden="true"
        className="relative h-[480px] sm:h-[500px] flex flex-col justify-end overflow-hidden pb-2 px-1 mask-chat-top"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChannel}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: -20, filter: "blur(4px)", transition: { duration: 0.35 } }
            }
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 w-full"
          >
            {/* Context Pill - high contrast WCAG AA */}
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="self-center mb-1"
            >
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#141C17]/15 shadow-xs">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.pillDot }}
                />
                <span className="font-mono-labels text-[11px] font-semibold tracking-wider text-[#141C17] uppercase">
                  {script.contextPill}
                </span>
              </div>
            </motion.div>

            {/* Message Stack */}
            <div className="flex flex-col gap-2.5 w-full">
              {messagesToShow.length >= 1 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start max-w-[85%]"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E6D7CB] text-[#6B4C35] font-mono-labels text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {script.customerInitial}
                    </div>
                    <div className="bg-white text-[#141C17] text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-bl-sm shadow-sm border border-black/[0.04]">
                      {script.messages[0].text}
                    </div>
                  </div>
                  <span className="font-mono-labels text-[10px] text-[#141C17]/60 mt-1 ml-8 uppercase tracking-wider">
                    {script.messages[0].label}
                  </span>
                </motion.div>
              )}

              {showCustomerTyping1 && <TypingBubble isKasi={false} />}

              {messagesToShow.length >= 2 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-end self-end max-w-[85%]"
                >
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <img
                      src="/kasi-icon.svg"
                      alt="Kasi"
                      className="w-6 h-6 rounded-md object-contain shrink-0 shadow-xs"
                    />
                    <div
                      style={{ background: theme.kasiBubble }}
                      className="text-[#141C17] text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-br-sm shadow-sm border border-black/[0.04]"
                    >
                      {script.messages[1].text}
                    </div>
                  </div>
                  <span className="font-mono-labels text-[10px] text-[#141C17]/50 mt-1 mr-8 uppercase tracking-wider">
                    KASI · {theme.name.toUpperCase()} · REPLIED IN{" "}
                    {shouldReduceMotion ? (
                      `${script.messages[1].replyTimeSec}S`
                    ) : (
                      <ReplyCounter seconds={script.messages[1].replyTimeSec || 3} />
                    )}
                  </span>
                </motion.div>
              )}

              {showKasiTyping1 && (
                <TypingBubble isKasi={true} bubbleColor={theme.kasiBubble} />
              )}

              {messagesToShow.length >= 3 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start max-w-[85%]"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E6D7CB] text-[#6B4C35] font-mono-labels text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {script.customerInitial}
                    </div>
                    <div className="bg-white text-[#141C17] text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-bl-sm shadow-sm border border-black/[0.04]">
                      {script.messages[2].text}
                    </div>
                  </div>
                  <span className="font-mono-labels text-[10px] text-[#141C17]/50 mt-1 ml-8 uppercase tracking-wider">
                    {script.messages[2].label}
                  </span>
                </motion.div>
              )}

              {showCustomerTyping2 && <TypingBubble isKasi={false} />}

              {messagesToShow.length >= 4 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-end self-end max-w-[85%]"
                >
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <img
                      src="/kasi-icon.svg"
                      alt="Kasi"
                      className="w-6 h-6 rounded-md object-contain shrink-0 shadow-xs"
                    />
                    <div
                      style={{ background: theme.kasiBubble }}
                      className="text-[#141C17] text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-br-sm shadow-sm border border-black/[0.04]"
                    >
                      {script.messages[3].text}
                    </div>
                  </div>
                  <span className="font-mono-labels text-[10px] text-[#141C17]/50 mt-1 mr-8 uppercase tracking-wider">
                    KASI · {theme.name.toUpperCase()} · REPLIED IN{" "}
                    {shouldReduceMotion ? (
                      `${script.messages[3].replyTimeSec}S`
                    ) : (
                      <ReplyCounter seconds={script.messages[3].replyTimeSec || 2} />
                    )}
                  </span>
                </motion.div>
              )}

              {showKasiTyping2 && (
                <TypingBubble isKasi={true} bubbleColor={theme.kasiBubble} />
              )}

              {showOrderCard && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative mt-1 bg-white rounded-[18px] p-3.5 border border-black/10 shadow-md max-w-[370px] self-center w-full"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono-labels text-[10px] font-semibold text-[#141C17]/40 tracking-wider">
                        {script.orderCard.orderNumber}
                      </span>
                      <h4 className="font-poppins font-semibold text-[#141C17] text-[13.5px] mt-0.5">
                        {script.orderCard.title}
                      </h4>
                      <p className="font-poppins text-[11px] text-[#141C17]/65 mt-0.5">
                        {script.orderCard.subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-poppins font-bold text-[15px] text-[#141C17]">
                        {script.orderCard.amount}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                    <span className="font-mono-labels text-[9.5px] text-[#141C17]/50 tracking-wider uppercase">
                      {script.orderCard.footerLabel}
                    </span>

                    <div className="relative">
                      <motion.div
                        initial={
                          shouldReduceMotion
                            ? false
                            : { scale: 1.6, opacity: 0, rotate: -8 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { scale: 1, opacity: 1, rotate: -8 }
                            : { scale: [1.6, 0.94, 1], opacity: 1, rotate: -8 }
                        }
                        transition={{
                          duration: 0.4,
                          times: [0, 0.75, 1],
                          ease: "easeOut",
                        }}
                        className="px-2.5 py-0.5 rounded-[4px] border-2 border-[#0D6E42] bg-[#0D6E42]/5 text-[#0D6E42] font-mono-labels text-[11px] font-extrabold tracking-wider shadow-xs"
                      >
                        {script.orderCard.stampText}
                      </motion.div>

                      {!shouldReduceMotion && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="absolute inset-0 rounded-[4px] border border-[#0D6E42] pointer-events-none"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Channel Switcher Pills */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {CHANNEL_SEQUENCE.map((cId) => {
          const cTheme = CHANNEL_THEMES[cId];
          const isActive = cId === activeChannel;

          return (
            <button
              key={cId}
              type="button"
              onClick={() => onChannelChange(cId)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono-labels font-medium transition-all ${
                isActive
                  ? "bg-white text-[#141C17] shadow-sm border border-black/15 ring-1 ring-black/5"
                  : "bg-[#F6F8F3]/80 text-[#141C17]/60 hover:text-[#141C17] hover:bg-white/60 border border-black/5"
              }`}
            >
              <img
                src={cTheme.iconPath}
                alt=""
                className="w-3.5 h-3.5 object-contain"
              />
              <span>{cTheme.name}</span>

              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-black/10 rounded-full overflow-hidden">
                  <span
                    className="block h-full transition-all ease-linear"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: cTheme.pillDot,
                    }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
