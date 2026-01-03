import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, CheckCircle, Users } from "lucide-react";

const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "yes",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-blush/5 via-background to-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
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
            <Users className="w-5 h-5 text-gold" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </motion.div>
          <h2 className="font-accent text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            RSVP
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            We would be honored to have you celebrate with us. Please let us know if you can attend.
          </p>
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-3xl p-8 shadow-romantic"
            >
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-accent text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-gold/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all font-body text-foreground placeholder:text-muted-foreground/50"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-accent text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-gold/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all font-body text-foreground placeholder:text-muted-foreground/50"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Attendance */}
                <div>
                  <label className="block font-accent text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Will you be attending?
                  </label>
                  <div className="flex gap-4">
                    {["yes", "no"].map((option) => (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: option })}
                        className={`flex-1 py-3 rounded-xl border transition-all font-accent text-sm tracking-wider ${
                          formData.attending === option
                            ? "bg-gold/20 border-gold/50 text-gold"
                            : "bg-background/50 border-gold/20 text-muted-foreground hover:border-gold/40"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Number of Guests */}
                {formData.attending === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block font-accent text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      Number of Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-gold/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all font-body text-foreground"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Message */}
                <div>
                  <label className="block font-accent text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Message for the Couple (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-gold/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all font-body text-foreground placeholder:text-muted-foreground/50 resize-none"
                    placeholder="Share your wishes..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold/80 to-gold/60 text-background font-accent text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Send RSVP
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.div
              className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-3xl p-12 shadow-romantic text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                Thank You!
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Your RSVP has been received. We can't wait to celebrate with you!
              </p>
              <div className="flex items-center justify-center gap-2 text-gold">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span className="font-accent text-sm tracking-wider">See you soon</span>
                <Heart className="w-4 h-4" fill="currentColor" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;
