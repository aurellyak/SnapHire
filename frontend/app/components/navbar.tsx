"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Tambahkan relative dan z-50 agar navbar selalu berada paling atas
    <header className="w-full px-5 md:px-8 py-4 md:py-6 flex items-center justify-between max-w-7xl mx-auto relative z-50">
      
      {/* Logo - kita bungkus dengan relative z-50 agar tetap di atas overlay */}
      <div className="flex items-center cursor-pointer relative z-50">
        <Image 
          src="/SmallLogo.png" 
          alt="snapHire Logo" 
          width={140} 
          height={36} 
          priority 
          className="w-auto h-7 md:h-10" 
        />
      </div>
      
      {/* Menu Tengah (Hanya muncul di Desktop) */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-blue-600 transition-colors">Cari Lowongan</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Tips Karir</a>
      </nav>

      {/* Tombol Kanan (Hanya muncul di Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <button className="text-sm font-semibold hover:text-blue-600 px-4">Login</button>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
          Register
        </button>
      </div>

      {/* Hamburger Menu Toggle (Hanya muncul di Mobile) */}
      <button 
        className="md:hidden text-slate-900 hover:text-blue-600 transition-colors relative z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* --- OVERLAY BACKGROUND TRANSPARAN --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)} // Jika user klik area gelap, menu otomatis tertutup
        ></div>
      )}

      {/* --- POP-UP MENU FLOATING CARD --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-5 right-5 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-50 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in duration-200">
          <nav className="flex flex-col gap-2 text-base font-medium text-slate-700">
            <a href="#" className="hover:text-blue-600 transition-colors py-3 border-b border-slate-50">Cari Lowongan</a>
            <a href="#" className="hover:text-blue-600 transition-colors py-3 border-b border-slate-50">Tips Karir</a>
          </nav>
          
          <div className="flex flex-col gap-3 mt-2">
            <button className="w-full border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl text-sm font-semibold hover:bg-slate-50 transition-colors">
              Login
            </button>
            <button className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Register
            </button>
          </div>
        </div>
      )}
      
    </header>
  );
}