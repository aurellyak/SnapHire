"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, Users, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // State untuk mengontrol buka/tutup menu di mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-[#FFFAF5] font-sans">
      
      {/* 1. MOBILE HEADER (Hanya tampil di layar kecil) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 z-30 flex items-center justify-between px-5">
        <Link href="/" onClick={closeMenu}>
          <Image src="/SmallLogo.png" alt="snapHire Logo" width={120} height={30} className="h-7 w-auto" priority />
        </Link>
        <button onClick={toggleMenu} className="text-stone-600 hover:text-blue-600 transition-colors p-1">
          <Menu size={24} />
        </button>
      </div>

      {/* 2. OVERLAY GELAP (Hanya tampil saat menu mobile terbuka) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={closeMenu}
        ></div>
      )}

      {/* 3. SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-[280px] bg-white border-r border-stone-200 flex flex-col shrink-0 z-50 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-16 md:h-[88px] flex items-center justify-between border-b border-stone-100">
          <Link href="/" onClick={closeMenu}>
            {/* Logo beda ukuran untuk Desktop vs Mobile */}
            <Image src="/SmallLogo.png" alt="snapHire Logo" width={140} height={36} className="h-8 w-auto hidden md:block" priority />
            <Image src="/SmallLogo.png" alt="snapHire Logo" width={120} height={30} className="h-7 w-auto md:hidden" priority />
          </Link>
          
          {/* Tombol Close (X) di dalam sidebar mobile */}
          <button onClick={closeMenu} className="md:hidden text-stone-400 hover:text-stone-700 bg-stone-50 hover:bg-stone-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          {/* Tambahkan onClick={closeMenu} agar sidebar otomatis tertutup setelah menu dipilih di HP */}
          <Link href="/admin" onClick={closeMenu} className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium shadow-md shadow-blue-600/20 transition-all">
            <LayoutDashboard size={20} />
            Dashboard Admin
          </Link>
          <Link href="/admin/users" onClick={closeMenu} className="flex items-center gap-3 text-stone-500 hover:text-stone-800 hover:bg-[#FFFAF5] px-4 py-3 rounded-xl font-medium transition-all">
            <Users size={20} />
            User Management
          </Link>
        </nav>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0">
        {children}
      </main>
      
    </div>
  );
}