'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { weddingConfig } from '../config/wedding-config';

interface IntroOverlayProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onEnter: () => void;
}

const IntroOverlay = ({ audioRef, onEnter }: IntroOverlayProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = async () => {
    // 오디오 재생 시도 (사용자 인터랙션 직후이므로 허용됨)
    const audio = audioRef.current;
    if (audio && weddingConfig.music.enabled) {
      audio.loop = true;
      audio.volume = 0.4;
      try {
        await audio.play();
      } catch {
        // 재생 실패해도 진행
      }
    }
    setIsExiting(true);
    setTimeout(onEnter, 800);
  };

  return (
    <Overlay $exiting={isExiting} onClick={handleEnter}>
      <Content>
        <EnglishTitle>Wedding Invitation</EnglishTitle>
        <TitleLine />
        <CoupleNames>
          {weddingConfig.invitation.groom.name}
          <Amp>&nbsp;&amp;&nbsp;</Amp>
          {weddingConfig.invitation.bride.name}
        </CoupleNames>
        <DateText>{weddingConfig.date.displayDate}</DateText>
        <EnterBtn>
          <EnterBtnInner>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            열어보기
          </EnterBtnInner>
        </EnterBtn>
        <HintText>화면을 터치하면 열립니다</HintText>
      </Content>
    </Overlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.15); }
`;

const Overlay = styled.div<{ $exiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #1a1510;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: ${({ $exiting }) => ($exiting ? fadeOut : 'none')} 0.8s ease forwards;
`;

const Content = styled.div`
  text-align: center;
  color: #f0e8dc;
  padding: 2rem;
  animation: ${fadeIn} 1.2s ease 0.3s both;
`;

const EnglishTitle = styled.p`
  font-family: 'PlayfairDisplay', Georgia, serif;
  font-style: italic;
  font-size: clamp(1rem, 4vw, 1.4rem);
  letter-spacing: 0.15em;
  color: rgba(196, 160, 122, 0.85);
  margin: 0 0 1.2rem 0;
`;

const TitleLine = styled.div`
  width: 2.5rem;
  height: 1px;
  background: rgba(196, 160, 122, 0.5);
  margin: 0 auto 1.8rem auto;
`;

const CoupleNames = styled.h1`
  font-family: 'MaruBuri', serif;
  font-weight: 300;
  font-size: clamp(1.5rem, 6vw, 2.2rem);
  letter-spacing: 0.12em;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
`;

const Amp = styled.span`
  font-family: 'PlayfairDisplay', Georgia, serif;
  font-style: italic;
  color: rgba(196, 160, 122, 0.8);
  font-size: 0.85em;
`;

const DateText = styled.p`
  font-size: clamp(0.72rem, 2.5vw, 0.9rem);
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(240, 232, 220, 0.6);
  margin: 0 0 3rem 0;
`;

const EnterBtn = styled.div`
  display: inline-block;
  margin-bottom: 1.5rem;
`;

const EnterBtnInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.6rem;
  border: 1px solid rgba(196, 160, 122, 0.5);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(196, 160, 122, 0.9);
  transition: all 0.3s;

  ${EnterBtn}:hover & {
    border-color: rgba(196, 160, 122, 0.9);
    color: rgba(196, 160, 122, 1);
    background: rgba(196, 160, 122, 0.08);
  }
`;

const HintText = styled.p`
  font-size: 0.7rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(240, 232, 220, 0.3);
  margin: 0;
  animation: ${pulseDot} 2.5s ease-in-out infinite;
`;

export default IntroOverlay;
