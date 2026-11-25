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
import { HowItWorksTeaser } from '../../Landing/components/home/HowItWorksTeaser';
import { GlobalFooter } from '../../../components/common/GlobalFooter';
import { HOW_IT_WORKS_COPY } from '../../../content/how-it-works';

const JourneyScene = React.lazy(() => import('../../Landing/components/journey/JourneyScene'));

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

  const heroCopy = HOW_IT_WORKS_COPY['3.1'];
  const videoCopy = HOW_IT_WORKS_COPY['3.2'];
  const closeCopy = HOW_IT_WORKS_COPY['3.5'];

  useEffect(() => {
    document.title = 'How It Works | Kasi';
  }, []);

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
      <NewNav />

      {/* Spec 3.1: Asymmetric Split Hero (not centered cookie-cutter) */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[58px] text-[#141C17] tracking-tight leading-[1.08]">
              {heroCopy.h1}
            </h1>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#141C17]/80 font-normal leading-relaxed">
              {heroCopy.sub}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={heroCopy.hrefPrimary}
                className="px-6 py-3 rounded-xl bg-[#0D6E42] text-white font-semibold text-sm hover:bg-[#0A5835] transition-colors"
              >
                {heroCopy.ctaPrimary}
              </Link>
              <Link
                to={heroCopy.hrefSecondary}
                className="px-6 py-3 rounded-xl bg-white text-[#141C17] border border-[#141C17]/18 font-semibold text-sm hover:border-[#141C17]/40 transition-colors"
              >
                {heroCopy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spec 3.2: Primary Demo Video (zero blur blobs) */}
      <section className="pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="relative rounded-2xl overflow-hidden bg-[#141C17] border border-[#141C17]/18 shadow-[0_8px_30px_rgba(20,28,23,0.12)] aspect-[16/9] flex items-center justify-center group"
        >
          <video
            ref={videoRef}
            data-kasi="demo-primary"
            src="/video/Kasi How it works video.mp4"
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            playsInline
            muted={isMuted}
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

          <div
            className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-200 z-30 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              onClick={handleSeek}
              className="relative w-full h-3 flex items-center cursor-pointer py-1 mb-2 group/timeline"
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
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-9 h-9 rounded-lg bg-white/12 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => skipTime(-10)}
                  aria-label="Skip back 10 seconds"
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowCounterClockwise size={18} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => skipTime(10)}
                  aria-label="Skip forward 10 seconds"
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
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
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
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
                    className="w-14 sm:w-20 h-1 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#DBF361]"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  {isFullscreen ? <CornersIn size={20} weight="bold" /> : <CornersOut size={20} weight="bold" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-base text-[#141C17]/70 font-normal max-w-3xl leading-relaxed">
          {videoCopy.caption}
        </p>
      </section>

      {/* 4-Step Connected Setup Band */}
      <HowItWorksTeaser showCta={false} />

      {/* Spec 3.4: 6-Stage Order Journey */}
      <React.Suspense fallback={<div className="h-[460vh] bg-[#F6F8F3]" />}>
        <JourneyScene variant="full" />
      </React.Suspense>

      {/* Spec 3.5: Close */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="rounded-2xl bg-[#141C17] text-white p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
              {closeCopy.heading}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-3.5">
            <Link
              to={closeCopy.hrefPrimary}
              className="px-7 py-3.5 rounded-xl bg-[#DBF361] text-[#141C17] font-semibold text-sm hover:brightness-98 transition-all"
            >
              {closeCopy.ctaPrimary}
            </Link>
            <Link
              to={closeCopy.hrefSecondary}
              className="px-7 py-3.5 rounded-xl bg-transparent text-white border border-white/25 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {closeCopy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};

export default HowItWorksPage;
