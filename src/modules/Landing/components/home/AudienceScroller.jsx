// spec 2.5
import React, { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { HOME_COPY } from "../../../../content/home";
import { DesignedPlaceholder } from "../../../../components/common/DesignedPlaceholder";

export function AudienceScroller() {
  const copy = HOME_COPY["2.5"];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins">
      {/* 2-col header: left title with marker, right sub copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 sm:mb-16">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.12]">
            Made for shops with{" "}
            <span className="relative inline-block">
              <span className="relative z-10">real volume.</span>
              <span
                className="absolute left-0 bottom-1.5 sm:bottom-2 w-full h-3 sm:h-3.5 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <p className="text-base sm:text-lg text-[#141C17]/75 leading-relaxed font-light">
            {copy.sub}
          </p>
          {/* Scroll buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-[#141C17]/15 bg-white flex items-center justify-center text-[#141C17] hover:bg-[#F6F8F3] hover:border-[#141C17]/30 transition-all shadow-xs cursor-pointer"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-[#141C17]/15 bg-white flex items-center justify-center text-[#141C17] hover:bg-[#F6F8F3] hover:border-[#141C17]/30 transition-all shadow-xs cursor-pointer"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroller of 5 category cards with DesignedPlaceholder */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {copy.categories.map((cat) => (
          <div
            key={cat.title}
            className="snap-start shrink-0 w-[280px] sm:w-[310px] h-[390px] rounded-[22px] overflow-hidden relative border border-[#141C17]/10 shadow-xs hover:shadow-lg transition-all group"
          >
            {/* Background Designed Placeholder */}
            <div className="absolute inset-0 w-full h-full">
              <DesignedPlaceholder
                aspect="3/4"
                caption={cat.title}
                className="w-full h-full"
              />
            </div>

            {/* Bottom gradient & category title */}
            <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-[#141C17]/90 via-[#141C17]/40 to-transparent flex flex-col justify-end">
              <h3 className="font-display font-medium text-2xl text-[#F6F8F3] tracking-tight">
                {cat.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AudienceScroller;
