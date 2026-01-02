import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import Footer from "@/components/Footer";
import FloatingPetals from "@/components/FloatingPetals";

// Wedding photos with categories and varied aspect ratios
const weddingPhotos = [
  { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", alt: "Bride and groom portrait", category: "Portraits" },
  { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", alt: "Wedding ceremony", category: "Ceremony" },
  { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80", alt: "Couple dancing", category: "Reception" },
  { id: 4, src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&q=80", alt: "Wedding rings", category: "Details" },
  { id: 5, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80", alt: "Bridal bouquet", category: "Details" },
  { id: 6, src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80", alt: "Wedding venue", category: "Ceremony" },
  { id: 7, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80", alt: "Wedding details", category: "Details" },
  { id: 8, src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=700&q=80", alt: "Couple sunset", category: "Portraits" },
  { id: 9, src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", alt: "Wedding reception", category: "Reception" },
  { id: 10, src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80", alt: "Bride getting ready", category: "Portraits" },
  { id: 11, src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80", alt: "Wedding kiss", category: "Ceremony" },
  { id: 12, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", alt: "Wedding cake", category: "Details" },
  { id: 13, src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=700&q=80", alt: "First dance", category: "Reception" },
  { id: 14, src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80", alt: "Bride portrait", category: "Portraits" },
  { id: 15, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", alt: "Garden ceremony", category: "Ceremony" },
  { id: 16, src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80", alt: "Table settings", category: "Details" },
];

const Index = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const coupleNames = "Emma & James";
  const weddingDate = "September 15, 2024";
  const heroImage = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80";

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? weddingPhotos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prev) =>
      prev === weddingPhotos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen relative">
      {/* Floating petals animation */}
      <FloatingPetals />

      <HeroSection
        coupleNames={coupleNames}
        weddingDate={weddingDate}
        backgroundImage={heroImage}
      />

      <MasonryGallery
        photos={weddingPhotos}
        onPhotoClick={handlePhotoClick}
      />

      <Lightbox
        photos={weddingPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <Footer coupleNames={coupleNames} />
    </main>
  );
};

export default Index;
