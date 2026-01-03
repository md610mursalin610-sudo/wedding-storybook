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
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className={`
            flex items-center gap-1.5 md:gap-2 bg-background/95 backdrop-blur-md
            rounded-full shadow-elegant border border-gold/30
            transition-all duration-300
            ${isExpanded ? 'px-2 py-1.5 md:px-4 md:py-2' : 'p-0'}
          `}
          style={{ position: 'relative' }}
          onMouseEnter={!isTouch ? () => setIsTrayHovered(true) : undefined}
          onMouseLeave={!isTouch ? () => setIsTrayHovered(false) : undefined}
        >
          {/* Controls tray - positioned above on mobile for better UX */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className={`
                  ${isSmall 
                    ? 'absolute bottom-full right-0 mb-2 flex-col bg-background/95 backdrop-blur-md rounded-2xl shadow-elegant border border-gold/30 p-3' 
                    : 'flex items-center gap-2'
                  }
                `}
                initial={{ opacity: 0, y: isSmall ? 10 : 0, scale: isSmall ? 0.9 : 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isSmall ? 10 : 0, scale: isSmall ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Now playing title */}
                <div className={`relative ${isSmall ? 'mb-3 w-full' : ''}`}>
                  <span
                    className={`
                      font-body text-foreground/80 cursor-pointer select-none block
                      ${isSmall ? 'text-sm text-center font-medium' : 'text-sm max-w-[180px] truncate'}
                    `}
                    onClick={() => setIsPlaylistOpen(v => !v)}
                    title={musicPlaylist[currentTrackIndex].title}
                  >
                    {musicPlaylist[currentTrackIndex].title}
                  </span>

                  {/* Playlist dropdown */}
                  <AnimatePresence>
                    {isPlaylistOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className={`
                          absolute bottom-full mb-2 bg-background rounded-xl shadow-elegant 
                          border border-gold/20 overflow-hidden z-[60]
                          ${isSmall ? 'left-0 right-0' : 'right-0 min-w-[220px]'}
                        `}
                        onMouseLeave={!isTouch ? () => setIsPlaylistOpen(false) : undefined}
                      >
                        <div className="max-h-48 md:max-h-64 overflow-auto">
                          {musicPlaylist.map((track, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectTrack(idx)}
                              aria-selected={idx === currentTrackIndex}
                              className={`
                                w-full text-left px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm font-body transition-colors
                                ${idx === currentTrackIndex 
                                  ? 'bg-gold/15 text-foreground border-l-2 border-gold' 
                                  : 'text-muted-foreground hover:bg-muted'
                                }
                              `}
                            >
                              {track.title}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Control buttons row */}
                <div className={`flex items-center justify-center gap-1 ${isSmall ? 'w-full' : ''}`}>
                  {/* Previous */}
                  <button
                    onClick={handlePrevious}
                    aria-label="Previous track"
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-gold/10 active:bg-gold/20 transition-colors"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Mute */}
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-gold/10 active:bg-gold/20 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Next */}
                  <button
                    onClick={handleNext}
                    aria-label="Next track"
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-gold/10 active:bg-gold/20 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className={`${isSmall ? 'w-full mt-2 px-1' : 'w-20'}`}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-gold"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--gold)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%)`
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main play/pause button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if (isTouch && !isExpanded) {
                setIsExpanded(true);
              } else {
                togglePlay();
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isTouch) {
                setIsExpanded(v => !v);
              }
            }}
            className={`
              relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full
              transition-all duration-300
              ${isPlaying 
                ? 'bg-gradient-to-br from-gold to-gold-dark text-accent-foreground shadow-gold' 
                : 'bg-gradient-to-br from-blush to-blush-medium text-foreground'
              }
            `}
            whileHover={!isTouch ? { scale: 1.08 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
            )}
            
            {/* Animated rings when playing */}
            {isPlaying && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold/50"
                  animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold/30"
                  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
                />
              </>
            )}

            {/* Tap indicator for mobile when collapsed */}
            {isTouch && !isExpanded && !isPlaying && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Close button for mobile expanded state */}
          {isTouch && isExpanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsExpanded(false)}
              className="absolute -top-2 -left-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm"
            >
              <span className="text-xs">✕</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
