import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSimpleX,
  CornersOut,
  CornersIn,
  ArrowCounterClockwise,
  ArrowClockwise,
} from '@phosphor-icons/react';
import { NewNav } from '../../Landing/components/home/NewNav';
import { GlobalFooter } from '../../../components/common/GlobalFooter';
const JourneyScene = React.lazy(() => import('../../Landing/components/journey/JourneyScene'));
import { HOW_IT_WORKS_COPY } from '../../../content/how-it-works';

export const HowItWorksPage = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Autoplay muted on scroll into view per spec 3.2
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-clip w-full relative">
      {/* Spec 01: Top Navigation */}
      <NewNav />

      {/* Spec 3.1: Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#141C17] tracking-tight leading-[1.1]">
          See a real order happen,{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#0D6E42]">start to finish.</span>
            <span
              className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[#DBF361] -rotate-1 rounded-xs -z-0"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#141C17]/80 font-light leading-relaxed">
          No slides. Watch Kasi take a customer from first message to paid and out for delivery, then try it yourself.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/try"
            className="px-6 py-3.5 rounded-full bg-[#0D6E42] text-[#DBF361] font-medium text-sm hover:bg-[#1C774E] transition-all shadow-md hover:shadow-lg"
          >
            Try the live demo
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-transparent text-[#141C17] border border-[#141C17]/20 font-medium text-sm hover:bg-[#141C17]/5 transition-all"
          >
            Book a walkthrough
          </Link>
        </div>
      </section>

      {/* Spec 3.2: Primary Demo Video */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-[1120px] mx-auto">
        <div className="relative">
          {/* Ambient lime glow behind video */}
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
              data-kasi="demo-primary"
              src="/video/Kasi Explainer Video.mp4"
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              playsInline
              muted={isMuted}
              preload="metadata"
            />

            {/* Play Button Overlay */}
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

            {/* Floating Custom Controllers */}
            <div
              className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 z-30 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Timeline Scrubber */}
              <div
                onClick={handleSeek}
                className="relative w-full h-3 flex items-center cursor-pointer py-1 mb-2 group/timeline"
              >
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/timeline:h-2 transition-all">
                  <div
                    className="h-full bg-gradient-to-r from-[#DBF361] to-[#25D366] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => skipTime(-10)}
                    aria-label="Skip back 10 seconds"
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  >
                    <ArrowCounterClockwise size={18} weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={() => skipTime(10)}
                    aria-label="Skip forward 10 seconds"
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
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
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <SpeakerSimpleX size={20} weight="bold" /> : <SpeakerHigh size={20} weight="bold" />}
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

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                  >
                    {isFullscreen ? <CornersIn size={20} weight="bold" /> : <CornersOut size={20} weight="bold" />}
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

      {/* Spec 3.4: The Order Journey (Signature Scroll-Driven Motion Piece) */}
      <React.Suspense fallback={<div className="h-[460vh] bg-[#0B0F0C]" />}>
        <JourneyScene variant="full" />
      </React.Suspense>

      {/* Spec 3.5: Close */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#141C17] tracking-tight">
          Seen enough? Go and chat it yourself.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/try"
            className="px-6 py-3.5 rounded-full bg-[#0D6E42] text-[#DBF361] font-medium text-sm hover:bg-[#1C774E] transition-all shadow-md hover:shadow-lg"
          >
            Chat the live demo
          </Link>
          <Link
            to="/get-started"
            className="px-6 py-3.5 rounded-full bg-[#DBF361] text-[#141C17] font-semibold text-sm hover:bg-[#c9e34a] transition-all shadow-md hover:shadow-lg"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* Spec 01: Global Footer */}
      <GlobalFooter />
    </div>
  );
};

export default HowItWorksPage;
