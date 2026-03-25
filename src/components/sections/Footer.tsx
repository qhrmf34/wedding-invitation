'use client';

import React from 'react';
import styled from 'styled-components';
import { weddingConfig } from '../../config/wedding-config';

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <FooterContainer>
      <FooterInner>
        <CoupleLine>
          {weddingConfig.invitation.groom.name} &amp; {weddingConfig.invitation.bride.name}
        </CoupleLine>
        <WeddingDate>{weddingConfig.date.displayDate}</WeddingDate>
        <FooterDivider />
        <Copyright>&copy; {currentYear} </Copyright>
        <HiddenAttribution data-jwk-id={watermarkId}>NonCommercial</HiddenAttribution>
      </FooterInner>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  padding: 3rem 1.5rem 2.5rem;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
`;

const FooterInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`;

const CoupleLine = styled.p`
  font-family: 'PlayfairDisplay', Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin: 0;
`;

const WeddingDate = styled.p`
  font-size: 0.78rem;
  font-weight: 300;
  color: var(--text-light);
  letter-spacing: 0.1em;
  margin: 0.2rem 0 0 0;
`;

const FooterDivider = styled.div`
  width: 1.5rem;
  height: 1px;
  background: var(--border);
  margin: 0.8rem auto;
`;

const Copyright = styled.p`
  font-size: 0.72rem;
  color: var(--text-light);
  font-weight: 300;
  margin: 0;
`;

const GithubLink = styled.a`
  font-size: 0.7rem;
  color: var(--text-light);
  text-decoration: underline;
  text-underline-offset: 3px;
  &:hover { color: var(--text-mid); }
`;

const HiddenAttribution = styled.div`
  position: absolute;
  opacity: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

export default Footer;
