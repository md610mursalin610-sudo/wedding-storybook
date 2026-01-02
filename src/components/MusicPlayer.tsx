import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react";

const musicPlaylist = [
  {
    title: "Romantic Piano",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
  },
  {
    title: "Touching Piano",
    url: "https://pixabay.com/music/pop-anthony-love-me-royalty-free-music-177759/",
  },
  {
    title: "Relaxing Harp",
    url: "https://cdn.pixabay.com/audio/2023/10/06/audio_1411544863.mp3",
  },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(musicPlaylist[currentTrackIndex].url);
    audioRef.current.loop = false;
    audioRef.current.volume = volume;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
    audioRef.current.onended = () => handleNext();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrackIndex, isPlaying, volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
      setShowPrompt(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicPlaylist.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      {/* Initial prompt overlay */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-2xl p-8 md:p-10 max-w-md mx-4 text-center shadow-elegant"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-blush flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Music className="w-10 h-10 text-gold" />
              </motion.div>
              
              <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                Welcome to Our Gallery
              </h3>
              <p className="font-body text-muted-foreground mb-8 text-lg">
                Would you like to enjoy our wedding memories with romantic background music?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={togglePlay}
                  className="px-8 py-3 bg-gold text-accent-foreground rounded-full font-body text-base tracking-wide shadow-gold hover:bg-gold-dark transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Play Music
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowPrompt(false)}
                  className="px-8 py-3 border border-border text-muted-foreground rounded-full font-body text-base tracking-wide hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Without
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating player */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className={`
            flex items-center gap-2 bg-background/95 backdrop-blur-md
            rounded-full shadow-elegant border border-gold/20
            transition-all duration-300
            ${isExpanded ? 'px-4 py-2' : 'p-0'}
          `}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
        >
          {/* Previous button */}
          <AnimatePresence>
            {isExpanded && isPlaying && (
              <motion.button
                onClick={handlePrevious}
                className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <SkipBack className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mute button - only visible when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                onClick={toggleMute}
                className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Now playing text */}
          <AnimatePresence>
            {isExpanded && isPlaying && (
              <motion.span
                className="font-body text-sm text-muted-foreground whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                {musicPlaylist[currentTrackIndex].title}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Next button */}
          <AnimatePresence>
            {isExpanded && isPlaying && (
              <motion.button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <SkipForward className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Volume Slider */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 100 }}
                exit={{ opacity: 0, width: 0 }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main play/pause button */}
          <motion.button
            onClick={togglePlay}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full
              transition-all duration-300
              ${isPlaying 
                ? 'bg-gold text-accent-foreground shadow-gold' 
                : 'bg-blush text-foreground hover:bg-blush-medium'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
            
            {/* Animated rings when playing */}
            {isPlaying && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold/40"
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold/30"
                  animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
