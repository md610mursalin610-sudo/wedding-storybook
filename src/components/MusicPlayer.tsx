import { useState, useRef, useEffect, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX, SkipForward, SkipBack } from "lucide-react";
import ReactPlayer from "react-player";


const musicPlaylist = [
  {
    title: "Romantic Piano",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
  },
  {
    title: "Touching Piano",
    url: "https://youtu.be/DR-S_cuxYN4?si=A6MH-kViT4d18iTp",
  },
  {
    title: "Relaxing Harp",
    url: "https://cdn.pixabay.com/download/audio/2025/12/26/audio_3c05258be0.mp3",
  },
  {
    title: "Rock Music Free",
    url: "https://pixabay.com/music/rock-music-free-458044/",
  },
  {
    title: "Music Free (Pixabay)",
    url: "/music/music-free-458044.mp3",
  },
  {
    title: "Happy Kids Background (Pixabay)",
    url: "/music/happy-kids-background-music-456466.mp3",
  },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isTrayHovered, setIsTrayHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [trayWidth, setTrayWidth] = useState(320);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrl = musicPlaylist[currentTrackIndex].url;
  const isYouTube = /(?:youtube\.com|youtu\.be)\//i.test(currentUrl);
  type PlayerProps = {
    url: string;
    playing: boolean;
    muted: boolean;
    volume: number;
    controls?: boolean;
    width?: number | string;
    height?: number | string;
    onEnded?: () => void;
  };
  const RP = ReactPlayer as unknown as ComponentType<PlayerProps>;

  useEffect(() => {
    const checkEnv = () => {
      setIsSmall(window.innerWidth < 768);
      setIsTouch(
        ("ontouchstart" in window) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        (window.matchMedia && window.matchMedia("(hover: none)").matches)
      );
      const vw = window.innerWidth;
      const w = Math.min(360, Math.max(260, vw - 96));
      setTrayWidth(w);
    };
    checkEnv();
    window.addEventListener("resize", checkEnv);
    return () => window.removeEventListener("resize", checkEnv);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (!isYouTube) {
      audioRef.current = new Audio(currentUrl);
      audioRef.current.loop = false;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
      audioRef.current.onended = () => handleNext();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrackIndex, isPlaying, volume, isMuted, isYouTube, currentUrl]);

  const togglePlay = () => {
    if (!isYouTube) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
        setShowPrompt(false);
      }
    } else {
      if (!isPlaying) setShowPrompt(false);
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
    if (!isYouTube) {
      if (!audioRef.current) return;
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (!isYouTube && audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPrompt(false);
    setIsPlaylistOpen(false);
  };

  const mobileSliderW = Math.max(60, Math.min(120, trayWidth - 260));

  useEffect(() => {
    if (isPlaylistOpen || isTrayHovered) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isPlaylistOpen, isTrayHovered]);

  return (
    <>
      <AnimatePresence>
        {isYouTube && (
          <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }}>
            <RP
              url={currentUrl}
              playing={isPlaying}
              muted={isMuted}
              volume={volume}
              controls={false}
              width={0}
              height={0}
              onEnded={handleNext}
            />
          </div>
        )}
      </AnimatePresence>
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
            ${isExpanded ? 'px-4 py-2' : (isSmall ? 'p-1.5' : 'p-0')}
          `}
          style={{ position: 'relative' }}
          onMouseEnter={!isTouch ? () => setIsTrayHovered(true) : undefined}
          onMouseLeave={!isTouch ? () => setIsTrayHovered(false) : undefined}
          onClick={isTouch ? () => setIsExpanded(v => !v) : undefined}
        >
          {/* Controls tray (slides open to the left on small screens) */}
          <motion.div
            className={`flex items-center gap-2 ${isSmall ? 'flex-row-reverse overflow-hidden absolute right-full top-1/2 -translate-y-1/2 mr-2 z-50' : ''}`}
            initial={isSmall ? { width: 0, opacity: 0 } : undefined}
            animate={isSmall ? { width: isExpanded ? trayWidth : 0, opacity: isExpanded ? 1 : 0 } : undefined}
            transition={{ duration: 0.25 }}
          >
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Previous button */}
                  <button
                    onClick={handlePrevious}
                    aria-label="Previous track"
                    className={`${isSmall ? 'w-8 h-8' : 'w-9 h-9'} flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-muted transition-colors`}
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Mute button */}
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                    className={`${isSmall ? 'w-8 h-8' : 'w-9 h-9'} flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-muted transition-colors`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Now playing with anchored dropdown */}
                  <div className="relative">
                    <span
                      className={`font-body ${isSmall ? 'text-xs' : 'text-sm'} text-muted-foreground whitespace-nowrap cursor-pointer select-none ${isSmall ? 'max-w-[120px]' : 'max-w-[240px]'} truncate`}
                      onClick={() => setIsPlaylistOpen(v => !v)}
                      onMouseEnter={!isTouch ? () => setIsPlaylistOpen(true) : undefined}
                      title={musicPlaylist[currentTrackIndex].title}
                    >
                      {musicPlaylist[currentTrackIndex].title}
                    </span>

                    <AnimatePresence>
                      {isPlaylistOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className={`absolute bottom-full ${isSmall ? 'left-1/2 -translate-x-1/2' : 'right-0'} mb-2 bg-background rounded-xl shadow-elegant border border-gold/20 overflow-hidden z-[60]`}
                          onMouseLeave={!isTouch ? () => setIsPlaylistOpen(false) : undefined}
                        >
                          <div className={`${isSmall ? 'min-w-[200px] max-w-[90vw]' : 'min-w-[240px]'} max-h-64 overflow-auto`}>
                            {musicPlaylist.map((track, idx) => (
                              <button
                                key={idx}
                                onClick={() => selectTrack(idx)}
                                aria-selected={idx === currentTrackIndex}
                                className={`w-full text-left px-4 py-3 text-sm font-body transition-colors ${idx === currentTrackIndex ? 'bg-gold/10 text-foreground border-l-2 border-gold' : 'text-muted-foreground hover:bg-muted'}`}
                              >
                                {track.title}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    aria-label="Next track"
                    className={`${isSmall ? 'w-8 h-8' : 'w-9 h-9'} flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-muted transition-colors`}
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex-1 min-w-[40px]">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main play/pause button */}
          <motion.button
            onClick={togglePlay}
            className={`
              ${isSmall ? 'w-11 h-11' : 'w-12 h-12'} flex items-center justify-center rounded-full
              transition-all duration-300
              ${isPlaying 
                ? 'bg-gold text-accent-foreground shadow-gold' 
                : 'bg-blush text-foreground hover:bg-blush-medium'
              }
            `}
            whileHover={!isTouch ? { scale: 1.1 } : undefined}
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
