import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FooterProps {
  coupleNames: string;
}

const Footer = ({ coupleNames }: FooterProps) => {
  return (
    <footer className="py-20 md:py-28 px-4 bg-champagne relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-foreground rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Top Ornament */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-6 h-6 text-gold" fill="currentColor" />
          </motion.div>
          <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Thank You
          </h3>
          <p className="font-body text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            For being part of our special day and celebrating love with us.
            These moments will forever be treasured in our hearts.
          </p>
        </motion.div>

        {/* Couple Names */}
        <motion.div
          className="mt-10 relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute -inset-6 bg-gold/5 rounded-full blur-2xl" />
          <p className="relative font-display text-2xl md:text-3xl italic text-gradient-gold">
            {coupleNames}
          </p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="w-1.5 h-1.5 bg-gold/30 rounded-full" />
          <div className="w-12 h-px bg-gold/20" />
          <div className="w-2 h-2 bg-gold/50 rounded-full" />
          <div className="w-12 h-px bg-gold/20" />
          <div className="w-1.5 h-1.5 bg-gold/30 rounded-full" />
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-gold/15"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="font-accent text-sm text-muted-foreground tracking-[0.3em] uppercase">
            Forever & Always
          </p>
          <p className="font-body text-xs text-muted-foreground/60 mt-4">
            With love and gratitude
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
