'use client';

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface MusicPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayer = ({ audioRef }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true); // 인트로에서 재생 시작 후 표시

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // 재생 실패
      }
    }
  };

  // 오디오 상태와 동기화
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioRef]);

  return (
    <PlayerButton onClick={togglePlay} $isPlaying={isPlaying} aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}>
      {isPlaying ? (
        <PauseIcon><span /><span /></PauseIcon>
      ) : (
        <PlayIcon>
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M8 5v14l11-7z" />
          </svg>
        </PlayIcon>
      )}
      {isPlaying && <PulseRing />}
    </PlayerButton>
  );
};

const pulseAnim = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0; }
`;

const PlayerButton = styled.button<{ $isPlaying: boolean }>`
  position: fixed;
  bottom: 2rem;
  left: max(1.5rem, calc(50vw - 240px + 1.5rem));
  z-index: 100;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: 1px solid rgba(196, 160, 122, 0.5);
  background: rgba(250, 248, 245, 0.95);
  backdrop-filter: blur(8px);
  color: var(--accent-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const PlayIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1px;
`;

const PauseIcon = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
  span {
    width: 3px;
    height: 12px;
    background: var(--accent-dark);
    border-radius: 2px;
  }
`;

const PulseRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--accent);
  animation: ${pulseAnim} 2s ease-out infinite;
  pointer-events: none;
`;

export default MusicPlayer;
