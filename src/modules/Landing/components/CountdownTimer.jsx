import React, { useState, useEffect } from "react";

export const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    // June 5, 2026 at 00:00:00 UTC+1 (Nigerian Time)
    const targetDate = new Date("2026-06-05T00:00:00+01:00");
    const difference = +targetDate - +new Date();
    
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds }
  ];

  return (
    <div className="inline-flex items-center gap-2 md:gap-4 bg-white dark:bg-[#0A0A0A] border-[2.5px] border-black p-3 md:p-4 rounded-2xl shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#D4F263] select-none font-sans">
      {timeBlocks.map((block, idx) => (
        <React.Fragment key={block.label}>
          <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
            <span className="text-2xl md:text-4xl font-black text-[#0A0A0A] dark:text-white font-bricolage tracking-tight">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] md:text-[10px] font-black text-gray-500 tracking-widest mt-1">
              {block.label}
            </span>
          </div>
          {idx < timeBlocks.length - 1 && (
            <div className="text-xl md:text-3xl font-black text-black dark:text-white self-start pt-0.5 md:pt-1">
              :
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
