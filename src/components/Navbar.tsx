import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Video } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { CREATOR_PROFILE } from '../data/projects';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Work', href: '#selected-work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080808]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
            : 'bg-transparent py-5'
        }`}
        style={{ paddingTop: `calc(${isScrolled ? '0.75rem' : '1.25rem'} + env(safe-area-inset-top, 0px))` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Wordmark Logo */}
            <a
              href="#"
              className="group flex items-center gap-3 transition-opacity hover:opacity-90 min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white font-semibold text-xs tracking-wider group-hover:border-white/40 group-hover:bg-white/10 transition-colors">
                OB
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                  {CREATOR_PROFILE.name}
                  <span className="relative flex h-2 w-2" title="Available for projects">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  </span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-mono">
                  FILMMAKER CINEMATOGRAPHER
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full p-1.5 backdrop-blur-md">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full transition-all duration-200 hover:bg-white/[0.08]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Social Link (No Book a Project CTA) */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={CREATOR_PROFILE.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-zinc-300 hover:text-white transition-all duration-200"
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={15} />
              </a>
            </div>

            {/* Mobile Hamburger Toggle Button (min 44x44px touch target, No Book CTA) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-200 hover:text-white active:bg-white/[0.12] transition-colors"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Slide-Down Menu (No Book a Project CTA) */}
      <div
        className={`fixed inset-0 z-30 bg-[#080808]/95 backdrop-blur-xl md:hidden transition-all duration-300 flex flex-col justify-between pt-24 pb-8 px-6 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex flex-col space-y-4 pt-4">
          <div className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono mb-2">
            Navigation
          </div>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-medium text-zinc-200 hover:text-white py-2 border-b border-white/[0.06] flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ArrowUpRight size={18} className="text-zinc-400" />
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-zinc-400">
            <a
              href={CREATOR_PROFILE.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white"
            >
              <InstagramIcon size={14} />
              <span>{CREATOR_PROFILE.socialLinks.instagramHandle}</span>
            </a>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Video size={14} />
              <span>Tlemcen, Algeria</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
