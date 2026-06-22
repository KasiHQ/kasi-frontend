import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export const ExplainerVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

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
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => console.log("Play failed: ", err));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  // Custom global event listener to handle play from hero CTA trigger
  useEffect(() => {
    const handleGlobalPlay = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().catch((err) => console.log("Global play failed: ", err));
        setIsPlaying(true);
      }
    };

    window.addEventListener("play-explainer-video", handleGlobalPlay);
    return () => {
      window.removeEventListener("play-explainer-video", handleGlobalPlay);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <section
      id="explainer-video-section"
      className="w-full py-20 bg-[#F5F5F0] border-b-[1.5px] border-black text-center relative select-none"
    >
      {/* Neo-brutalist white grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-12 text-center space-y-4 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F263] border-[1.5px] border-black text-black text-[11px] font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_#000]">
            Kasi in Action
          </div>
          <h2 className="text-3xl md:text-4.5xl font-black font-bricolage tracking-tight text-[#0A0A0A] leading-tight">
            See how Kasi automates your business
          </h2>
          <p className="text-sm md:text-base text-grey-700 font-semibold leading-relaxed">
            Watch the 1-minute walk-through to see how Kasi interacts with customers, handles orders, and reconciles payments on autopilot.
          </p>
        </div>

        {/* Video Player Box */}
        <div className="max-w-[800px] mx-auto relative bg-black rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_#0A0A0A] overflow-hidden aspect-video group"
             onMouseMove={handleMouseMove}
             onMouseLeave={() => isPlaying && setShowControls(false)}>
          
          {/* Autoplay Video Element */}
          <video
            ref={videoRef}
            src="/video/Kasi Explainer Video.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Prominent Floating "Click to Unmute" Overlay */}
          {isMuted && (
            <button
              onClick={toggleMute}
              className="absolute inset-0 m-auto w-40 h-12 bg-[#1A7A4A] hover:bg-[#15603A] text-white font-bold rounded-full border-[1.5px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition-all duration-150 scale-100 hover:scale-105 active:scale-95 cursor-pointer z-20 animate-pulse font-sans"
              style={{ animationDuration: "2s" }}
            >
              <VolumeX size={18} />
              <span>Unmute Sound</span>
            </button>
          )}

          {/* Custom Controls Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Progress Bar / Seek Slider */}
            <div className="flex items-center w-full">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#1A7A4A] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #1A7A4A 0%, #1A7A4A ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
            </div>

            {/* Controls Buttons Row */}
            <div className="flex items-center justify-between text-white select-none">
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="hover:text-[#1A7A4A] transition-colors cursor-pointer p-1 rounded-md focus:outline-none"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={20} className="fill-current text-white hover:text-[#1A7A4A]" />
                  ) : (
                    <Play size={20} className="fill-current text-white hover:text-[#1A7A4A]" />
                  )}
                </button>

                {/* Volume Controls */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="hover:text-[#1A7A4A] transition-colors cursor-pointer p-1 rounded-md focus:outline-none"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 overflow-hidden group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/25 rounded appearance-none cursor-pointer accent-[#1A7A4A]"
                  />
                </div>

                {/* Time display */}
                <span className="text-xs font-mono font-medium tracking-tight">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3">
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-[#1A7A4A] transition-colors cursor-pointer p-1 rounded-md focus:outline-none"
                  title="Fullscreen"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
