'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

declare global {
  interface Window { naver: any; }
}

interface VenueSectionProps {
  bgColor?: 'white' | 'beige';
}

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

const formatLines = (text: string) =>
  text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
  ));

const VenueSection = ({ bgColor = 'white' }: VenueSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [expandedShuttle, setExpandedShuttle] = useState<'groom' | 'bride' | null>(null);

  useEffect(() => {
    if (window.naver?.maps) { setMapLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
    setTimeout(() => {
      if (document.querySelector('div[style*="z-index: 100000000"]')) setMapError(true);
    }, 3000);
    return () => { if (mapRef.current) mapRef.current.innerHTML = ''; };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapError) return;
    try {
      const loc = new window.naver.maps.LatLng(
        weddingConfig.venue.coordinates.latitude,
        weddingConfig.venue.coordinates.longitude
      );
      const map = new window.naver.maps.Map(mapRef.current, {
        center: loc, zoom: parseInt(weddingConfig.venue.mapZoom, 10) || 15,
        zoomControl: true,
        zoomControlOptions: { position: window.naver.maps.Position.RIGHT_TOP },
      });
      const marker = new window.naver.maps.Marker({ position: loc, map });
      const info = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;font-family:sans-serif"><strong>${weddingConfig.venue.name}</strong></div>`,
      });
      info.open(map, marker);
    } catch { setMapError(true); }
  }, [mapLoaded, mapError]);

  const openNaver = () => window.open(
    `https://map.naver.com/p/directions/-/-/-/walk/place/${weddingConfig.venue.placeId}?c=${weddingConfig.venue.mapZoom},0,0,0,dh`, '_blank'
  );
  const openKakao = () => {
    const { latitude: lat, longitude: lng } = weddingConfig.venue.coordinates;
    window.open(`https://map.kakao.com/link/to/${encodeURIComponent(weddingConfig.venue.name)},${lat},${lng}`, '_blank');
  };
  const openTmap = () => {
    const { latitude: lat, longitude: lng } = weddingConfig.venue.coordinates;
    window.location.href = `tmap://route?goalname=${encodeURIComponent(weddingConfig.venue.name)}&goaly=${lat}&goalx=${lng}`;
    setTimeout(() => { if (!document.hidden) window.location.href = 'https://tmap.co.kr'; }, 1000);
  };

  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Location</SectionLabel>
          <Divider />
        </FadeUp>

        <FadeUp delay={0.1}>
          <VenueName>{weddingConfig.venue.name}</VenueName>
          <VenueAddress>{formatLines(weddingConfig.venue.address)}</VenueAddress>
          <VenueTel href={`tel:${weddingConfig.venue.tel}`}>{weddingConfig.venue.tel}</VenueTel>
        </FadeUp>

        <FadeUp delay={0.2}>
          {mapError ? (
            <MapFallback>
              <MapFallbackText>{weddingConfig.venue.name}</MapFallbackText>
              <MapFallbackSub>{weddingConfig.venue.address}</MapFallbackSub>
            </MapFallback>
          ) : (
            <MapContainer ref={mapRef}>
              {!mapLoaded && <MapLoading>지도 불러오는 중...</MapLoading>}
            </MapContainer>
          )}
        </FadeUp>

        <FadeUp delay={0.25}>
          <NavBtns>
            <NavBtn onClick={openNaver}>네이버 지도</NavBtn>
            <NavBtn onClick={openKakao}>카카오맵</NavBtn>
            <NavBtn onClick={openTmap}>TMAP</NavBtn>
          </NavBtns>
        </FadeUp>

        <FadeUp delay={0.3}>
          <InfoCard>
            <CardTitle>대중교통</CardTitle>
            <InfoRow>
              <InfoLabel>지하철</InfoLabel>
              <InfoText>{weddingConfig.venue.transportation.subway}</InfoText>
            </InfoRow>
            <InfoRow>
              <InfoLabel>버스</InfoLabel>
              <InfoText>{formatLines(weddingConfig.venue.transportation.bus)}</InfoText>
            </InfoRow>
          </InfoCard>

          <InfoCard>
            <CardTitle>주차 안내</CardTitle>
            <InfoText>{weddingConfig.venue.parking}</InfoText>
          </InfoCard>
        </FadeUp>

        {weddingConfig.venue.groomShuttle && (
          <FadeUp delay={0.35}>
            <AccordionCard>
              <AccordionHeader onClick={() => setExpandedShuttle(expandedShuttle === 'groom' ? null : 'groom')}>
                <CardTitle style={{ margin: 0 }}>신랑측 배차 안내</CardTitle>
                <ChevronIcon $open={expandedShuttle === 'groom'}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                  </svg>
                </ChevronIcon>
              </AccordionHeader>
              {expandedShuttle === 'groom' && (
                <AccordionBody>
                  <InfoRow><InfoLabel>탑승 장소</InfoLabel><InfoText>{formatLines(weddingConfig.venue.groomShuttle.location)}</InfoText></InfoRow>
                  <InfoRow><InfoLabel>출발 시간</InfoLabel><InfoText>{weddingConfig.venue.groomShuttle.departureTime}</InfoText></InfoRow>
                  <InfoRow>
                    <InfoLabel>인솔자</InfoLabel>
                    <InfoText>
                      {weddingConfig.venue.groomShuttle.contact.name}
                      <CallBtn href={`tel:${weddingConfig.venue.groomShuttle.contact.tel}`}>전화</CallBtn>
                    </InfoText>
                  </InfoRow>
                </AccordionBody>
              )}
            </AccordionCard>
          </FadeUp>
        )}

        {weddingConfig.venue.brideShuttle && (
          <FadeUp delay={0.4}>
            <AccordionCard>
              <AccordionHeader onClick={() => setExpandedShuttle(expandedShuttle === 'bride' ? null : 'bride')}>
                <CardTitle style={{ margin: 0 }}>신부측 배차 안내</CardTitle>
                <ChevronIcon $open={expandedShuttle === 'bride'}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                  </svg>
                </ChevronIcon>
              </AccordionHeader>
              {expandedShuttle === 'bride' && (
                <AccordionBody>
                  <InfoRow><InfoLabel>탑승 장소</InfoLabel><InfoText>{formatLines(weddingConfig.venue.brideShuttle.location)}</InfoText></InfoRow>
                  <InfoRow><InfoLabel>출발 시간</InfoLabel><InfoText>{weddingConfig.venue.brideShuttle.departureTime}</InfoText></InfoRow>
                  <InfoRow>
                    <InfoLabel>인솔자</InfoLabel>
                    <InfoText>
                      {weddingConfig.venue.brideShuttle.contact.name}
                      <CallBtn href={`tel:${weddingConfig.venue.brideShuttle.contact.tel}`}>전화</CallBtn>
                    </InfoText>
                  </InfoRow>
                </AccordionBody>
              )}
            </AccordionCard>
          </FadeUp>
        )}
      </Inner>
    </VenueSectionContainer>
  );
};

const VenueSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const VenueName = styled.h3`
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.08em;
  margin: 0 0 0.5rem 0;
`;

const VenueAddress = styled.p`
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-mid);
  line-height: 1.7;
  margin: 0 0 0.4rem 0;
`;

const VenueTel = styled.a`
  font-size: 0.85rem;
  color: var(--accent);
  display: block;
  margin-bottom: 1.5rem;
  &:hover { color: var(--accent-dark); }
`;

const MapContainer = styled.div`
  height: 15rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-light);
`;

const MapFallback = styled.div`
  height: 10rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const MapFallbackText = styled.p`
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--text-dark);
  margin: 0 0 0.3rem 0;
`;

const MapFallbackSub = styled.p`
  font-size: 0.8rem;
  color: var(--text-light);
  white-space: pre-line;
  text-align: center;
  margin: 0;
`;

const MapLoading = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--text-light);
`;

const NavBtns = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const NavBtn = styled.button`
  flex: 1;
  padding: 0.65rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 300;
  color: var(--text-mid);
  letter-spacing: 0.03em;
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent);
    color: var(--accent-dark);
    background: var(--accent-light);
  }
`;

const InfoCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 0.75rem;
  text-align: left;
`;

const AccordionCard = styled(InfoCard)`
  padding: 0;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
`;

const AccordionBody = styled.div`
  padding: 0 1.5rem 1.25rem;
  border-top: 1px solid var(--border-light);
`;

const ChevronIcon = styled.div<{ $open: boolean }>`
  color: var(--text-light);
  transition: transform 0.3s ease;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const CardTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--text-dark);
  margin: 0 0 1rem 0;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
  &:last-child { margin-bottom: 0; }
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--accent);
  min-width: 3.5rem;
  flex-shrink: 0;
  padding-top: 0.05rem;
`;

const InfoText = styled.span`
  font-size: 0.82rem;
  font-weight: 300;
  color: var(--text-mid);
  line-height: 1.7;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CallBtn = styled.a`
  display: inline-block;
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--accent);
  border-radius: 4px;
  color: var(--accent);
  &:hover { background: var(--accent); color: white; }
`;

export default VenueSection;
