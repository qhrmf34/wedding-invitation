'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookSectionProps {
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

const GuestbookSection = ({ bgColor = 'white' }: GuestbookSectionProps) => {
  const [form, setForm] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);

  const showRecent = weddingConfig.guestbook?.showRecentMessages ?? true;
  const maxRecent = weddingConfig.guestbook?.maxRecentMessages ?? 5;

  const loadMessages = async () => {
    if (!showRecent) return;
    setIsLoadingMsgs(true);
    try {
      const res = await fetch(`/api/guestbook?size=${maxRecent}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.content || []);
      }
    } catch {
      // 조용히 실패
    } finally {
      setIsLoadingMsgs(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setSubmitStatus({ success: false, message: '이름과 메시지를 입력해주세요.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, message: form.message }),
      });
      if (res.ok) {
        setSubmitStatus({ success: true, message: '소중한 마음이 전달되었습니다. 감사합니다.' });
        setForm({ name: '', message: '' });
        await loadMessages();
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus({ success: false, message: '전송 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  return (
    <GuestbookSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Guestbook</SectionLabel>
          <Divider />
          <SectionSub>두 사람에게 따뜻한 마음을 전해주세요</SectionSub>
        </FadeUp>

        <FadeUp delay={0.15}>
          {submitStatus && (
            <StatusMsg $success={submitStatus.success}>
              {submitStatus.message}
            </StatusMsg>
          )}

          <Form onSubmit={handleSubmit}>
            <NameInput
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={20}
            />
            <MessageTextarea
              placeholder="두 사람을 위한 따뜻한 말 한마디를 남겨주세요"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              maxLength={300}
            />
            <CharCount>{form.message.length} / 300</CharCount>
            <SubmitBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? '전송 중...' : '마음 전하기'}
            </SubmitBtn>
          </Form>
        </FadeUp>

        {showRecent && (
          <FadeUp delay={0.25}>
            <MessagesSection>
              <MessagesSectionTitle>전해주신 마음</MessagesSectionTitle>
              {isLoadingMsgs ? (
                <LoadingText>불러오는 중...</LoadingText>
              ) : messages.length === 0 ? (
                <EmptyText>아직 남겨주신 메시지가 없습니다.</EmptyText>
              ) : (
                <MessageList>
                  {messages.map((msg) => (
                    <MessageItem key={msg.id}>
                      <MsgHeader>
                        <MsgName>{msg.name}</MsgName>
                        <MsgDate>{formatDate(msg.createdAt)}</MsgDate>
                      </MsgHeader>
                      <MsgText>{msg.message}</MsgText>
                    </MessageItem>
                  ))}
                </MessageList>
              )}
            </MessagesSection>
          </FadeUp>
        )}
      </Inner>
    </GuestbookSectionContainer>
  );
};

const GuestbookSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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
  margin: 0 0 2rem 0;
  letter-spacing: 0.03em;
`;

const StatusMsg = styled.div<{ $success: boolean }>`
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 300;
  margin-bottom: 1.25rem;
  background: ${(p) => (p.$success ? '#F0F7F2' : '#FDF2F2')};
  color: ${(p) => (p.$success ? '#3D7A58' : '#A04040')};
  border: 1px solid ${(p) => (p.$success ? '#C8E6D4' : '#F0C4C4')};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
  font-size: 0.9rem;
  font-weight: 300;
  font-family: inherit;
  color: var(--text-dark);
  transition: border-color 0.2s;
  outline: none;

  &::placeholder { color: var(--text-light); }
  &:focus { border-color: var(--accent); }
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
  font-size: 0.9rem;
  font-weight: 300;
  font-family: inherit;
  color: var(--text-dark);
  resize: vertical;
  line-height: 1.7;
  transition: border-color 0.2s;
  outline: none;

  &::placeholder { color: var(--text-light); }
  &:focus { border-color: var(--accent); }
`;

const CharCount = styled.p`
  font-size: 0.72rem;
  color: var(--text-light);
  text-align: right;
  margin: 0;
`;

const SubmitBtn = styled.button`
  padding: 0.9rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  transition: all 0.2s;
  margin-top: 0.25rem;

  &:hover { background: var(--accent-dark); }
  &:active { transform: translateY(1px); }
  &:disabled { background: var(--border); cursor: not-allowed; }
`;

const MessagesSection = styled.div`
  margin-top: 2.5rem;
  text-align: left;
`;

const MessagesSectionTitle = styled.p`
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--text-light);
  letter-spacing: 0.1em;
  text-align: center;
  margin: 0 0 1.25rem 0;
`;

const LoadingText = styled.p`
  font-size: 0.85rem;
  color: var(--text-light);
  text-align: center;
  padding: 1rem 0;
`;

const EmptyText = styled.p`
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-light);
  text-align: center;
  padding: 1rem 0;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageItem = styled.div`
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem 1.25rem;
`;

const MsgHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const MsgName = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-dark);
  letter-spacing: 0.03em;
`;

const MsgDate = styled.span`
  font-size: 0.72rem;
  color: var(--text-light);
  font-weight: 300;
`;

const MsgText = styled.p`
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-mid);
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

export default GuestbookSection;
