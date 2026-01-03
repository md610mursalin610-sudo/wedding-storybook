import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Sparkles } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: "heart" | "calendar" | "location" | "sparkles";
}

const timelineItems: TimelineItem[] = [
  {
    date: "March 2020",
    title: "First Met",
    description: "Our eyes met across the room at a friend's gathering. Little did we know that moment would change our lives forever.",
    icon: "heart",
  },
  {
    date: "June 2020",
    title: "First Date",
    description: "A simple coffee date turned into hours of conversation and laughter. We knew something special was beginning.",
    icon: "calendar",
  },
  {
    date: "December 2022",
    title: "The Proposal",
    description: "Under a sky full of stars, the question was asked and answered with joyful tears and a resounding yes!",
    icon: "sparkles",
  },
  {
    date: "December 2024",
    title: "Forever Begins",
    description: "Surrounded by loved ones, we celebrate the beginning of our forever journey together.",
    icon: "location",
  },
];

const iconMap = {
  heart: Heart,
  calendar: Calendar,
  location: MapPin,
  sparkles: Sparkles,
};

const LoveStorySection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-blush/5 to-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <Heart className="w-5 h-5 text-gold" fill="currentColor" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </motion.div>
          <h2 className="font-accent text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Our Love Story
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Every love story is beautiful, but ours is our favorite
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20 md:-translate-x-1/2" />

          {timelineItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                className={`relative flex items-center mb-12 md:mb-16 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Icon Circle */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10">
                  <motion.div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold/80 to-gold/60 flex items-center justify-center shadow-lg shadow-gold/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-background" />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                    isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                  }`}
                >
                  <motion.div
                    className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-2xl p-6 shadow-romantic hover:shadow-gold transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="inline-block font-accent text-xs tracking-[0.2em] uppercase text-gold mb-2">
                      {item.date}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LoveStorySection;
