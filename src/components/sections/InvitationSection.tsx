'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { weddingConfig } from '../../config/wedding-config';

interface InvitationSectionProps {
  bgColor?: 'white' | 'beige';
}

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const InvitationSection = ({ bgColor = 'white' }: InvitationSectionProps) => {
  const { invitation } = weddingConfig;

  const hasGroomFather = Boolean(invitation.groom.father?.trim());
  const hasGroomMother = Boolean(invitation.groom.mother?.trim());
  const hasGroomParents = hasGroomFather || hasGroomMother;

  const hasBrideFather = Boolean(invitation.bride.father?.trim());
  const hasBrideMother = Boolean(invitation.bride.mother?.trim());
  const hasBrideParents = hasBrideFather || hasBrideMother;

  const getParentsText = (father: string, mother: string, hasFather: boolean, hasMother: boolean): string => {
    if (hasFather && hasMother) return `${father} · ${mother}`;
    if (hasFather) return father;
    if (hasMother) return mother;
    return '';
  };

  const groomParentsText = getParentsText(
    invitation.groom.father || '',
    invitation.groom.mother || '',
    hasGroomFather,
    hasGroomMother
  );
  const brideParentsText = getParentsText(
    invitation.bride.father || '',
    invitation.bride.mother || '',
    hasBrideFather,
    hasBrideMother
  );

  return (
    <InvitationSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Invitation</SectionLabel>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Divider />
        </FadeUp>

        <FadeUp delay={0.2}>
          <InvitationMessage>{invitation.message}</InvitationMessage>
        </FadeUp>

        <FadeUp delay={0.35}>
          <CoupleBlock>
            <PersonInfo>
              {hasGroomParents && (
                <ParentsRow>
                  <ParentsName>{groomParentsText}</ParentsName>
                  <ParentLabel>의 {invitation.groom.label || '아들'}</ParentLabel>
                </ParentsRow>
              )}
              <CoupleName>{invitation.groom.name}</CoupleName>
            </PersonInfo>

            <CenterDot>·</CenterDot>

            <PersonInfo>
              {hasBrideParents && (
                <ParentsRow>
                  <ParentsName>{brideParentsText}</ParentsName>
                  <ParentLabel>의 {invitation.bride.label || '딸'}</ParentLabel>
                </ParentsRow>
              )}
              <CoupleName>{invitation.bride.name}</CoupleName>
            </PersonInfo>
          </CoupleBlock>
        </FadeUp>
      </Inner>
    </InvitationSectionContainer>
  );
};

const InvitationSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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
  margin: 0 auto 2.5rem auto;
`;

const InvitationMessage = styled.p`
  white-space: pre-line;
  line-height: 2.2;
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--text-mid);
  margin: 0 0 3rem 0;
  letter-spacing: 0.03em;
`;

const CoupleBlock = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5rem;
`;

const PersonInfo = styled.div`
  text-align: center;
`;

const ParentsRow = styled.div`
  margin-bottom: 0.3rem;
`;

const ParentsName = styled.span`
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--text-light);
  letter-spacing: 0.02em;
`;

const ParentLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--text-light);
  letter-spacing: 0.02em;
`;

const CoupleName = styled.p`
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.1em;
  margin: 0;
`;

const CenterDot = styled.span`
  font-size: 1.2rem;
  color: var(--accent);
  padding-bottom: 0.1rem;
`;

export default InvitationSection;
