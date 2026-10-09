import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARTNERS = [
  { name: "Meta", logo: "/logos/meta.svg", label: "Official Meta Partner" },
  { name: "Payments by Paystack", logo: "/logos/paystack.svg", label: "Payments by Paystack" },
  { name: "Powered by OpenAI", logo: "/logos/openai.svg", label: "Powered by OpenAI" },
  { name: "Telegram Partner", logo: "/logos/telegram.svg", label: "Telegram Official Rail" },
];

export function PartnerStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full border-t border-[#141C17]/10 pt-6 pb-10 mt-10 sm:mt-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <p className="font-poppins font-normal text-xs sm:text-sm text-[#141C17]/65 tracking-normal shrink-0">
            Built on the official rails, so it stays on.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-6 sm:gap-10 md:gap-12">
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
                className="group flex items-center gap-2.5 h-8 cursor-pointer"
                title={partner.label}
              >
                <div className="relative h-6 w-auto transition-all duration-300 filter grayscale opacity-60 contrast-125 group-hover:filter-none group-hover:opacity-100 group-hover:scale-105 flex items-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-5 sm:h-6 w-auto object-contain max-h-6"
                  />
                </div>
                <span className="font-poppins text-xs font-medium text-[#141C17]/60 group-hover:text-[#141C17] transition-colors hidden lg:inline-block">
                  {partner.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
