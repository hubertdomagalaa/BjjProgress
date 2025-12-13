'use client';

import React from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050a14] text-white font-sans selection:bg-purple-500/30">
      {/* Navbar - Ultra Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#050a14]/70 border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
              <Image src="/app-icon.jpg" alt="Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">BJJ Progress</span>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Get App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6">
            PRO IS FREE FOR THE FIRST 1000 USERS
          </div>
          
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
            Track Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">
              Evolution.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light">
            The minimalist training log for BJJ athletes. <br className="hidden md:block" />
            Visualize progress. Analyze stats. Get promoted.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <DownloadButton store="App Store" icon={<Download size={20} />} primary />
            <DownloadButton store="Google Play" icon={<Download size={20} />} />
          </div>
        </motion.div>

        {/* Hero Phone */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto max-w-[280px] md:max-w-[320px]"
        >
          <PhoneFrame src="/screenshots/home-trainings.jpg" />
        </motion.div>
      </section>

      {/* Gallery Section - "More Screenshots" */}
      <section className="px-6 py-24 bg-[#080c19]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold mb-2">See Inside</h2>
            <p className="text-gray-500 text-sm">Clean, dark, and data-driven.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
            <GalleryItem 
              src="/screenshots/stats-overview.jpg" 
              label="Training Overview" 
              desc="Track volume & consistency"
            />
            <GalleryItem 
              src="/screenshots/stats-sweeps.jpg" 
              label="Advanced Analytics" 
              desc="Analyze sweeps & submissions"
            />
            <GalleryItem 
              src="/screenshots/settings-belt.jpg" 
              label="Belt Tracking" 
              desc="Visualize your promotion path"
            />
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="px-6 py-24 bg-[#050a14] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Join the Inner Circle</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Shape the future of BJJ Progress. Join our Telegram community to suggest features, 
            report bugs, and chat with other users.
          </p>
          
          <a 
            href="https://t.me/bjjprogress" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
          >
            <span>Join Telegram Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 text-center text-gray-600 text-xs border-t border-white/5">
        <p className="mb-4">&copy; 2025 BJJ Progress.</p>
        <div className="flex justify-center gap-6">
          <a href="mailto:support@bjjprogress.app" className="hover:text-white transition-colors">Contact</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </main>
  );
}

function PhoneFrame({ src }: { src: string }) {
  return (
    <div className="relative bg-[#1e293b] border-[6px] border-[#2d3748] rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden">
      <div className="aspect-[9/19] relative bg-[#0f172a]">
        <Image src={src} alt="App Screenshot" fill className="object-cover" />
      </div>
    </div>
  );
}

function GalleryItem({ src, label, desc }: { src: string, label: string, desc: string }) {
  return (
    <div className="flex flex-col items-center gap-6 group">
      <div className="relative w-[260px] transition-transform duration-500 group-hover:-translate-y-2">
        <PhoneFrame src={src} />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-white mb-1">{label}</h3>
        <p className="text-gray-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}

function DownloadButton({ store, icon, primary }: { store: string, icon: React.ReactNode, primary?: boolean }) {
  return (
    <button className={`
      w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95
      ${primary 
        ? 'bg-white text-black hover:bg-gray-200' 
        : 'bg-[#1e293b] text-white border border-white/10 hover:bg-[#2d3748]'}
    `}>
      {icon}
      <span>{store}</span>
    </button>
  );
}
