import React, { useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useScroll, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion';

import { ParticleScene } from './ParticleScene';
import { ScrollToTop } from './ScrollToTop';
import { Button } from './ui/Button';

export function RootLayout() {
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    // Defer 3D canvas mount until first paint completes
    const timer = setTimeout(() => setMountCanvas(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      <ScrollToTop />
      
      {/* Sticky Glassmorphic Navbar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 pointer-events-none"
      >
        <div className="flex gap-4 pointer-events-auto bg-[#130d26]/80 backdrop-blur-md p-2 rounded-xl border border-white/10 font-display">
           <Link to="/" className="text-white hover:text-[#C026D3] px-3 py-1 transition-colors">Home</Link>
           <Link to="/guidelines" className="text-white hover:text-[#C026D3] px-3 py-1 transition-colors">Guidelines</Link>
           <Link to="/tracks" className="text-white hover:text-[#C026D3] px-3 py-1 transition-colors">Tracks</Link>
           <Link to="/schedule" className="text-white hover:text-[#C026D3] px-3 py-1 transition-colors">Schedule</Link>
        </div>
        {location.pathname === '/dashboard' ? (
          <div className="pointer-events-auto hidden md:block">
            <Button variant="magenta" onClick={handleLogout} className="shadow-2xl">
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/dashboard" className="pointer-events-auto hidden md:block">
            <Button variant="primary" className="shadow-2xl">
              Team Portal
            </Button>
          </Link>
        )}
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
              <ParticleScene scrollYProgress={scrollYProgress} pathname={location.pathname} />
            </Canvas>
          </motion.div>
        )}
      </div>

      {/* Foreground UI Components with Page Transitions */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Outlet context={{ scrollYProgress }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
