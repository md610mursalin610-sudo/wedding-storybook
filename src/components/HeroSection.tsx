import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import FlipClockCountdown from "./FlipClockCountdown";

interface HeroSectionProps {
  coupleNames: string;
  weddingDate: string;
  backgroundImage: string;
}

const HeroSection = ({ coupleNames, weddingDate, backgroundImage }: HeroSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const names = coupleNames.split(" & ");
  const d = new Date(weddingDate);
  const day = d.getDate();
  const suffix = (n: number) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };
  const month = d.toLocaleString("en-US", { month: "long" });
  const displayDate = `${day}${suffix(day)} ${month}`;

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y: backgroundY,
        }}
      />

      {/* Gradient Overlay - softened gold tint to replace harsh white shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-background/30 to-transparent" />

      {/* Decorative Corner Elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-gold/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-gold/30 rounded-tr-lg" />
      <div className="absolute bottom-32 left-8 w-24 h-24 border-l-2 border-b-2 border-gold/30 rounded-bl-lg" />
      <div className="absolute bottom-32 right-8 w-24 h-24 border-r-2 border-b-2 border-gold/30 rounded-br-lg" />

      {/* Floating Decorative Circles */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full border border-gold/20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[15%] w-20 h-20 rounded-full border border-rose/20"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ y: textY, opacity }}
      >
        {/* Top Ornament */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <Heart className="w-5 h-5 text-gold animate-pulse-glow" fill="currentColor" />
          <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </motion.div>

        {/* Wedding Label */}
        <motion.p
          className="font-accent text-sm md:text-base tracking-[0.5em] uppercase text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          The Wedding of
        </motion.p>

        {/* Couple Names - Animated */}
        <div className="relative mb-8">
          <motion.h1
            className="font-accent text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-wide text-ivory drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {names[0]}
          </motion.h1>
          
          <motion.span
            className="block font-accent text-3xl md:text-4xl lg:text-5xl text-gold my-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            &
          </motion.span>
          
          <motion.h1
            className="font-accent text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-wide text-ivory drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {names[1]}
          </motion.h1>
        </div>

        {/* Date with elegant styling */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="absolute -inset-4 bg-gold/5 rounded-full blur-xl" />
          <div className="inline-flex items-center px-6 py-2.5 rounded-2xl bg-[#EBC4D2]/70 border border-[#D49AAA]/50 shadow-[0_6px_20px_rgba(0,0,0,0.06)] backdrop-blur-[2px]">
            <p className="relative font-display text-xl md:text-2xl lg:text-3xl italic text-[#8F4455] tracking-wide">
              {displayDate}
            </p>
          </div>
        </motion.div>

        {/* Flip Clock Countdown */}
        <div className="mt-8 md:mt-10">
          <FlipClockCountdown targetDate={weddingDate} />
        </div>

        {/* Bottom Ornament */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="w-2 h-2 bg-gold/40 rounded-full" />
          <div className="w-16 h-px bg-gold/30" />
          <div className="w-3 h-3 bg-gold/60 rounded-full" />
          <div className="w-16 h-px bg-gold/30" />
          <div className="w-2 h-2 bg-gold/40 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="font-body text-sm tracking-[0.3em] uppercase">View Gallery</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-gold" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
