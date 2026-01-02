import { useState, useEffect } from "react";

interface Photo {
  id: number;
  src: string;
  alt: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

interface MasonryGalleryProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

const MasonryGallery = ({ photos, onPhotoClick }: MasonryGalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gradient-romantic">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Our Memories
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
          Photo Gallery
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-gold" />
          <div className="w-2 h-2 bg-gold rounded-full" />
          <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-gold" />
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-4 md:mb-6 group cursor-pointer"
            onClick={() => onPhotoClick(index)}
          >
            <div 
              className={`
                relative overflow-hidden rounded-lg shadow-soft
                transition-all duration-500 ease-out
                group-hover:shadow-elegant group-hover:-translate-y-1
                ${!loadedImages.has(photo.id) ? 'bg-champagne animate-pulse' : ''}
              `}
            >
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
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
              
              {/* Gold Border on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-lg transition-all duration-500" />
              
              {/* View Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center shadow-elegant">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MasonryGallery;
