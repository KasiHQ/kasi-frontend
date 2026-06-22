import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { PRELAUNCH_WAITLIST_MODE } from "../../../config";

export const HeroSection = ({ onJoinWaitlistClick }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
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
        videoRef.current.play().catch(err => console.log("Play failed: ", err));
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

  const handleVideoOpen = () => {
    setIsVideoOpen(true);
    setShowControls(true);
  };

  const handleVideoClose = () => {
    setIsVideoOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  return (
    <section
      id="hero"
      className="w-full pt-[160px] pb-[80px] bg-white overflow-hidden relative"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {PRELAUNCH_WAITLIST_MODE && (
              <div className="space-y-4 pb-2 animate-in fade-in slide-in-from-top duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F263] border-[1.5px] border-black text-black text-[11px] font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_#000]">
                  Launching June 12, 2026
                </div>
                <div>
                  <CountdownTimer />
                </div>
              </div>
            )}

            {/* H1 headline (3 lines) */}
            <h1 className="text-4xl md:text-5.5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[#0A0A0A] font-bricolage select-none">
              <span className="block text-[#0A0A0A]">AI-Powered</span>
              <span className="block text-[#1A7A4A] mt-1">Direct Sales</span>
              <span className="block text-[#0A0A0A] mt-1">
                From DMs to Paid fast.
              </span>
            </h1>

            {/* Body text */}
            <p className="text-base md:text-lg text-grey-700 max-w-[480px] leading-relaxed font-sans font-medium">
              Simply connect your WhatsApp, Instagram, or Telegram. Kasi handles
              every customer inquiry, negotiates pricing, collects payment, and
              coordinates delivery — 24/7, automatically.
            </p>

            {/* CTA Row */}
            <div className="flex flex-row items-center gap-4 pt-2 font-sans select-none">
              {PRELAUNCH_WAITLIST_MODE ? (
                <button
                  onClick={onJoinWaitlistClick}
                  className="text-[15px] font-bold text-white bg-[#1A7A4A] hover:bg-[#15603A] px-6 py-3.5 rounded-full active:scale-95 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.15)] flex items-center gap-1 cursor-pointer border border-black"
                >
                  Join Beta Waitlist →
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="text-[15px] font-bold text-white bg-black px-6 py-3.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.15)] flex items-center gap-1 cursor-pointer"
                >
                  Get Kasi for Free →
                </Link>
              )}
              <button
                onClick={handleVideoOpen}
                className="text-[15px] font-bold text-black border-[1.5px] border-black bg-white px-6 py-3.5 rounded-full hover:bg-bg-subtle active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={14} className="fill-current text-black" />
                Watch Demo Video
              </button>
            </div>

            {/* Trust Stats Row */}
            <div className="flex items-center gap-8 pt-8 max-w-lg select-none border-t-[1.5px] border-[#E5E5E5]">
              {/* Stat 1 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  10×
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Faster Replies
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-[1.5px] bg-[#E5E5E5]" />

              {/* Stat 2 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  99%
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Direct Paid
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-[1.5px] bg-[#E5E5E5]" />

              {/* Stat 3 */}
              <div className="space-y-1 text-left">
                <div className="text-[32px] font-black text-[#0A0A0A] leading-none font-bricolage">
                  24/7
                </div>
                <div className="text-[12px] font-bold tracking-wider text-grey-500 uppercase font-sans">
                  Runs 24/7
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — 50% (lg:col-span-6) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-10 lg:mt-0 select-none">
            {/* Green Panel wrapper */}
            <div className="relative w-full max-w-[520px] h-[560px] bg-[#1A7A4A] rounded-[24px] p-8 flex items-center justify-center overflow-visible shadow-[8px_8px_0px_#0A0A0A] border-[1.5px] border-black">
              {/* White dot grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none rounded-[24px]" />



              {/* Browser Mockup */}
              <div className="relative w-full bg-white rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_#0A0A0A] overflow-hidden flex flex-col transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-10">
                {/* Browser Header */}
                <div className="bg-[#F5F5F0] border-b-[2px] border-black px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/35" />
                  </div>
                  <div className="bg-white border border-black rounded-md px-4 py-0.5 text-[9px] font-bold text-grey-500 font-sans tracking-wide">
                    usekasi.com/dashboard
                  </div>
                  <div className="w-6 h-6" /> {/* Spacer */}
                </div>
                {/* Image */}
                <img 
                  src="/images/hero-dashboard-desktop.png" 
                  alt="Kasi AI Dashboard Overview" 
                  className="w-full h-auto object-cover select-none" 
                />
              </div>

              {/* Mobile Phone Mockup Overlay */}
              <div className="absolute -bottom-10 -right-8 w-[160px] h-[300px] bg-white rounded-[28px] border-[3px] border-black shadow-[5px_5px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/images/hero-dashboard-mobile.jpg" 
                  alt="Kasi AI Dashboard Mobile View" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>

              {/* FLOATING PROPS */}

              {/* 1. Gold Naira Coin — top-left of panel, partly overlapping edge */}
              <div
                className="absolute -top-6 -left-6 z-20 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="30"
                    cy="33"
                    rx="24"
                    ry="19"
                    fill="#D97706"
                    stroke="#0A0A0A"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="30"
                    cy="29"
                    rx="24"
                    ry="19"
                    fill="#FBBF24"
                    stroke="#0A0A0A"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="30"
                    cy="29"
                    rx="18"
                    ry="13"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="30"
                    y="35"
                    fill="#0A0A0A"
                    fontSize="20"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="Bricolage Grotesque, sans-serif"
                  >
                    ₦
                  </text>
                </svg>
              </div>

              {/* 2. Chat bubble with "SALE CONFIRMED ₦2,100" — bottom-left, below panel */}
              <div className="absolute -bottom-6 -left-8 bg-white border-[1.5px] border-black rounded-[16px] p-3 shadow-[4px_4px_0px_#0A0A0A] flex items-center gap-3 z-20 transform -rotate-[3deg]">
                <div className="w-8 h-8 rounded-lg bg-[#D4F263] border border-black flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-black text-grey-500 uppercase tracking-widest leading-none">
                    Sale Confirmed
                  </div>
                  <div className="text-xs font-black text-black leading-none mt-1 font-bricolage">
                    ₦2,100.00
                  </div>
                </div>
              </div>

              {/* 3. Green checkmark badge — top-right of panel */}
              <div className="absolute -top-4 -right-4 bg-[#D4F263] border-[1.5px] border-black rounded-full w-12 h-12 flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A] z-20">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* 4. Receipt paper — top-right corner, rotated 15deg */}
              <div className="absolute -top-12 right-12 bg-white border-[1.5px] border-black p-2.5 w-24 rounded-lg shadow-[3px_3px_0px_#0A0A0A] z-10 transform rotate-[15deg] text-black text-[7.5px] font-mono leading-tight text-left">
                <div className="text-center font-bold border-b border-dashed border-black pb-1 mb-1">
                  RECEIPT
                </div>
                <div className="flex justify-between">
                  <span>Fried Rice</span>
                  <span>Suya</span>
                  <span>x2</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Total</span>
                  <span>₦8,000</span>
                </div>
                <div className="text-center bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A] py-0.5 rounded-[4px] font-bold text-[6.5px] uppercase">
                  PAID
                </div>
              </div>

              {/* 5. "100% Autonomous" badge floating top-right of phone */}
              <div className="absolute top-[80px] right-2 bg-[#0A0A0A] text-white border-[1.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#D4F263] z-20 text-[8.5px] font-black uppercase tracking-wider transform rotate-[6deg] hover:scale-105 transition-transform duration-200">
                100% Autonomous
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/85 z-[250] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleVideoClose}
        >
          <div
            className="relative w-full max-w-[800px] bg-black rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_#000] overflow-hidden aspect-video animate-in zoom-in-95 duration-200 group"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Close Button */}
            <button
              onClick={handleVideoClose}
              className="absolute top-3 right-3 text-white bg-black/70 hover:bg-black border border-white/25 hover:border-white/50 p-2 rounded-full transition-all duration-150 cursor-pointer z-50 hover:scale-105"
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            
            {/* Video Player */}
            <video
              ref={videoRef}
              src="/video/Kasi Explainer Video.mp4"
              autoPlay
              playsInline
              onClick={togglePlay}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              className="w-full h-full object-contain cursor-pointer"
            />

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
      )}
    </section>
  );
};
