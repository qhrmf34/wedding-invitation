'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

interface ContactSectionProps {
  bgColor?: 'white' | 'beige';
}

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}>
      {children}
    </motion.div>
  );
};

// 전화 아이콘
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.65a16 16 0 006.29 6.29l1.17-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

// 문자 아이콘
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

interface PersonContactProps {
  label?: string;
  name: string;
  tel: string;
  isNameBold?: boolean;
}

const PersonContact = ({ label, name, tel, isNameBold }: PersonContactProps) => (
  <PersonBlock>
    <PersonName>
      {label && <PersonLabel>{label} </PersonLabel>}
      <PersonNameText $bold={isNameBold}>{name}</PersonNameText>
    </PersonName>
    <ContactBtns>
      <ContactBtn href={`tel:${tel}`} aria-label={`${name}에게 전화`}>
        <PhoneIcon />
      </ContactBtn>
      <ContactBtn href={`sms:${tel}`} aria-label={`${name}에게 문자`}>
        <MessageIcon />
      </ContactBtn>
    </ContactBtns>
  </PersonBlock>
);

const ContactSection = ({ bgColor = 'white' }: ContactSectionProps) => {
  const { invitation } = weddingConfig;
  const g = invitation.groom as any;
  const b = invitation.bride as any;

  return (
    <ContactSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Contact</SectionLabel>
          <Divider />
        </FadeUp>

        <FadeUp delay={0.1}>
          <ContactGrid>
            {/* 신랑 측 */}
            <ContactColumn>
              <ColumnTitle>신랑</ColumnTitle>
              {g.tel && <PersonContact name={g.name} tel={g.tel} isNameBold />}

              <ParentsSection>
                <ParentsTitle>신랑 측 혼주</ParentsTitle>
                {g.fatherTel && (
                  <PersonContact label="아버지" name={g.father} tel={g.fatherTel} />
                )}
                {g.motherTel && (
                  <PersonContact label="어머니" name={g.mother} tel={g.motherTel} />
                )}
              </ParentsSection>
            </ContactColumn>

            <VerticalDivider />

            {/* 신부 측 */}
            <ContactColumn>
              <ColumnTitle>신부</ColumnTitle>
              {b.tel && <PersonContact name={b.name} tel={b.tel} isNameBold />}

              <ParentsSection>
                <ParentsTitle>신부 측 혼주</ParentsTitle>
                {b.fatherTel && (
                  <PersonContact label="아버지" name={b.father} tel={b.fatherTel} />
                )}
                {b.motherTel && (
                  <PersonContact label="어머니" name={b.mother} tel={b.motherTel} />
                )}
              </ParentsSection>
            </ContactColumn>
          </ContactGrid>
        </FadeUp>
      </Inner>
    </ContactSectionContainer>
  );
};

const ContactSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0 1.5rem;
  align-items: start;
`;

const VerticalDivider = styled.div`
  width: 1px;
  background: var(--border-light);
  align-self: stretch;
  min-height: 200px;
`;

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
`;

const ColumnTitle = styled.p`
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.1em;
  margin: 0 0 0.75rem 0;
`;

const PersonBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const PersonName = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  justify-content: center;
`;

const PersonLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--text-light);
`;

const PersonNameText = styled.span<{ $bold?: boolean }>`
  font-size: ${(p) => (p.$bold ? '1rem' : '0.9rem')};
  font-weight: ${(p) => (p.$bold ? '400' : '300')};
  color: var(--text-dark);
  letter-spacing: 0.05em;
`;

const ContactBtns = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ContactBtn = styled.a`
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  text-decoration: none;

  &:hover, &:active {
    border-color: var(--accent);
    color: var(--accent-dark);
    background: var(--accent-light);
  }
`;

const ParentsSection = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
`;

const ParentsTitle = styled.p`
  font-size: 0.72rem;
  font-weight: 300;
  color: var(--text-light);
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem 0;
`;

export default ContactSection;
