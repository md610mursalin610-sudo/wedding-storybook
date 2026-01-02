import { Heart } from "lucide-react";

interface HeroSectionProps {
  coupleNames: string;
  weddingDate: string;
  backgroundImage: string;
}

const HeroSection = ({ coupleNames, weddingDate, backgroundImage }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-gold/20 rounded-full animate-float opacity-50" />
      <div className="absolute bottom-20 right-10 w-20 h-20 border border-gold/30 rounded-full animate-float delay-300 opacity-40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-fade-in">
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <Heart className="w-5 h-5 text-gold animate-shimmer" fill="currentColor" />
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
        
        {/* Couple Names */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-wide text-foreground opacity-0 animate-slide-up delay-200">
          {coupleNames}
        </h1>
        
        {/* Wedding Label */}
        <p className="font-body text-lg md:text-xl tracking-[0.3em] uppercase text-muted-foreground mt-6 mb-4 opacity-0 animate-fade-in delay-300">
          Wedding Celebration
        </p>
        
        {/* Date */}
        <p className="font-display text-xl md:text-2xl lg:text-3xl italic text-gradient-gold opacity-0 animate-slide-up delay-400">
          {weddingDate}
        </p>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in delay-500">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="font-body text-sm tracking-widest uppercase">Scroll to view gallery</span>
            <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-gold rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
