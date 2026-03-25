'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

interface RsvpSectionProps {
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

const RsvpSection = ({ bgColor = 'white' }: RsvpSectionProps) => {
  const [form, setForm] = useState({
    name: '',
    side: '' as 'GROOM' | 'BRIDE' | '',
    isAttending: null as boolean | null,
    guestCount: 1,
    hasMeal: null as boolean | null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const showMeal = weddingConfig.rsvp?.showMealOption ?? true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.isAttending === null || !form.side) {
      setSubmitStatus({ success: false, message: '이름, 참석 여부, 신랑/신부측을 모두 선택해주세요.' });
      return;
    }
    if (showMeal && form.isAttending && form.hasMeal === null) {
      setSubmitStatus({ success: false, message: '식사 여부를 선택해주세요.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          side: form.side,
          isAttending: form.isAttending,
          guestCount: form.isAttending ? form.guestCount : 0,
          hasMeal: form.isAttending ? form.hasMeal : false,
          message: form.message,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSubmitStatus({ success: true, message: '참석 여부가 전달되었습니다. 감사합니다.' });
        setForm({ name: '', side: '', isAttending: null, guestCount: 1, hasMeal: null, message: '' });
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus({ success: false, message: '전송 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RsvpSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>RSVP</SectionLabel>
          <Divider />
          <SectionSub>참석 여부를 알려주시면 정성껏 준비하겠습니다</SectionSub>
        </FadeUp>

        <FadeUp delay={0.15}>
          {submitStatus && (
            <StatusMsg $success={submitStatus.success}>
              {submitStatus.message}
            </StatusMsg>
          )}

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldLabel>이름</FieldLabel>
              <TextInput
                type="text"
                placeholder="성함을 입력해주세요"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={20}
              />
            </FieldGroup>

            <FieldRow>
              <FieldGroup>
                <FieldLabel>신랑 / 신부측</FieldLabel>
                <ToggleBtns>
                  <ToggleBtn
                    type="button"
                    $selected={form.side === 'GROOM'}
                    onClick={() => setForm({ ...form, side: 'GROOM' })}
                  >
                    신랑측
                  </ToggleBtn>
                  <ToggleBtn
                    type="button"
                    $selected={form.side === 'BRIDE'}
                    onClick={() => setForm({ ...form, side: 'BRIDE' })}
                  >
                    신부측
                  </ToggleBtn>
                </ToggleBtns>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>참석 여부</FieldLabel>
                <ToggleBtns>
                  <ToggleBtn
                    type="button"
                    $selected={form.isAttending === true}
                    onClick={() => setForm({ ...form, isAttending: true, guestCount: 1 })}
                  >
                    참석
                  </ToggleBtn>
                  <ToggleBtn
                    type="button"
                    $selected={form.isAttending === false}
                    onClick={() => setForm({ ...form, isAttending: false, guestCount: 0, hasMeal: null })}
                  >
                    불참
                  </ToggleBtn>
                </ToggleBtns>
              </FieldGroup>
            </FieldRow>

            {form.isAttending && (
              <FieldRow>
                <FieldGroup>
                  <FieldLabel>참석 인원</FieldLabel>
                  <SelectInput
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}명</option>
                    ))}
                  </SelectInput>
                </FieldGroup>

                {showMeal && (
                  <FieldGroup>
                    <FieldLabel>식사 여부</FieldLabel>
                    <ToggleBtns>
                      <ToggleBtn
                        type="button"
                        $selected={form.hasMeal === true}
                        onClick={() => setForm({ ...form, hasMeal: true })}
                      >
                        식사 함
                      </ToggleBtn>
                      <ToggleBtn
                        type="button"
                        $selected={form.hasMeal === false}
                        onClick={() => setForm({ ...form, hasMeal: false })}
                      >
                        안 함
                      </ToggleBtn>
                    </ToggleBtns>
                  </FieldGroup>
                )}
              </FieldRow>
            )}

            <FieldGroup>
              <FieldLabel>한 말씀 (선택)</FieldLabel>
              <MessageTextarea
                placeholder="두 사람에게 전하고 싶은 말이 있다면 남겨주세요"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                maxLength={200}
              />
            </FieldGroup>

            <SubmitBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? '전송 중...' : '회신하기'}
            </SubmitBtn>
          </Form>
        </FadeUp>
      </Inner>
    </RsvpSectionContainer>
  );
};

const RsvpSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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
  gap: 1.25rem;
  text-align: left;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const FieldLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--text-mid);
  letter-spacing: 0.05em;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
  font-size: 0.9rem;
  font-weight: 300;
  font-family: inherit;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s;
  &::placeholder { color: var(--text-light); }
  &:focus { border-color: var(--accent); }
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
  font-size: 0.88rem;
  font-weight: 300;
  font-family: inherit;
  color: var(--text-dark);
  resize: vertical;
  line-height: 1.7;
  outline: none;
  transition: border-color 0.2s;
  &::placeholder { color: var(--text-light); }
  &:focus { border-color: var(--accent); }
`;

const ToggleBtns = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ToggleBtn = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 0.65rem 0.5rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 300;
  font-family: inherit;
  transition: all 0.2s;
  border: 1px solid ${(p) => (p.$selected ? 'var(--accent)' : 'var(--border-light)')};
  background: ${(p) => (p.$selected ? 'var(--accent)' : 'transparent')};
  color: ${(p) => (p.$selected ? 'white' : 'var(--text-mid)')};
  &:hover {
    border-color: var(--accent);
    color: ${(p) => (p.$selected ? 'white' : 'var(--accent-dark)')};
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-white);
  font-size: 0.88rem;
  font-weight: 300;
  font-family: inherit;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: var(--accent); }
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
  font-family: inherit;
  transition: all 0.2s;
  margin-top: 0.25rem;

  &:hover { background: var(--accent-dark); }
  &:active { transform: translateY(1px); }
  &:disabled { background: var(--border); cursor: not-allowed; }
`;

export default RsvpSection;
