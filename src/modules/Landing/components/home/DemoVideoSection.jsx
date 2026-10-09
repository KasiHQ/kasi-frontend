import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSimpleX,
  CornersOut,
  CornersIn,
  ArrowCounterClockwise,
  ArrowClockwise,
} from "@phosphor-icons/react";

export function DemoVideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="demo-video"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins relative selection:bg-[#DBF361] selection:text-[#141C17]"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-[#141C17] tracking-tight leading-[1.12]">
          See a real order happen,{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#0D6E42]">start to finish.</span>
            <span
              className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-3.5 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
              aria-hidden="true"
            />
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#141C17]/75 font-light leading-relaxed">
          No slides. Watch Kasi take a customer from first message to paid and out for delivery.
        </p>
      </div>

      {/* World-Class Video Player Chassis */}
      <div className="relative max-w-[1060px] mx-auto">
        {/* Ambient Lime Glow behind player */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#DBF361]/25 blur-[120px] rounded-full -z-10 pointer-events-none"
          aria-hidden="true"
        />

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#141C17] border border-[#141C17]/15 shadow-2xl aspect-[16/9] flex items-center justify-center group"
        >
          <video
            ref={videoRef}
            src="/video/Kasi Explainer Video.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            playsInline
            preload="metadata"
          />

          {/* Large Floating Center Play Button (visible when paused) */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0D6E42] text-[#DBF361] flex items-center justify-center shadow-2xl hover:scale-108 active:scale-95 transition-all cursor-pointer z-20 border-2 border-[#DBF361]/30 backdrop-blur-xs"
            >
              <Play size={36} weight="fill" className="ml-1 text-[#DBF361]" />
            </button>
          )}

          {/* Floating World-Class Custom Control Bar */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-30 ${
              showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Interactive Timeline Scrubber */}
            <div
              onClick={handleSeek}
              className="relative w-full h-3 flex items-center cursor-pointer group/timeline py-1 mb-2"
            >
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/timeline:h-2 transition-all">
                <div
                  className="h-full bg-gradient-to-r from-[#DBF361] to-[#25D366] rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md border border-black/20 -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 transition-opacity"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between gap-4 text-white">
              {/* Left Group */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause size={18} weight="fill" />
                  ) : (
                    <Play size={18} weight="fill" className="ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => skipTime(-10)}
                  aria-label="Skip back 10 seconds"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Rewind 10s"
                >
                  <ArrowCounterClockwise size={18} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => skipTime(10)}
                  aria-label="Skip forward 10 seconds"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Forward 10s"
                >
                  <ArrowClockwise size={18} weight="bold" />
                </button>

                {/* Time Display */}
                <span className="font-mono text-xs sm:text-sm text-white/80 tracking-tight ml-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Group */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Volume & Mute */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <SpeakerSimpleX size={20} weight="bold" />
                    ) : (
                      <SpeakerHigh size={20} weight="bold" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume slider"
                    className="w-14 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#DBF361]"
                  />
                </div>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  {isFullscreen ? (
                    <CornersIn size={20} weight="bold" />
                  ) : (
                    <CornersOut size={20} weight="bold" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Caption under video from Spec 3.2 */}
        <p className="mt-5 text-center text-sm sm:text-base text-[#141C17]/70 font-light max-w-2xl mx-auto leading-relaxed">
          This is the whole thing: a customer asks, Kasi recommends, they settle a price, pay, and the order moves to fulfilment. You did nothing.
        </p>
      </div>
    </section>
  );
}

export default DemoVideoSection;
