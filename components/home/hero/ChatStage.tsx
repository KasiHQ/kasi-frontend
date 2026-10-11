"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChannelId, CHANNEL_THEMES, CHANNEL_SEQUENCE } from "./channel-themes";
import { CHAT_SCRIPTS, ChatMessage } from "./chat-scripts";

interface ChatStageProps {
  activeChannel: ChannelId;
  onChannelChange: (channel: ChannelId) => void;
  isPausedExternal?: boolean;
}

// Mini component to animate counter from 0 to N seconds
function ReplyCounter({ seconds }: { seconds: number }) {
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

// Typing bubble with three bouncing dots
function TypingBubble({ isKasi, bubbleColor }: { isKasi: boolean; bubbleColor?: string }) {
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
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce" />
    </motion.div>
  );
}

export function ChatStage({
  activeChannel,
  onChannelChange,
  isPausedExternal = false,
}: ChatStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const theme = CHANNEL_THEMES[activeChannel];
  const script = CHAT_SCRIPTS[activeChannel];

  // Stage state
  const [isHovered, setIsHovered] = useState(false);
  const [timelineStep, setTimelineStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // 0 to 100 for active indicator pill

  // Animation timeline step definitions:
  // 0: context pill
  // 1: customer typing
  // 2: customer msg 1
  // 3: kasi typing
  // 4: kasi msg 2
  // 5: customer typing
  // 6: customer msg 3
  // 7: kasi typing
  // 8: kasi msg 4
  // 9: order card arrives + PAID stamp lands
  // 10: hold, then exit and cycle

  const isPaused = isHovered || isPausedExternal;

  // Auto-advance timeline if not reduced motion
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
        // Time to rotate to next channel
        clearInterval(interval);
        const currentIndex = CHANNEL_SEQUENCE.indexOf(activeChannel);
        const nextIndex = (currentIndex + 1) % CHANNEL_SEQUENCE.length;
        onChannelChange(CHANNEL_SEQUENCE[nextIndex]);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeChannel, isPaused, shouldReduceMotion, onChannelChange]);

  const messagesToShow: ChatMessage[] = [];
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
      {/* WhatsApp-only soft lime glow behind chat stage */}
      <div
        className={`absolute -inset-6 sm:-inset-10 rounded-full bg-lime/25 blur-[72px] -z-10 transition-opacity duration-700 pointer-events-none ${
          theme.hasLimeGlow ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Accessible summary for screen readers */}
      <div className="sr-only" aria-live="polite">
        Example exchange on {theme.name}: Customer asks about availability and pricing;
        Kasi responds instantly, confirms address and payment via Paystack, generating a
        paid order automatically.
      </div>

      {/* Floating Chat Stage Cluster */}
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
            {/* Top Context Pill */}
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="self-center mb-1"
            >
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-ink/10 shadow-sm">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.pillDot }}
                />
                <span className="font-mono text-[11px] font-medium tracking-wider text-ink/80 uppercase">
                  {script.contextPill}
                </span>
              </div>
            </motion.div>

            {/* Message Stack */}
            <div className="flex flex-col gap-2.5 w-full">
              {/* Message 1: Customer */}
              {messagesToShow.length >= 1 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start max-w-[85%]"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E6D7CB] text-[#6B4C35] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {script.customerInitial}
                    </div>
                    <div className="bg-white text-ink text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-bl-sm shadow-sm border border-black/[0.04]">
                      {script.messages[0].text}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-ink/50 mt-1 ml-8 uppercase tracking-wider">
                    {script.messages[0].label}
                  </span>
                </motion.div>
              )}

              {/* Typing indicator 1 */}
              {showCustomerTyping1 && <TypingBubble isKasi={false} />}

              {/* Message 2: Kasi */}
              {messagesToShow.length >= 2 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-end self-end max-w-[85%]"
                >
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center shrink-0 shadow-xs">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 11C6 16.5 10 18.5 12 18.5C14 18.5 18 16.5 20 11"
                          stroke="#DBF361"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <circle cx="7.5" cy="8.5" r="1.5" fill="#DBF361" />
                        <circle cx="16.5" cy="8.5" r="1.5" fill="#DBF361" />
                      </svg>
                    </div>
                    <div
                      style={{ background: theme.kasiBubble }}
                      className="text-ink text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-br-sm shadow-sm border border-black/[0.04]"
                    >
                      {script.messages[1].text}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-ink/50 mt-1 mr-8 uppercase tracking-wider">
                    KASI · {theme.name.toUpperCase()} · REPLIED IN{" "}
                    {shouldReduceMotion ? (
                      `${script.messages[1].replyTimeSec}S`
                    ) : (
                      <ReplyCounter seconds={script.messages[1].replyTimeSec || 3} />
                    )}
                  </span>
                </motion.div>
              )}

              {/* Typing indicator 2 (Kasi) */}
              {showKasiTyping1 && (
                <TypingBubble isKasi={true} bubbleColor={theme.kasiBubble} />
              )}

              {/* Message 3: Customer */}
              {messagesToShow.length >= 3 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start max-w-[85%]"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E6D7CB] text-[#6B4C35] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {script.customerInitial}
                    </div>
                    <div className="bg-white text-ink text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-bl-sm shadow-sm border border-black/[0.04]">
                      {script.messages[2].text}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-ink/50 mt-1 ml-8 uppercase tracking-wider">
                    {script.messages[2].label}
                  </span>
                </motion.div>
              )}

              {/* Typing indicator 3 (Customer) */}
              {showCustomerTyping2 && <TypingBubble isKasi={false} />}

              {/* Message 4: Kasi */}
              {messagesToShow.length >= 4 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-end self-end max-w-[85%]"
                >
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center shrink-0 shadow-xs">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 11C6 16.5 10 18.5 12 18.5C14 18.5 18 16.5 20 11"
                          stroke="#DBF361"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <circle cx="7.5" cy="8.5" r="1.5" fill="#DBF361" />
                        <circle cx="16.5" cy="8.5" r="1.5" fill="#DBF361" />
                      </svg>
                    </div>
                    <div
                      style={{ background: theme.kasiBubble }}
                      className="text-ink text-[13.5px] leading-relaxed px-4 py-2.5 rounded-[18px] rounded-br-sm shadow-sm border border-black/[0.04]"
                    >
                      {script.messages[3].text}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-ink/50 mt-1 mr-8 uppercase tracking-wider">
                    KASI · {theme.name.toUpperCase()} · REPLIED IN{" "}
                    {shouldReduceMotion ? (
                      `${script.messages[3].replyTimeSec}S`
                    ) : (
                      <ReplyCounter seconds={script.messages[3].replyTimeSec || 2} />
                    )}
                  </span>
                </motion.div>
              )}

              {/* Typing indicator 4 (Kasi) */}
              {showKasiTyping2 && (
                <TypingBubble isKasi={true} bubbleColor={theme.kasiBubble} />
              )}

              {/* Final Beat: Order Card + PAID stamp */}
              {showOrderCard && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative mt-1 bg-white rounded-card p-3.5 border border-ink/10 shadow-md max-w-[370px] self-center w-full"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-semibold text-ink/40 tracking-wider">
                        {script.orderCard.orderNumber}
                      </span>
                      <h4 className="font-sans font-semibold text-ink text-[13.5px] mt-0.5">
                        {script.orderCard.title}
                      </h4>
                      <p className="font-sans text-[11px] text-ink/65 mt-0.5">
                        {script.orderCard.subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-sans font-bold text-[15px] text-ink">
                        {script.orderCard.amount}
                      </span>
                    </div>
                  </div>

                  {/* PAID stamp */}
                  <div className="relative mt-2 pt-2 border-t border-ink/5 flex items-center justify-between">
                    <span className="font-mono text-[9.5px] text-ink/50 tracking-wider uppercase">
                      {script.orderCard.footerLabel}
                    </span>

                    {/* The Stamp */}
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
                        className="px-2.5 py-0.5 rounded-[4px] border-2 border-forest bg-forest/5 text-forest font-mono text-[11px] font-extrabold tracking-wider shadow-xs"
                      >
                        {script.orderCard.stampText}
                      </motion.div>

                      {/* Expanding ripple pulse ring behind the stamp */}
                      {!shouldReduceMotion && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="absolute inset-0 rounded-[4px] border border-forest pointer-events-none"
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

      {/* Channel Indicator Pills below stage */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {CHANNEL_SEQUENCE.map((cId) => {
          const cTheme = CHANNEL_THEMES[cId];
          const isActive = cId === activeChannel;

          return (
            <button
              key={cId}
              type="button"
              onClick={() => onChannelChange(cId)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? "bg-white text-ink shadow-sm border border-ink/15 ring-1 ring-ink/5"
                  : "bg-paper/70 text-ink/60 hover:text-ink hover:bg-white/60 border border-ink/5"
              }`}
            >
              <span className="relative w-3.5 h-3.5 shrink-0">
                <Image
                  src={cTheme.iconPath}
                  alt=""
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain"
                />
              </span>
              <span>{cTheme.name}</span>

              {/* Thin progress bar underneath the active pill */}
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
