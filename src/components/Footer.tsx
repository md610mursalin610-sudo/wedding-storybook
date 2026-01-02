import { Heart } from "lucide-react";

interface FooterProps {
  coupleNames: string;
}

const Footer = ({ coupleNames }: FooterProps) => {
  return (
    <footer className="py-16 md:py-24 px-4 bg-champagne">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <Heart className="w-6 h-6 text-gold" fill="currentColor" />
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </div>

        {/* Thank You Message */}
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
          Thank You
        </h3>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          For being part of our special day and celebrating love with us. 
          These moments will forever be treasured in our hearts.
        </p>

        {/* Couple Names */}
        <p className="font-display text-xl md:text-2xl italic text-gradient-gold mt-8">
          {coupleNames}
        </p>

        {/* Bottom Border */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <p className="font-body text-sm text-muted-foreground tracking-wider">
            Forever & Always
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
