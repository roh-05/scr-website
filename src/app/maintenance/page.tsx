// src/app/maintenance/page.tsx
import { TrendingUp, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ac9741] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3D5A80] rounded-full blur-[120px]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo Container */}
        <div className="inline-flex items-center gap-4 mb-12 p-2 px-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="w-12 h-12 bg-[#ac9741] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(172,151,65,0.4)]">
            <TrendingUp size={28} className="text-[#0f172a]" strokeWidth={3} />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black text-white tracking-widest leading-none">SURREY CAPITAL</h1>
            <p className="text-[10px] text-[#ac9741] font-bold tracking-[0.2em] uppercase">Research • Excellence</p>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
          Institutional Insight <br/>
          <span className="text-[#ac9741]">Coming Soon</span>
        </h2>
        
        <div className="w-24 h-1 bg-[#ac9741] mx-auto mb-10 rounded-full" />

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto font-light">
          We are currently upgrading our research portal to bring you institutional-grade market analysis and a more seamless experience.
        </p>

        {/* Action / Social Link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Link 
            href="https://linkedin.com/company/surrey-capital-research" 
            target="_blank"
            className="flex items-center gap-3 px-8 py-4 bg-white text-[#0f172a] rounded-full font-bold transition-all hover:bg-[#ac9741] hover:text-white hover:scale-105 active:scale-95 shadow-xl group"
          >
            <Image 
              src="/linkedin.svg" 
              alt="LinkedIn" 
              width={20} 
              height={20} 
              className="transition-all group-hover:brightness-0 group-hover:invert" 
            /> Stay Updated
          </Link>
          <a 
            href="mailto:contact@surreycapital.org"
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <Mail size={20} /> Contact Us
          </a>
        </div>

        {/* Footer info */}
        <div className="text-gray-500 text-sm font-medium tracking-wide">
          © 2025 Surrey Capital Research. University of Surrey.
        </div>
      </div>

      {/* Subtle Admin Link */}
      <Link 
        href="/admin" 
        className="absolute bottom-8 right-8 text-white/10 hover:text-white/40 transition-colors text-xs font-mono"
      >
        Portal Access
      </Link>
    </div>
  );
}
