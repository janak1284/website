import React, { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Button } from '../components/ui/Button';

// Lazy load below-the-fold sections
const About = lazy(() => import('../components/About'));
const ProblemStatements = lazy(() => import('../components/ProblemStatements'));
const Prizes = lazy(() => import('../components/Prizes'));
const Qualification = lazy(() => import('../components/Qualification'));
const Schedule = lazy(() => import('../components/Schedule'));
const Speakers = lazy(() => import('../components/Speakers'));
const Sponsors = lazy(() => import('../components/Sponsors'));
const Venue = lazy(() => import('../components/Venue'));
const Contact = lazy(() => import('../components/Contact'));

export function Home() {
  const { scrollYProgress } = useOutletContext();

  return (
    <>
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
        {/* <Speakers /> */}
        {/* <Sponsors /> */}
        <Venue />
        <Contact />
      </Suspense>
    </>
  );
}
