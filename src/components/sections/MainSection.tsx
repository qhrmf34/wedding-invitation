'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.4 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const lineExpand = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// Stagger letters for couple names
const letterVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const lettersContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className} variants={lettersContainer} initial="hidden" animate="visible">
      {text.split('').map((ch, i) => (
        <motion.span key={i} variants={letterVariants} style={{ display: 'inline-block' }}>
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

const MainSection = () => {
  const { invitation, date } = weddingConfig;

  return (
    <MainSectionContainer className={`wedding-container jwk-${watermarkId.slice(0, 8)}-main`}>
      {/* Ken Burns background */}
      <KenBurnsWrapper>
        <BackgroundImage
          src={weddingConfig.main.image}
          alt="웨딩 배경 이미지"
          fill
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </KenBurnsWrapper>

      {/* Dark gradient overlay */}
      <Overlay />

      {/* Light shimmer sweep */}
      <ShimmerOverlay />

      {/* Vignette */}
      <Vignette />

      <MainContent
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeSlideUp}>
          <EnglishTitle>Wedding Invitation</EnglishTitle>
        </motion.div>

        <motion.div variants={lineExpand} style={{ originX: 0.5 }}>
          <TitleDivider />
        </motion.div>

        <motion.div variants={fadeIn}>
          <CoupleNames>
            <GroomNameStyled as={SplitText} text={invitation.groom.name} />
            <motion.span
              style={{
                fontFamily: "'PlayfairDisplay', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
                color: 'rgba(196, 160, 122, 0.9)',
                lineHeight: 1,
                margin: '0 0.5rem',
                display: 'inline-block',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              &amp;
            </motion.span>
            <BrideNameStyled as={SplitText} text={invitation.bride.name} />
          </CoupleNames>
        </motion.div>

        <motion.div variants={fadeSlideUp}>
          <DateVenueWrapper>
            <DateText>{date.displayDate}</DateText>
            <DotSep>·</DotSep>
            <VenueText>{weddingConfig.main.venue}</VenueText>
          </DateVenueWrapper>
        </motion.div>
      </MainContent>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 2.4 }}
      >
        <ScrollText>scroll</ScrollText>
        <ScrollLine />
      </ScrollIndicator>

      <HiddenWatermark aria-hidden="true">{watermarkId}</HiddenWatermark>
    </MainSectionContainer>
  );
};

/* ─── Ken Burns zoom ─── */
const kenBurns = keyframes`
  0%   { transform: scale(1.0) translate(0, 0); }
  100% { transform: scale(1.12) translate(-1%, 1%); }
`;

const KenBurnsWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  animation: ${kenBurns} 18s ease-in-out forwards;
`;

const BackgroundImage = styled(Image)`
  z-index: 0;
`;

/* ─── Light shimmer ─── */
const shimmerMove = keyframes`
  0%   { transform: translateX(-120%) rotate(25deg); opacity: 0; }
  20%  { opacity: 0.18; }
  80%  { opacity: 0.18; }
  100% { transform: translateX(120%) rotate(25deg); opacity: 0; }
`;

const ShimmerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: 0;
    width: 40%;
    height: 200%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 245, 230, 0.25),
      transparent
    );
    animation: ${shimmerMove} 3.5s ease-in-out 0.8s forwards;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 8, 5, 0.38) 0%,
    rgba(10, 8, 5, 0.15) 38%,
    rgba(10, 8, 5, 0.55) 100%
  );
  z-index: 1;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.45) 100%
  );
`;

const MainSectionContainer = styled.section`
  position: relative;
  height: 100dvh;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #f5f0ea;
  overflow: hidden;
  background: #1a1510;

  @media (min-width: 768px) and (min-height: 780px) {
    aspect-ratio: 9 / 16;
    max-width: calc(100vh * 9 / 16);
    margin: 0 auto;
    border-radius: 0;
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.15);
  }
`;

const MainContent = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0 2rem;
`;

const EnglishTitle = styled.h1`
  font-family: 'PlayfairDisplay', 'Georgia', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.2rem, 4.5vw, 1.8rem);
  letter-spacing: 0.18em;
  color: rgba(245, 240, 234, 0.82);
  margin: 0 0 1.4rem 0;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
`;

const TitleDivider = styled.div`
  width: 3rem;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(196, 160, 122, 0.85),
    transparent
  );
  margin: 0 auto 1.8rem auto;
`;

const CoupleNames = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 2rem;
`;

const nameStyle = `
  font-family: 'MaruBuri', serif;
  font-weight: 300;
  font-size: clamp(1.7rem, 6.5vw, 2.6rem);
  letter-spacing: 0.14em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.35);
  display: inline-block;
`;

const GroomNameStyled = styled.span`${nameStyle}`;
const BrideNameStyled = styled.span`${nameStyle}`;

const DateVenueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const DateText = styled.p`
  font-family: 'MaruBuri', serif;
  font-weight: 300;
  font-size: clamp(0.72rem, 2.5vw, 0.9rem);
  letter-spacing: 0.15em;
  color: rgba(245, 240, 234, 0.78);
  margin: 0;
`;

const DotSep = styled.span`
  color: rgba(196, 160, 122, 0.6);
  font-size: 0.75rem;
`;

const VenueText = styled.p`
  font-family: 'MaruBuri', serif;
  font-weight: 300;
  font-size: clamp(0.72rem, 2.5vw, 0.9rem);
  letter-spacing: 0.1em;
  color: rgba(245, 240, 234, 0.6);
  margin: 0;
`;

/* ─── Scroll indicator ─── */
const scrollDrop = keyframes`
  0%   { transform: scaleY(0); transform-origin: top; opacity: 0.9; }
  50%  { transform: scaleY(1); transform-origin: top; opacity: 0.9; }
  51%  { transform: scaleY(1); transform-origin: bottom; opacity: 0.9; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ScrollText = styled.span`
  font-family: 'PlayfairDisplay', Georgia, serif;
  font-style: italic;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  color: rgba(196, 160, 122, 0.65);
  text-transform: lowercase;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 2.5rem;
  background: rgba(196, 160, 122, 0.7);
  animation: ${scrollDrop} 2.2s ease-in-out infinite;
`;

const HiddenWatermark = styled.span`
  position: absolute;
  opacity: 0.01;
  font-size: 1px;
  color: rgba(255, 255, 255, 0.01);
  pointer-events: none;
  user-select: none;
  z-index: -9999;
  bottom: 0;
  right: 0;
`;

export default MainSection;
