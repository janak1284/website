import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { useScroll, motion, useMotionValueEvent } from 'framer-motion';

import { ParticleScene } from './components/ParticleScene';
import { Hero } from './components/Hero';
import { Button } from './components/ui/Button';

// Lazy load below-the-fold sections
const About = lazy(() => import('./components/About'));
const ProblemStatements = lazy(() => import('./components/ProblemStatements'));
const Prizes = lazy(() => import('./components/Prizes'));
const Qualification = lazy(() => import('./components/Qualification'));
const Schedule = lazy(() => import('./components/Schedule'));
const Speakers = lazy(() => import('./components/Speakers'));
const Sponsors = lazy(() => import('./components/Sponsors'));
const Venue = lazy(() => import('./components/Venue'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [mountCanvas, setMountCanvas] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Defer 3D canvas mount until first paint completes
    const timer = setTimeout(() => setMountCanvas(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show sticky nav CTA after scrolling past Hero (approx 500px)
    if (latest > 500) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Sticky Nav CTA */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: showNav ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-end p-4 md:p-6 pointer-events-none"
      >
        <a href="#" className="pointer-events-auto">
          <Button variant="primary" className="shadow-2xl">
            Register on EventHub
          </Button>
        </a>
      </motion.div>

      {/* Fixed Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {mountCanvas && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-full h-full"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
              <ParticleScene scrollYProgress={scrollYProgress} />
            </Canvas>
          </motion.div>
        )}
      </div>

      {/* Foreground UI Components */}
      <Hero scrollYProgress={scrollYProgress} />
      
      <Suspense fallback={<div className="h-screen" />}>
        <About />
        <ProblemStatements />
        <Prizes />
        
        {/* Contextual CTA after Prizes */}
        <div className="relative z-10 flex justify-center py-12">
          <a href="#">
            <Button variant="primary" className="scale-110">
              Register Your Team Now
            </Button>
          </a>
        </div>

        <Qualification />
        <Schedule />
        <Speakers />
        <Sponsors />
        <Venue />
        <Contact />
      </Suspense>
    </div>
  );
}

export default App;
