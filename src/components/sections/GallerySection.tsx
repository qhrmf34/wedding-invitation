'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { weddingConfig } from '../../config/wedding-config';

interface GallerySectionProps {
  bgColor?: 'white' | 'beige';
}

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const GallerySection = ({ bgColor = 'white' }: GallerySectionProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: '-60px' });
  const galleryLayout = weddingConfig.gallery.layout || 'grid';

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        setImages(d.images?.length ? d.images : weddingConfig.gallery.images);
      })
      .catch(() => setImages(weddingConfig.gallery.images))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!expandedImage) return;
    window.history.pushState({ expandedImage: true }, '');
    const handlePop = () => {
      setExpandedImage(null);
      document.body.style.overflow = '';
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [expandedImage]);

  useEffect(() => {
    if (!expandedImage || !overlayRef.current) return;
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        dx > 0 ? goToPrev() : goToNext();
      }
    };
    const el = overlayRef.current;
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [expandedImage, expandedIndex]);

  useEffect(() => {
    if (!expandedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeExpanded();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expandedImage, expandedIndex]);

  const openImage = (img: string, idx: number) => {
    setExpandedImage(img); setExpandedIndex(idx); setIsImgLoading(true);
    document.body.style.overflow = 'hidden';
  };
  const goToPrev = () => {
    if (expandedIndex > 0) { setExpandedIndex(expandedIndex - 1); setExpandedImage(images[expandedIndex - 1]); setIsImgLoading(true); }
  };
  const goToNext = () => {
    if (expandedIndex < images.length - 1) { setExpandedIndex(expandedIndex + 1); setExpandedImage(images[expandedIndex + 1]); setIsImgLoading(true); }
  };
  const closeExpanded = () => {
    setExpandedImage(null); setExpandedIndex(-1); setIsImgLoading(false);
    document.body.style.overflow = '';
    if (window.history.state?.expandedImage) window.history.back();
  };

  return (
    <GallerySectionContainer $bgColor={bgColor}>
      <Inner>
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <SectionLabel>Gallery</SectionLabel>
          <Divider />
        </motion.div>

        {isLoading ? (
          <LoadingText>사진을 불러오는 중...</LoadingText>
        ) : galleryLayout === 'grid' ? (
          <GalleryGrid>
            {images.map((img, i) => (
              <GridItem
                key={i}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 3) * 0.08 }}
                onClick={() => openImage(img, i)}
              >
                <GridImageWrap>
                  <Image
                    src={img}
                    alt={`웨딩 사진 ${i + 1}`}
                    fill
                    sizes="(max-width: 480px) 33vw, 160px"
                    quality={80}
                    priority={i < 6}
                    style={{ objectFit: 'cover' }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </GridImageWrap>
              </GridItem>
            ))}
          </GalleryGrid>
        ) : (
          <ScrollWrapper>
            <ArrowBtn onClick={() => scrollContainerRef.current?.scrollBy({ left: -266, behavior: 'smooth' })} aria-label="이전">
              <ArrowLeftIcon />
            </ArrowBtn>
            <ScrollContainer ref={scrollContainerRef}>
              {images.map((img, i) => (
                <ScrollCard key={i} onClick={() => openImage(img, i)}>
                  <ScrollImageWrap>
                    <Image
                      src={img}
                      alt={`웨딩 사진 ${i + 1}`}
                      fill
                      sizes="250px"
                      quality={80}
                      style={{ objectFit: 'cover' }}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </ScrollImageWrap>
                </ScrollCard>
              ))}
            </ScrollContainer>
            <ArrowBtn onClick={() => scrollContainerRef.current?.scrollBy({ left: 266, behavior: 'smooth' })} aria-label="다음">
              <ArrowRightIcon />
            </ArrowBtn>
          </ScrollWrapper>
        )}
      </Inner>

      {expandedImage && (
        <Lightbox ref={overlayRef} onClick={closeExpanded}>
          <LightboxInner onClick={(e) => e.stopPropagation()}>
            {expandedIndex > 0 && (
              <LightboxArrow $side="left" onClick={goToPrev}><ArrowLeftIcon /></LightboxArrow>
            )}
            <LightboxImgWrap $loading={isImgLoading}>
              <Image
                src={expandedImage}
                alt="확대 사진"
                fill
                sizes="90vw"
                quality={90}
                style={{ objectFit: 'contain' }}
                draggable={false}
                onLoad={() => setIsImgLoading(false)}
                onError={() => setIsImgLoading(false)}
                onContextMenu={(e) => e.preventDefault()}
              />
            </LightboxImgWrap>
            {expandedIndex < images.length - 1 && (
              <LightboxArrow $side="right" onClick={goToNext}><ArrowRightIcon /></LightboxArrow>
            )}
            <CloseBtn onClick={closeExpanded} aria-label="닫기">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </CloseBtn>
            <Counter>{expandedIndex + 1} / {images.length}</Counter>
          </LightboxInner>
        </Lightbox>
      )}
    </GallerySectionContainer>
  );
};

const GallerySectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: var(--section-padding);
  background-color: ${(p) => (p.$bgColor === 'beige' ? 'var(--bg-secondary)' : 'var(--bg-white)')};
`;

const Inner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  text-align: center;
`;

const SectionLabel = styled.p`
  font-family: 'PlayfairDisplay', 'Georgia', serif;
  font-style: italic;
  font-size: 1.1rem;
  color: var(--accent);
  letter-spacing: 0.08em;
  margin: 0 0 1.2rem 0;
`;

const Divider = styled.div`
  width: 2.5rem;
  height: 1px;
  background: var(--border);
  margin: 0 auto 2rem auto;
`;

const LoadingText = styled.p`
  font-size: 0.85rem;
  color: var(--text-light);
  padding: 2rem 0;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
`;

const GridItem = styled.div`
  cursor: pointer;
  overflow: hidden;
  border-radius: 4px;

  &:hover img {
    transform: scale(1.04);
  }
`;

const GridImageWrap = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;

  img {
    transition: transform 0.4s ease;
  }
`;

const ScrollWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 0.75rem;
  padding: 0.5rem 0;
  padding-left: calc(50% - 125px);
  padding-right: calc(50% - 125px);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ScrollCard = styled.div`
  flex: 0 0 250px;
  scroll-snap-align: center;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover img {
    transform: scale(1.04);
  }
`;

const ScrollImageWrap = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  overflow: hidden;
  img { transition: transform 0.4s ease; }
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: rgba(250, 248, 245, 0.9);
  color: var(--text-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);

  &:first-child { left: -0.75rem; }
  &:last-child { right: -0.75rem; }

  &:hover {
    background: var(--bg-white);
    border-color: var(--accent);
    color: var(--accent-dark);
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 12, 10, 0.93);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxInner = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImgWrap = styled.div<{ $loading: boolean }>`
  position: relative;
  width: 90vw;
  height: 90vh;
  opacity: ${(p) => (p.$loading ? 0.5 : 1)};
  transition: opacity 0.3s;
`;

const LightboxArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  ${(p) => (p.$side === 'left' ? 'left: 1rem;' : 'right: 1rem;')}
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.15); }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.15); }
`;

const Counter = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
`;

export default GallerySection;
