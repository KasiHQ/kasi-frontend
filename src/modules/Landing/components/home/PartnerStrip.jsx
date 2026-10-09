import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARTNERS = [
  { name: "Meta", src: "/logos/meta.svg" },
  { name: "OpenAI", src: "/logos/openai.svg" },
  { name: "Paystack", src: "/logos/paystack.svg" },
  { name: "Telegram", src: "/logos/telegram.svg" },
];

export function PartnerStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full border-t border-[#141C17]/10 pt-8 pb-12 mt-12 sm:mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <p className="font-poppins font-normal text-xs sm:text-sm text-[#141C17]/65 tracking-normal shrink-0">
            Built on the official rails, so it stays on.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-8 sm:gap-12 md:gap-14">
            {PARTNERS.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : 0.15 + index * 0.1,
                  ease: "easeOut",
                }}
                className="group flex items-center justify-center h-8"
              >
                <div
                  className="relative h-7 transition-all duration-300 filter grayscale opacity-55 contrast-125 group-hover:filter-none group-hover:opacity-100 group-hover:scale-105 cursor-pointer flex items-center"
                  title={partner.name}
                >
                  <img
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    className="h-7 w-auto object-contain max-h-7"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
