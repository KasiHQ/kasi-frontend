import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CHANNEL_THEMES } from "./channel-themes";

export function RotatingChannelHeadline({ activeChannel }) {
  const currentTheme = CHANNEL_THEMES[activeChannel];
  const shouldReduceMotion = useReducedMotion();

  const wordRef = useRef(null);
  const [wordWidth, setWordWidth] = useState(240);

  useEffect(() => {
    const updateWidth = () => {
      if (wordRef.current) {
        const rect = wordRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setWordWidth(Math.round(rect.width));
        }
      }
    };

    updateWidth();
    const timer = setTimeout(updateWidth, 50);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, [activeChannel]);

  return (
    <div className="w-full">
      <h1 className="font-poppins font-bold tracking-[-0.035em] leading-[0.98] text-[#141C17] text-[clamp(2.75rem,5.6vw,5.5rem)]">
        {/* Screen-reader static title */}
        <span className="sr-only">
          Automate your DMs. Answer every WhatsApp, Instagram and Telegram DM.
        </span>

        {/* Visual presentation */}
        <span aria-hidden="true" className="block select-none">
          <span className="block">Automate your DMs.</span>
          <span className="block mt-2">Answer every</span>

          <span className="flex items-baseline flex-nowrap mt-2">
            <span className="relative inline-grid grid-cols-1 grid-rows-1 align-baseline items-baseline">
              {/* Highlight marker bar */}
              <motion.span
                key={`highlight-${activeChannel}`}
                className="absolute left-[-6px] bottom-1 h-[44%] rounded-[3px] -z-10 pointer-events-none origin-left"
                initial={
                  shouldReduceMotion
                    ? false
                    : { clipPath: "inset(0 100% 0 0)", opacity: 0.7 }
                }
                animate={
                  shouldReduceMotion
                    ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                    : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  width: `${wordWidth + 12}px`,
                  background: currentTheme.highlight,
                }}
              />

              {/* Stacked animated word */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeChannel}
                  ref={wordRef}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { y: "0.35em", opacity: 0, filter: "blur(3px)" }
                  }
                  animate={
                    shouldReduceMotion
                      ? { y: 0, opacity: 1, filter: "blur(0px)" }
                      : { y: 0, opacity: 1, filter: "blur(0px)" }
                  }
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : { y: "-0.35em", opacity: 0, filter: "blur(3px)" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="col-start-1 row-start-1 whitespace-nowrap text-[#141C17] z-10"
                >
                  {currentTheme.word}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* Trailing " DM." smoothly shifts with layout */}
            <motion.span
              layout
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block ml-3 sm:ml-4 text-[#141C17]"
            >
              DM.
            </motion.span>
          </span>
        </span>
      </h1>
    </div>
  );
}
