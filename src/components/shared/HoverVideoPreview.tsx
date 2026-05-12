'use client';

/**
 * HoverVideoPreview
 *
 * Desktop: starts muted. On mouse-enter → unmutes + plays.
 *          On mouse-leave → mutes (and pauses if pauseOnLeave=true).
 * Mobile/touch: hover events don't fire; audio button is the only toggle.
 *
 * Autoplay-safety: if the browser blocks unmuted playback, falls back to
 * muted play silently (no thrown console errors).
 */

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  src: string;
  poster?: string;
  /** Applied to the outer wrapper div — use for sizing (height, width, etc.) */
  style?: React.CSSProperties;
  className?: string;
  loop?: boolean;
  /**
   * If true the video starts playing immediately (muted) like autoPlay.
   * On hover it unmutes; on leave it mutes but keeps playing.
   * If false the video is static until hovered, then plays+unmutes;
   * on leave it pauses and resets.
   */
  autoPlay?: boolean;
  /** Show the VolumeX/Volume2 overlay button (default true). */
  showAudioButton?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  objectFit?: 'cover' | 'contain';
}

export default function HoverVideoPreview({
  src,
  poster,
  style,
  className,
  loop = true,
  autoPlay = false,
  showAudioButton = true,
  onClick,
  objectFit = 'cover',
}: Props) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function onMouseEnter() {
    const vid = videoRef.current;
    if (!vid) return;
    // Attempt unmuted play
    vid.muted = false;
    setMuted(false);
    vid.play().catch(() => {
      // Browser blocked unmuted play — silently fall back to muted
      if (!videoRef.current) return;
      videoRef.current.muted = true;
      setMuted(true);
      videoRef.current.play().catch(() => {});
    });
  }

  function onMouseLeave() {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    setMuted(true);
    if (!autoPlay) {
      vid.pause();
      vid.currentTime = 0;
    }
    // If autoPlay, keep playing muted (matches existing autoPlay card behaviour)
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const vid = videoRef.current;
    if (!vid) return;
    const next = !muted;
    vid.muted = next;
    setMuted(next);
    if (!vid.paused) return; // already playing
    vid.play().catch(() => {
      vid.muted = true;
      setMuted(true);
    });
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', display: 'block', ...style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        style={{ width: '100%', height: '100%', objectFit, display: 'block' }}
      />

      {showAudioButton && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          {muted
            ? <VolumeX size={13} color="var(--text-faint)" />
            : <Volume2 size={13} color="#fff" />
          }
        </button>
      )}
    </div>
  );
}
