import { useEffect, useState } from "react";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  opacity: number;
}

const FloatingPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 15; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 15 + Math.random() * 10,
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
          opacity: 0.3 + Math.random() * 0.4,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${petal.x}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            className="animate-petal-sway"
            style={{
              opacity: petal.opacity,
              transform: `rotate(${petal.rotation}deg)`,
              animationDelay: `${petal.delay * 0.5}s`,
            }}
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z"
              fill="hsl(345 35% 75%)"
              opacity="0.8"
            />
            <path
              d="M12 6C12 6 9 9 9 12C9 15 12 18 12 18C12 18 15 15 15 12C15 9 12 6 12 6Z"
              fill="hsl(345 40% 82%)"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
