'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface RsvpEntry {
  id: number;
  name: string;
  side: string;
  isAttending: boolean;
  guestCount: number;
  hasMeal: boolean;
  message: string;
  createdAt: string;
}

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'guestbook'>('rsvp');
  const [rsvpData, setRsvpData] = useState<RsvpEntry[]>([]);
  const [guestbookData, setGuestbookData] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        loadData('rsvp');
      } else {
        setAuthError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setAuthError('서버에 연결할 수 없습니다.');
    } finally {
      setIsLogging(false);
    }
  };

  const loadData = async (type: 'rsvp' | 'guestbook') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin?type=${type}&size=500`, {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.content || data || [];
        if (type === 'rsvp') setRsvpData(list);
        else setGuestbookData(list);
      }
    } catch {
      // 오류 무시
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'rsvp' | 'guestbook') => {
    setActiveTab(tab);
    if (tab === 'rsvp' && rsvpData.length === 0) loadData('rsvp');
    if (tab === 'guestbook' && guestbookData.length === 0) loadData('guestbook');
  };

  const formatDate = (str: string) => {
    try {
      const d = new Date(str);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch { return str; }
  };

  const attendingCount = rsvpData.filter((r) => r.isAttending).length;
  const totalGuests = rsvpData.filter((r) => r.isAttending).reduce((sum, r) => sum + (r.guestCount || 0), 0);

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <LoginCard>
          <LoginTitle>관리자 페이지</LoginTitle>
          <LoginSub>신랑신부 전용 비공개 영역입니다</LoginSub>
          {authError && <ErrorMsg>{authError}</ErrorMsg>}
          <LoginForm onSubmit={handleLogin}>
            <PwInput
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <LoginBtn type="submit" disabled={isLogging}>
              {isLogging ? '확인 중...' : '입장'}
            </LoginBtn>
          </LoginForm>
        </LoginCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <AdminContainer>
        <AdminHeader>
          <AdminTitle>웨딩 관리자</AdminTitle>
          <RefreshBtn onClick={() => loadData(activeTab)}>새로고침</RefreshBtn>
        </AdminHeader>

        <SummaryRow>
          <SummaryCard>
            <SummaryNum>{rsvpData.length}</SummaryNum>
            <SummaryLabel>총 응답</SummaryLabel>
          </SummaryCard>
          <SummaryCard $accent>
            <SummaryNum>{attendingCount}</SummaryNum>
            <SummaryLabel>참석</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryNum>{totalGuests}</SummaryNum>
            <SummaryLabel>총 인원</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryNum>{guestbookData.length}</SummaryNum>
            <SummaryLabel>방명록</SummaryLabel>
          </SummaryCard>
        </SummaryRow>

        <Tabs>
          <Tab $active={activeTab === 'rsvp'} onClick={() => handleTabChange('rsvp')}>
            참석 여부 ({rsvpData.length})
          </Tab>
          <Tab $active={activeTab === 'guestbook'} onClick={() => handleTabChange('guestbook')}>
            방명록 ({guestbookData.length})
          </Tab>
        </Tabs>

        {isLoading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : activeTab === 'rsvp' ? (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>이름</Th>
                  <Th>측</Th>
                  <Th>참석</Th>
                  <Th>인원</Th>
                  <Th>식사</Th>
                  <Th>메시지</Th>
                  <Th>접수일시</Th>
                </tr>
              </thead>
              <tbody>
                {rsvpData.map((r) => (
                  <tr key={r.id}>
                    <Td>{r.name}</Td>
                    <Td>{r.side === 'GROOM' ? '신랑' : r.side === 'BRIDE' ? '신부' : r.side}</Td>
                    <Td $bold $color={r.isAttending ? '#3D7A58' : '#A04040'}>
                      {r.isAttending ? '참석' : '불참'}
                    </Td>
                    <Td>{r.isAttending ? `${r.guestCount}명` : '-'}</Td>
                    <Td>{r.isAttending ? (r.hasMeal ? '식사' : '안함') : '-'}</Td>
                    <Td $light>{r.message || '-'}</Td>
                    <Td $light>{formatDate(r.createdAt)}</Td>
                  </tr>
                ))}
                {rsvpData.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: '0.85rem' }}>응답이 없습니다.</td></tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        ) : (
          <GuestbookList>
            {guestbookData.map((g) => (
              <GuestbookCard key={g.id}>
                <GuestMeta>
                  <GuestName>{g.name}</GuestName>
                  <GuestDate>{formatDate(g.createdAt)}</GuestDate>
                </GuestMeta>
                <GuestMsg>{g.message}</GuestMsg>
              </GuestbookCard>
            ))}
            {guestbookData.length === 0 && (
              <EmptyText>방명록이 없습니다.</EmptyText>
            )}
          </GuestbookList>
        )}
      </AdminContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #FAFAF8;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'MaruBuri', 'Apple SD Gothic Neo', sans-serif;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 8vh auto 0;
  text-align: center;
`;

const LoginTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 400;
  color: #262220;
  margin: 0 0 0.5rem 0;
`;

const LoginSub = styled.p`
  font-size: 0.82rem;
  color: #ACA9A5;
  font-weight: 300;
  margin: 0 0 2rem 0;
`;

const ErrorMsg = styled.div`
  background: #FDF2F2;
  border: 1px solid #F0C4C4;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: #A04040;
  margin-bottom: 1rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PwInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #E0D8CE;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  &:focus { border-color: #C4A07A; }
`;

const LoginBtn = styled.button`
  padding: 0.9rem;
  background: #C4A07A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: #8C6D55; }
  &:disabled { background: #E0D8CE; cursor: not-allowed; }
`;

const AdminContainer = styled.div`
  width: 100%;
  max-width: 900px;
`;

const AdminHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const AdminTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 400;
  color: #262220;
  margin: 0;
`;

const RefreshBtn = styled.button`
  padding: 0.4rem 0.9rem;
  border: 1px solid #E0D8CE;
  border-radius: 6px;
  background: transparent;
  font-size: 0.8rem;
  color: #6B6560;
  cursor: pointer;
  font-family: inherit;
  &:hover { background: #F2EDE6; }
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SummaryCard = styled.div<{ $accent?: boolean }>`
  background: ${(p) => (p.$accent ? '#C4A07A' : 'white')};
  border: 1px solid #E0D8CE;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const SummaryNum = styled.p`
  font-size: 1.6rem;
  font-weight: 400;
  color: inherit;
  margin: 0 0 0.2rem 0;
`;

const SummaryLabel = styled.p`
  font-size: 0.72rem;
  color: inherit;
  font-weight: 300;
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E0D8CE;
  margin-bottom: 1.5rem;
  gap: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.7rem 1.25rem;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? '#C4A07A' : 'transparent')};
  background: transparent;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? '400' : '300')};
  font-family: inherit;
  color: ${(p) => (p.$active ? '#C4A07A' : '#ACA9A5')};
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: #C4A07A; }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 3rem;
  color: #ACA9A5;
  font-size: 0.85rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid #E0D8CE;
  font-weight: 400;
  color: #6B6560;
  white-space: nowrap;
  background: #FAFAF8;
`;

const Td = styled.td<{ $bold?: boolean; $color?: string; $light?: boolean }>`
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #F2EDE6;
  color: ${(p) => p.$color || (p.$light ? '#ACA9A5' : '#262220')};
  font-weight: ${(p) => (p.$bold ? '400' : '300')};
  white-space: ${(p) => (p.$light ? 'normal' : 'nowrap')};
  max-width: ${(p) => (p.$light ? '200px' : 'none')};
  font-size: 0.82rem;
`;

const GuestbookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const GuestbookCard = styled.div`
  background: white;
  border: 1px solid #E0D8CE;
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
`;

const GuestMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const GuestName = styled.span`
  font-size: 0.88rem;
  font-weight: 400;
  color: #262220;
`;

const GuestDate = styled.span`
  font-size: 0.72rem;
  color: #ACA9A5;
`;

const GuestMsg = styled.p`
  font-size: 0.85rem;
  font-weight: 300;
  color: #6B6560;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const EmptyText = styled.p`
  text-align: center;
  padding: 3rem;
  color: #ACA9A5;
  font-size: 0.85rem;
`;
