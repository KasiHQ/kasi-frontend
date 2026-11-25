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
      className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto font-poppins selection:bg-[#DBF361] selection:text-[#141C17]"
    >
      {/* Asymmetric Split Editorial Header (not centered cookie-cutter H2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-12">
        <div className="lg:col-span-7">
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[46px] text-[#141C17] tracking-tight leading-[1.1]">
            See how Kasi runs your shop, start to finish.
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-sm sm:text-base text-[#141C17]/75 font-normal leading-relaxed">
            Two minutes, uncut: a buyer messages on WhatsApp, settles a price, pays via Paystack, and lands in your packing queue.
          </p>
        </div>
      </div>

      {/* Crisp Architectural Video Frame (no neon blur blobs) */}
      <div className="relative">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="relative rounded-2xl overflow-hidden bg-[#141C17] border border-[#141C17]/18 shadow-[0_8px_30px_rgba(20,28,23,0.12)] aspect-[16/9] flex items-center justify-center group"
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

          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#DBF361] text-[#141C17] flex items-center justify-center shadow-lg hover:scale-105 active:scale-97 transition-transform cursor-pointer z-20"
            >
              <Play size={32} weight="fill" className="ml-1 text-[#141C17]" />
            </button>
          )}

          {/* Custom Control Bar */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-200 z-30 ${
              showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              onClick={handleSeek}
              className="relative w-full h-3 flex items-center cursor-pointer group/timeline py-1 mb-2"
            >
              <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden relative group-hover/timeline:h-2 transition-all">
                <div
                  className="h-full bg-[#DBF361] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-2 sm:gap-3.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-9 h-9 rounded-lg bg-white/12 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
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
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Rewind 10s"
                >
                  <ArrowCounterClockwise size={18} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => skipTime(10)}
                  aria-label="Skip forward 10 seconds"
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Forward 10s"
                >
                  <ArrowClockwise size={18} weight="bold" />
                </button>

                <span className="font-mono text-xs sm:text-sm text-white/80 tracking-tight ml-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
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
                    className="w-14 sm:w-20 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#DBF361]"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
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

        <p className="mt-4 text-xs sm:text-sm text-[#141C17]/65 font-normal">
          This is the whole thing: a customer asks, Kasi recommends, they settle a price, pay, and the order moves to fulfilment. You did nothing.
        </p>
      </div>
    </section>
  );
}

export default DemoVideoSection;
