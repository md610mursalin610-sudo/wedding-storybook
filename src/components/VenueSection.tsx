import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Navigation } from "lucide-react";

const VenueSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-blush/5 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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
            <MapPin className="w-5 h-5 text-gold" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </motion.div>
          <h2 className="font-accent text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Wedding Venue
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Join us at this beautiful location for our special day
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Venue Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
              alt="Wedding Venue"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            
            {/* Venue Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl md:text-3xl text-ivory mb-2">
                Grand Garden Estate
              </h3>
              <p className="font-body text-ivory/80 text-sm">
                An enchanting venue surrounded by nature
              </p>
            </div>
          </motion.div>

          {/* Venue Details */}
          <motion.div
            className="flex flex-col justify-center gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Date & Time Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-foreground mb-1">Date & Time</h4>
                  <p className="font-body text-muted-foreground">December 26, 2024</p>
                  <p className="font-body text-muted-foreground">5:00 PM onwards</p>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display text-lg text-foreground mb-1">Schedule</h4>
                  <div className="font-body text-sm text-muted-foreground space-y-1">
                    <p>5:00 PM - Guest Arrival</p>
                    <p>5:30 PM - Ceremony Begins</p>
                    <p>6:30 PM - Reception & Dinner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg text-foreground mb-1">Location</h4>
                  <p className="font-body text-muted-foreground text-sm mb-3">
                    123 Garden Avenue, Paradise City, State 12345
                  </p>
                  <motion.a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-accent tracking-wider hover:bg-gold/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
