// spec 2.5
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOME_COPY } from "../../../../content/home";

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="max-w-[700px]">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#141C17] tracking-tight leading-[1.12]">
            {copy.heading}
          </h2>
          <p className="mt-4 font-light text-base sm:text-lg text-[#141C17]/75 leading-relaxed">
            {copy.sub}
          </p>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-11 h-11 rounded-full border border-[#141C17]/15 bg-white flex items-center justify-center text-[#141C17] hover:bg-[#F6F8F3] hover:border-[#141C17]/30 transition-all shadow-xs"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-11 h-11 rounded-full border border-[#141C17]/15 bg-white flex items-center justify-center text-[#141C17] hover:bg-[#F6F8F3] hover:border-[#141C17]/30 transition-all shadow-xs"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller with CSS scroll snap */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {copy.categories.map((cat) => (
          <div
            key={cat.title}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-[22px] overflow-hidden bg-white border border-[#141C17]/10 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div className="relative h-[240px] sm:h-[260px] w-full overflow-hidden bg-[#F6F8F3]">
              <img
                data-swap="vendor-real"
                src={cat.image}
                alt={`${cat.title} merchant`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono-labels text-[11px] font-semibold uppercase tracking-wider text-[#DBF361] bg-[#141C17]/80 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {cat.tag}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-xl text-[#141C17]">{cat.title}</h3>
              <p className="text-xs text-[#141C17]/65 mt-1">
                Autonomous product consultation, negotiations, and payments.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AudienceScroller;
