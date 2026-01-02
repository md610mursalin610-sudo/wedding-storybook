import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Play, Pause } from "lucide-react";
import { resolveDownloadHref, resolveImageSrc, resolveDriveThumb } from "@/lib/utils";

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Lightbox = ({ photos, currentIndex, isOpen, onClose, onPrevious, onNext }: LightboxProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  useEffect(() => {
    if (isSlideshowActive) {
      const timer = setInterval(() => {
        onNext();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isSlideshowActive, onNext]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
        break;
      case "ArrowLeft":
        if (!isZoomed) onPrevious();
        break;
      case "ArrowRight":
        if (!isZoomed) onNext();
        break;
    }
  }, [isOpen, isZoomed, onClose, onPrevious, onNext]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsZoomed(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onPrevious();
    } else if (info.offset.x < -threshold) {
      onNext();
    }
    setDragOffset(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resolveDownloadHref(photos[currentIndex].src);
    link.download = `wedding-photo-${currentIndex + 1}.jpg`;
    link.click();
  };

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-foreground/98 backdrop-blur-md"
          onClick={() => !isZoomed && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-20 flex items-center justify-between">
          {/* Photo counter */}
          <motion.div
            className="px-4 py-2 rounded-full bg-foreground/80 text-background shadow-elegant"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-body text-sm tracking-widest">
              {currentIndex + 1} / {photos.length}
            </span>
          </motion.div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-colors shadow-elegant"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={() => setIsSlideshowActive(!isSlideshowActive)}
              aria-label={isSlideshowActive ? "Pause slideshow" : "Play slideshow"}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-colors shadow-elegant"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isSlideshowActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={handleDownload}
              aria-label="Download image"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-colors shadow-elegant"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Download className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={onClose}
              aria-label="Close lightbox"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-colors shadow-elegant"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Navigation - Previous */}
        {!isZoomed && (
          <motion.button
            onClick={onPrevious}
            aria-label="Previous image"
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-all shadow-elegant"
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        )}

        {/* Navigation - Next */}
        {!isZoomed && (
          <motion.button
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground/90 transition-all shadow-elegant"
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        )}

        {/* Image Container with swipe */}
        <motion.div
          className={`relative z-10 flex items-center justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          drag={!isZoomed ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={(_, info) => setDragOffset(info.offset.x)}
          onDragEnd={handleDragEnd}
          onClick={() => setIsZoomed(!isZoomed)}
          style={{ x: dragOffset }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.id}
              src={resolveImageSrc(currentPhoto.src)}
              alt={currentPhoto.alt}
              className={`
                max-h-[85vh] object-contain rounded-lg
                transition-transform duration-300
                ${isZoomed ? 'max-w-none scale-150' : 'max-w-[90vw]'}
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.dataset.fallbackApplied) {
                  img.dataset.fallbackApplied = "1";
                  img.src = resolveDriveThumb(currentPhoto.src, 2000);
                }
              }}
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>

        {/* Caption below image */}
        {currentPhoto?.caption && (
          <motion.div
            className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2 rounded-xl bg-background/90 text-foreground border border-gold/15 shadow-elegant backdrop-blur-sm max-w-[90vw] md:max-w-2xl text-center">
              <p className="font-body text-sm md:text-base leading-snug">{currentPhoto.caption}</p>
            </div>
          </motion.div>
        )}

        {/* Thumbnail strip */}
        <motion.div
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-3 glass rounded-full max-w-[90vw] overflow-x-auto scrollbar-hide">
            {photos.slice(Math.max(0, currentIndex - 3), Math.min(photos.length, currentIndex + 4)).map((photo, i) => {
              const actualIndex = Math.max(0, currentIndex - 3) + i;
              return (
                <motion.button
                  key={photo.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const diff = actualIndex - currentIndex;
                    if (diff > 0) {
                      for (let j = 0; j < diff; j++) onNext();
                    } else if (diff < 0) {
                      for (let j = 0; j < Math.abs(diff); j++) onPrevious();
                    }
                  }}
                  aria-label={`View image ${actualIndex + 1}`}
                  className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0
                    transition-all duration-200
                    ${actualIndex === currentIndex
                      ? 'ring-2 ring-gold scale-110'
                      : 'opacity-50 hover:opacity-80'
                    }
                  `}
                  whileHover={{ scale: actualIndex === currentIndex ? 1.1 : 1.05 }}
                >
                  <img
                    src={resolveImageSrc(photo.src)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.dataset.fallbackApplied) {
                        img.dataset.fallbackApplied = "1";
                        img.src = resolveDriveThumb(photo.src, 400);
                      }
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Swipe hint */}
        {!isZoomed && (
          <motion.p
            className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 text-background/50 font-body text-xs tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Swipe or use arrow keys to navigate
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
