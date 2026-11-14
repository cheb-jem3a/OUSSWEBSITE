import React, { useState } from 'react';
import {
  ArrowUpRight,
  Sparkles,
  Copy,
  Check,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { CREATOR_PROFILE } from '../data/projects';

export const ContactFooter: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(CREATOR_PROFILE.socialLinks.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(CREATOR_PROFILE.socialLinks.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <footer id="contact" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#060608]">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-t from-red-600/[0.05] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-400 mb-4">
            <Sparkles size={12} className="text-zinc-300" />
            <span>DIRECT CONTACT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Have a project in mind?{' '}
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
              Let’s create together.
            </span>
          </h2>

          <p className="mt-4 text-zinc-400 text-base sm:text-lg">
            For commercial reels, cinematography, and collaborations, reach out directly.
          </p>
        </div>

        {/* Centered & Balanced Direct Contact Cards */}
        <div className="max-w-xl mx-auto flex flex-col gap-4 sm:gap-5">
          
          {/* Direct Email Card with One-Click Copy */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101013] border border-white/[0.08] hover:border-red-500/30 transition-all duration-300 shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>Direct Email</span>
              <span className="flex items-center gap-2 text-red-400 text-[11px] font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </span>
                Available for projects
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-white break-all tracking-tight my-2">
              {CREATOR_PROFILE.socialLinks.email}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleCopyEmail}
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                {copiedEmail ? (
                  <>
                    <Check size={14} className="text-red-600" />
                    <span className="text-red-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${CREATOR_PROFILE.socialLinks.email}`}
                className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/15 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/[0.08]"
              >
                <span>Open Mail App</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Direct Phone & WhatsApp Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101013] border border-white/[0.08] hover:border-red-500/30 transition-all duration-300 shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>Direct Phone & WhatsApp</span>
              <span className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Algeria (+213)
              </span>
            </div>

            <div className="my-2">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {CREATOR_PROFILE.socialLinks.phone}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Copy Number */}
              <button
                onClick={handleCopyPhone}
                className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                {copiedPhone ? (
                  <>
                    <Check size={14} className="text-red-600" />
                    <span className="text-red-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Number</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp */}
              <a
                href={CREATOR_PROFILE.socialLinks.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] hover:text-[#3fe47f] text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#25D366]/30 hover:border-[#25D366]/60 active:scale-95 cursor-pointer shadow-sm"
              >
                <WhatsAppIcon size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Direct Instagram Link Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#101013] border border-white/[0.08] shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Instagram
            </div>

            <a
              href={CREATOR_PROFILE.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 rounded-2xl bg-black/50 hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 transition-all text-zinc-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-200 group-hover:text-white group-hover:scale-105 transition-all">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Instagram Profile</div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">
                    {CREATOR_PROFILE.socialLinks.instagramHandle}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Location Pill */}
          <div className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101013] border border-white/[0.08] text-xs font-mono text-zinc-400 shadow-md">
            <MapPin size={14} className="text-zinc-300 shrink-0" />
            <span>Based in Tlemcen, Algeria</span>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © 2026 Oussama Brahami. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Filmmaker & Cinematographer</span>
            <span>•</span>
            <a href="#" className="hover:text-zinc-300 transition-colors">Back to top ↑</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
