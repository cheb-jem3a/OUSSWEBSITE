import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SelectedWork } from '../components/SelectedWork';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { ContactFooter } from '../components/ContactFooter';

export const HomePage: React.FC = () => {
  const scrollToWork = () => {
    const el = document.getElementById('selected-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-orange-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections (100% Lightweight - Zero Video Decoders on Home) */}
      <main>
        <Hero onExploreWork={scrollToWork} />
        <About />
        <SelectedWork />
        <Services />
      </main>

      {/* Footer & Essential Contact */}
      <ContactFooter />
    </div>
  );
};

export default HomePage;
