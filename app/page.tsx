'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import MainSection from '../src/components/sections/MainSection';
import IntroOverlay from '../src/components/IntroOverlay';
import MusicPlayer from '../src/components/MusicPlayer';
import { weddingConfig } from '../src/config/wedding-config';

const InvitationSection = dynamic(() => import('../src/components/sections/InvitationSection'));
const DateSection = dynamic(() => import('../src/components/sections/DateSection'), {
  loading: () => <div style={{ padding: '5rem 1.5rem' }} />,
});
const GallerySection = dynamic(() => import('../src/components/sections/GallerySection'), {
  loading: () => <div style={{ padding: '5rem 1.5rem' }} />,
});
const VenueSection = dynamic(() => import('../src/components/sections/VenueSection'), {
  ssr: false,
  loading: () => <div style={{ padding: '5rem 1.5rem' }} />,
});
const ContactSection  = dynamic(() => import('../src/components/sections/ContactSection'));
const GuestbookSection = dynamic(() => import('../src/components/sections/GuestbookSection'));
const RsvpSection     = dynamic(() => import('../src/components/sections/RsvpSection'));
const AccountSection  = dynamic(() => import('../src/components/sections/AccountSection'));
const Footer          = dynamic(() => import('../src/components/sections/Footer'));

const SECTIONS = [
  'invitation', 'date', 'gallery', 'venue',
  'contact', 'guestbook', 'rsvp', 'account',
] as const;

type SectionName = (typeof SECTIONS)[number];
type BgColor = 'white' | 'beige';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);

  const showRsvp      = weddingConfig.rsvp?.enabled ?? true;
  const showGuestbook = weddingConfig.guestbook?.enabled ?? true;
  const showMusic     = weddingConfig.music?.enabled ?? true;

  const activeSections = SECTIONS.filter((s) => {
    if (s === 'rsvp'      && !showRsvp)      return false;
    if (s === 'guestbook' && !showGuestbook) return false;
    return true;
  });

  return (
    <>
      {/* 오디오 엘리먼트 (전역) */}
      {showMusic && (
        <audio ref={audioRef} src={weddingConfig.music.src} preload="auto" loop />
      )}

      {/* 인트로 오버레이: 탭하면 음악 재생 + 사라짐 */}
      {!entered && (
        <IntroOverlay audioRef={audioRef} onEnter={() => setEntered(true)} />
      )}

      <main>
        <MainSection />
        {showMusic && entered && <MusicPlayer audioRef={audioRef} />}

        {activeSections.map((name, idx) => {
          const bg: BgColor = idx % 2 === 0 ? 'white' : 'beige';
          switch (name) {
            case 'invitation': return <InvitationSection  key={name} bgColor={bg} />;
            case 'date':       return <DateSection        key={name} bgColor={bg} />;
            case 'gallery':    return <GallerySection     key={name} bgColor={bg} />;
            case 'venue':      return <VenueSection       key={name} bgColor={bg} />;
            case 'contact':    return <ContactSection     key={name} bgColor={bg} />;
            case 'guestbook':  return <GuestbookSection   key={name} bgColor={bg} />;
            case 'rsvp':       return <RsvpSection        key={name} bgColor={bg} />;
            case 'account':    return <AccountSection     key={name} bgColor={bg} />;
            default:           return null;
          }
        })}
        <Footer />
      </main>
    </>
  );
}
