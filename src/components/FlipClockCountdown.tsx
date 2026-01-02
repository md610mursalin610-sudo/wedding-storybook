import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlipClockCountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlipCard = ({ value, label }: { value: number; label: string }) => {
  const displayValue = String(value).padStart(2, "0");
  const [prevValue, setPrevValue] = useState(displayValue);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (displayValue !== prevValue) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setPrevValue(displayValue);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [displayValue, prevValue]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Card Container */}
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 perspective-1000">
          {/* Main Card */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--champagne)/0.9)] to-[hsl(var(--blush)/0.9)] rounded-xl sm:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-gold/20">
            {/* Top Half */}
            <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--gold-light)/0.6)] to-[hsl(var(--champagne)/0.6)]" />
              <div className="absolute inset-0 flex items-end justify-center pb-0">
                <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--burgundy))] translate-y-1/2">
                  {displayValue}
                </span>
              </div>
            </div>

            {/* Center Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[hsl(var(--gold-dark)/0.35)] z-10" />
            <div className="absolute top-1/2 left-0 w-2 h-3 -translate-y-1/2 bg-[hsl(var(--gold-dark)/0.25)] rounded-r-full" />
            <div className="absolute top-1/2 right-0 w-2 h-3 -translate-y-1/2 bg-[hsl(var(--gold-dark)/0.25)] rounded-l-full" />

            {/* Bottom Half */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--blush)/0.9)] to-[hsl(var(--rose)/0.9)]" />
              <div className="absolute inset-0 flex items-start justify-center pt-0">
                <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--burgundy))] -translate-y-1/2">
                  {displayValue}
                </span>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Flip Animation */}
          <AnimatePresence mode="popLayout">
            {isFlipping && (
              <motion.div
                key={prevValue}
                className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden rounded-t-xl sm:rounded-t-2xl origin-bottom z-20"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -90 }}
                exit={{ rotateX: -90 }}
                transition={{ duration: 0.3, ease: "easeIn" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--gold-light)/0.6)] to-[hsl(var(--champagne)/0.6)] border border-gold/20" />
                <div className="absolute inset-0 flex items-end justify-center pb-0">
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--burgundy))] translate-y-1/2">
                    {prevValue}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-2 bg-gold/10 rounded-2xl blur-xl -z-10" />
      </div>

      {/* Label */}
      <span className="font-accent text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase text-gold/90">
        {label}
      </span>
    </div>
  );
};

const FlipClockCountdown = ({ targetDate }: FlipClockCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const wDate = new Date(targetDate);
    const tick = () => {
      const now = new Date();
      let next = new Date(now.getFullYear(), wDate.getMonth(), wDate.getDate());
      if (next.getTime() < now.getTime()) {
        next = new Date(now.getFullYear() + 1, wDate.getMonth(), wDate.getDate());
      }
      const diff = next.getTime() - now.getTime();
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <motion.div
      className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
    >
      <FlipCard value={timeLeft.days} label="Days" />
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 self-start mt-6 sm:mt-8 md:mt-10">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
      </div>
      <FlipCard value={timeLeft.hours} label="Hours" />
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 self-start mt-6 sm:mt-8 md:mt-10">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
      </div>
      <FlipCard value={timeLeft.minutes} label="Minutes" />
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 self-start mt-6 sm:mt-8 md:mt-10">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
      </div>
      <FlipCard value={timeLeft.seconds} label="Seconds" />
    </motion.div>
  );
};

export default FlipClockCountdown;
