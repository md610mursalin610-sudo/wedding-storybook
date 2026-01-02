import { useState } from "react";
import { motion } from "framer-motion";

interface Photo {
  id: number;
  src: string;
  alt: string;
  category: string;
  caption: string;
}

interface MasonryGalleryProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

const categories = ["All", "Ceremony", "Reception", "Portraits", "Details"];

const MasonryGallery = ({ photos, onPhotoClick }: MasonryGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const filteredPhotos = activeCategory === "All" 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory);

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-gradient-romantic relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-champagne to-transparent" />
      
      {/* Section Header */}
      <motion.div
        className="text-center mb-16 md:mb-20 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-accent text-sm md:text-base tracking-[0.4em] uppercase text-muted-foreground mb-4">
          Cherished Moments
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          Our Gallery
        </h2>
        
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
            <div className="w-2.5 h-2.5 bg-gold rounded-full" />
            <div className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
          </div>
          <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-5 py-2.5 rounded-full font-body text-sm md:text-base tracking-wider
                transition-all duration-300 border
                ${activeCategory === category
                  ? "bg-gold text-accent-foreground border-gold shadow-gold"
                  : "bg-transparent text-muted-foreground border-border hover:border-gold/50 hover:text-foreground"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Masonry Grid */}
      <motion.div 
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 max-w-7xl mx-auto"
        layout
      >
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="break-inside-avoid mb-4 md:mb-6 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            layout
            onClick={() => onPhotoClick(photos.indexOf(photo))}
          >
            <motion.div
              className="photo-frame group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Skeleton loader */}
              {!loadedImages.has(photo.id) && (
                <div className="absolute inset-0 bg-champagne animate-pulse" />
              )}
              
              {/* Image */}
              <img
                src={photo.src}
                alt={photo.alt}
                className={`
                  w-full h-auto object-cover
                  transition-all duration-700 ease-out
                  group-hover:scale-105
                  ${loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => handleImageLoad(photo.id)}
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* View indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <motion.div
                  className="w-14 h-14 bg-background/95 rounded-full flex items-center justify-center shadow-elegant backdrop-blur-sm"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </motion.div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-body bg-black/50 p-2 rounded">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MasonryGallery;
