import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useScroll } from 'framer-motion';

import { ParticleScene } from './components/ParticleScene';
import { Hero } from './components/Hero';
import { ProofSection } from './components/ProofSection';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      {/* 
        Fixed Canvas Background
        Renders the Three.js scene that morphs based on scrollYProgress.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ParticleScene scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Foreground UI Components */}
      <Hero scrollYProgress={scrollYProgress} />
      <ProofSection />
      <Features />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
