"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Menu, X, FileText, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200";
    const activeClass = "bg-blue-600 text-white shadow-lg shadow-blue-600/20";
    const inactiveClass = "text-stone-500 hover:text-stone-800 hover:bg-stone-50";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex min-h-screen bg-[#FFFAF5] font-sans">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 z-30 flex items-center justify-between px-5">
        <Link href="/" onClick={closeMenu}>
          <Image src="/SmallLogo.png" alt="snapHire Logo" width={120} height={30} className="h-7 w-auto" priority />
        </Link>
        <button onClick={toggleMenu} className="text-stone-600 p-2 hover:bg-stone-50 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={closeMenu}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-[280px] bg-white border-r border-stone-200 flex flex-col shrink-0 z-50 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* SIDEBAR HEADER */}
        <div className="p-6 h-16 md:h-[88px] flex items-center justify-between border-b border-stone-100">
          <Link href="/" onClick={closeMenu}>
            <Image src="/SmallLogo.png" alt="snapHire Logo" width={140} height={36} className="h-8 w-auto hidden md:block" priority />
            <Image src="/SmallLogo.png" alt="snapHire Logo" width={120} height={30} className="h-7 w-auto md:hidden" priority />
          </Link>
          
          {/* TOMBOL CLOSE (X) DENGAN HOVER MERAH */}
          <button 
            onClick={closeMenu} 
            className="md:hidden p-2 rounded-xl transition-all duration-200 
                       text-stone-400 
                       hover:text-red-600 hover:bg-red-50 
                       active:text-red-700 active:bg-red-100"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* NAVIGATION */}
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <Link href="/admin" onClick={closeMenu} className={getMenuClass('/admin')}>
            <LayoutDashboard size={20} />
            Dashboard Admin
          </Link>

          <Link href="/admin/users" onClick={closeMenu} className={getMenuClass('/admin/users')}>
            <Users size={20} />
            User Management
          </Link>

          <Link href="/admin/logs" onClick={closeMenu} className={getMenuClass('/admin/logs')}>
            <FileText size={20} />
            Activity Logs
          </Link>
        </nav>

        {/* LOGOUT AT BOTTOM */}
        <div className="p-4 border-t border-stone-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut size={20} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
      
    </div>
  );
}