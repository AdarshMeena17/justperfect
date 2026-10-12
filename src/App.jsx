import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from './lib/gsap';
import { initScroll } from './lib/scroll';
import SiteHeader from './components/SiteHeader';
import HeroExperience from './components/HeroExperience';
import ManifestoSection from './components/ManifestoSection';
import ServicesSection from './components/ServicesSection';
import DuoSection from './components/DuoSection';
import VideoMarquee from './components/VideoMarquee';
import WorkGallery from './components/WorkGallery';
import BookingSection from './components/BookingSection';
import SiteFooter from './components/SiteFooter';
import ProjectViewer from './components/ProjectViewer';

export default function App() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => initScroll(), []);

  useEffect(() => {
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Generic reveal for [data-reveal] blocks
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.set('[data-reveal]', { opacity: 0, y: 40 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }),
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <a className="skip" href="#work">Skip to work</a>
      <SiteHeader />
      <main>
        <HeroExperience />
        <ManifestoSection />
        <ServicesSection />
        <DuoSection />
        <VideoMarquee onOpen={setActive} />
        <WorkGallery onOpen={setActive} />
        <BookingSection />
      </main>
      <SiteFooter />
      <ProjectViewer item={active} onClose={close} />
    </div>
  );
}
