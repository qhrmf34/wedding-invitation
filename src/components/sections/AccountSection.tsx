'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';
import { AccountInfo } from '../../types/wedding';

type AccountPerson = 'groom' | 'bride' | 'groomFather' | 'groomMother' | 'brideFather' | 'brideMother';

interface AccountSectionProps {
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

const AccountSection = ({ bgColor = 'white' }: AccountSectionProps) => {
  const [copied, setCopied] = useState<Record<AccountPerson, boolean>>({
    groom: false, bride: false, groomFather: false, groomMother: false, brideFather: false, brideMother: false,
  });
  const [urlCopied, setUrlCopied] = useState(false);

  const getPersonName = (person: AccountPerson): string => {
    switch (person) {
      case 'groom': return weddingConfig.invitation.groom.name;
      case 'bride': return weddingConfig.invitation.bride.name;
      case 'groomFather': return weddingConfig.invitation.groom.father;
      case 'groomMother': return weddingConfig.invitation.groom.mother;
      case 'brideFather': return weddingConfig.invitation.bride.father;
      case 'brideMother': return weddingConfig.invitation.bride.mother;
      default: return '';
    }
  };

  const copyAccount = (info: AccountInfo, person: AccountPerson) => {
    navigator.clipboard.writeText(`${info.bank} ${info.number} ${info.holder}`).then(() => {
      setCopied((prev) => ({ ...prev, [person]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [person]: false })), 2000);
    });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    });
  };

  const share = async () => {
    const data = {
      title: weddingConfig.meta.title,
      text: `${weddingConfig.invitation.groom.name} & ${weddingConfig.invitation.bride.name}의 결혼식에 초대합니다`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      copyUrl();
    }
  };

  interface RowData { info: AccountInfo; person: AccountPerson; label: string; }

  const renderGroup = (title: string, rows: RowData[], delay: number) => (
    <FadeUp delay={delay}>
      <AccountGroup>
        <GroupTitle>{title}</GroupTitle>
        {rows.map(({ info, person, label }) => {
          const name = getPersonName(person);
          if (!name?.trim()) return null;
          return (
            <AccountRow key={person}>
              <RowMeta>
                <RowLabel>{label}</RowLabel>
                <RowName>{name}</RowName>
              </RowMeta>
              <RowAccount>
                <BankName>{info.bank}</BankName>
                <AccountNum>{info.number}</AccountNum>
              </RowAccount>
              <CopyBtn onClick={() => copyAccount(info, person)}>
                {copied[person] ? '완료' : '복사'}
              </CopyBtn>
            </AccountRow>
          );
        })}
      </AccountGroup>
    </FadeUp>
  );

  return (
    <AccountSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Accounts</SectionLabel>
          <Divider />
          <SectionSub>마음 전하실 곳</SectionSub>
        </FadeUp>

        {renderGroup('신랑 측', [
          { info: weddingConfig.account.groom, person: 'groom', label: '신랑' },
          { info: weddingConfig.account.groomFather, person: 'groomFather', label: '아버지' },
          { info: weddingConfig.account.groomMother, person: 'groomMother', label: '어머니' },
        ], 0.1)}

        {renderGroup('신부 측', [
          { info: weddingConfig.account.bride, person: 'bride', label: '신부' },
          { info: weddingConfig.account.brideFather, person: 'brideFather', label: '아버지' },
          { info: weddingConfig.account.brideMother, person: 'brideMother', label: '어머니' },
        ], 0.2)}

        <FadeUp delay={0.3}>
          <ShareRow>
            <ShareBtn onClick={copyUrl}>{urlCopied ? '복사 완료' : 'URL 복사'}</ShareBtn>
            <ShareBtn onClick={share} $primary>청첩장 공유</ShareBtn>
          </ShareRow>
        </FadeUp>
      </Inner>
    </AccountSectionContainer>
  );
};

const AccountSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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
  margin: 0 auto 1.5rem auto;
`;

const SectionSub = styled.p`
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-mid);
  letter-spacing: 0.08em;
  margin: 0 0 2rem 0;
`;

const AccountGroup = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  text-align: left;
`;

const GroupTitle = styled.div`
  padding: 0.85rem 1.25rem;
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--accent-dark);
  letter-spacing: 0.1em;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  gap: 0.75rem;

  &:last-child {
    border-bottom: none;
  }
`;

const RowMeta = styled.div`
  min-width: 4.5rem;
  flex-shrink: 0;
`;

const RowLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 300;
  color: var(--text-light);
  margin-bottom: 0.1rem;
`;

const RowName = styled.div`
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.03em;
`;

const RowAccount = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
`;

const BankName = styled.span`
  font-size: 0.72rem;
  font-weight: 300;
  color: var(--text-light);
`;

const AccountNum = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyBtn = styled.button`
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: transparent;
  font-size: 0.72rem;
  font-family: inherit;
  color: var(--text-mid);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const ShareRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const ShareBtn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(p) => (p.$primary ? 'var(--accent)' : 'var(--border)')};
  background: ${(p) => (p.$primary ? 'var(--accent)' : 'transparent')};
  color: ${(p) => (p.$primary ? 'white' : 'var(--text-mid)')};

  &:hover {
    background: ${(p) => (p.$primary ? 'var(--accent-dark)' : 'var(--bg-secondary)')};
    border-color: ${(p) => (p.$primary ? 'var(--accent-dark)' : 'var(--border)')};
  }
`;

export default AccountSection;
