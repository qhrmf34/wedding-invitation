'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { weddingConfig } from '../../config/wedding-config';

interface DateSectionProps {
  bgColor?: 'white' | 'beige';
}

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const DateSection = ({ bgColor = 'white' }: DateSectionProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isWeddingPassed, setIsWeddingPassed] = useState(false);

  const generateCalendar = () => {
    const { year, month, day } = weddingConfig.date;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(<CalendarCell key={`e-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month - 1, d).getDay();
      const isWedding = d === day;
      const isSun = dow === 0;
      const isSat = dow === 6;
      cells.push(
        <CalendarCell key={d} $isWedding={isWedding} $isSun={isSun} $isSat={isSat}>
          <DayNum $isWedding={isWedding}>{d}</DayNum>
        </CalendarCell>
      );
    }
    return cells;
  };

  useEffect(() => {
    const calc = () => {
      const wedding = new Date(
        weddingConfig.date.year,
        weddingConfig.date.month - 1,
        weddingConfig.date.day,
        weddingConfig.date.hour,
        weddingConfig.date.minute
      );
      const diff = wedding.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
        setIsWeddingPassed(false);
      } else {
        setIsWeddingPassed(true);
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <DateSectionContainer $bgColor={bgColor}>
      <Inner>
        <FadeUp>
          <SectionLabel>Date</SectionLabel>
          <Divider />
        </FadeUp>

        <FadeUp delay={0.1}>
          <DateDisplay>{weddingConfig.date.displayDate}</DateDisplay>
        </FadeUp>

        <FadeUp delay={0.2}>
          <CalendarCard>
            <CalendarMonth>
              {weddingConfig.date.year}년 {weddingConfig.date.month}월
            </CalendarMonth>
            <CalendarGrid>
              {DAYS.map((d, i) => (
                <DayLabel key={d} $isSun={i === 0} $isSat={i === 6}>
                  {d}
                </DayLabel>
              ))}
              {generateCalendar()}
            </CalendarGrid>
          </CalendarCard>
        </FadeUp>

        {!isWeddingPassed && (
          <FadeUp delay={0.3}>
            <CountdownWrapper>
              <CountdownLabel>결혼식까지</CountdownLabel>
              <CountdownRow>
                <CountItem>
                  <CountNum>{timeLeft.days}</CountNum>
                  <CountUnit>일</CountUnit>
                </CountItem>
                <CountSep>:</CountSep>
                <CountItem>
                  <CountNum>{pad(timeLeft.hours)}</CountNum>
                  <CountUnit>시간</CountUnit>
                </CountItem>
                <CountSep>:</CountSep>
                <CountItem>
                  <CountNum>{pad(timeLeft.minutes)}</CountNum>
                  <CountUnit>분</CountUnit>
                </CountItem>
                <CountSep>:</CountSep>
                <CountItem>
                  <CountNum>{pad(timeLeft.seconds)}</CountNum>
                  <CountUnit>초</CountUnit>
                </CountItem>
              </CountdownRow>
            </CountdownWrapper>
          </FadeUp>
        )}
      </Inner>
    </DateSectionContainer>
  );
};

const DateSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
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

const DateDisplay = styled.p`
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: var(--text-mid);
  margin: 0 0 2.5rem 0;
`;

const CalendarCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  margin-bottom: 2.5rem;
`;

const CalendarMonth = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--text-dark);
  margin: 0 0 1.25rem 0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem 0;
`;

const DayLabel = styled.div<{ $isSun?: boolean; $isSat?: boolean }>`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${(p) => (p.$isSun ? '#C0826A' : p.$isSat ? '#7A97C0' : 'var(--text-light)')};
  text-align: center;
  padding-bottom: 0.6rem;
`;

const CalendarCell = styled.div<{ $isWedding?: boolean; $isSun?: boolean; $isSat?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
`;

const DayNum = styled.span<{ $isWedding?: boolean }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$isWedding ? 500 : 300)};
  border-radius: 50%;
  background: ${(p) => (p.$isWedding ? 'var(--accent)' : 'transparent')};
  color: ${(p) => (p.$isWedding ? '#fff' : 'var(--text-dark)')};
`;

const CountdownWrapper = styled.div`
  text-align: center;
`;

const CountdownLabel = styled.p`
  font-size: 0.8rem;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: var(--text-light);
  margin: 0 0 1rem 0;
`;

const CountdownRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

const CountItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3rem;
`;

const CountNum = styled.span`
  font-family: 'PlayfairDisplay', Georgia, serif;
  font-size: clamp(1.6rem, 6vw, 2.2rem);
  font-weight: 400;
  color: var(--accent-dark);
  line-height: 1;
  font-style: italic;
`;

const CountUnit = styled.span`
  font-size: 0.7rem;
  font-weight: 300;
  color: var(--text-light);
  margin-top: 0.3rem;
  letter-spacing: 0.05em;
`;

const CountSep = styled.span`
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  color: var(--accent);
  padding-top: 0.1rem;
  line-height: 1;
`;

export default DateSection;
