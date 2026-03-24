import React from 'react';
import Image from 'next/image';
import { Mail, Phone, Globe, Share2, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      {/* Grid Responsif: 1 kolom (HP), 2 kolom (Tablet), 4 kolom (PC) */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
        
        {/* Kolom Logo mengambil 2 tempat di Desktop, tapi 1 tempat di HP/Tablet */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-6">
            <Image 
              src="/SmallLogoLight.png" 
              alt="snapHire Logo" 
              width={140} 
              height={36} 
              className="w-auto h-8 opacity-90 hover:opacity-100 transition-opacity" 
            />
          </div>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Platform pencarian kerja masa depan untuk talenta digital di Indonesia. Menghubungkan potensi dengan kesempatan nyata.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100">Tentang Kami</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Visi & Misi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Budaya Kerja</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Tim Kami</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100">Kontak Kami</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-400">
            <li className="flex items-center gap-3"><Mail size={16} /> cs@snaphire.com</li>
            <li className="flex items-center gap-3"><Phone size={16} /> +62 812 3456 7890</li>
          </ul>
        </div>
      </div>

      {/* Bagian Copyright responsif (flex-col di HP) */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-xs text-slate-500">
          © 2026 snapHire. All rights reserved. Dibuat dengan cinta untuk masa depan karirmu.
        </p>
        <div className="flex items-center gap-6 md:gap-4 text-slate-400 mt-2 md:mt-0">
          <Globe size={18} className="hover:text-white cursor-pointer" />
          <Share2 size={18} className="hover:text-white cursor-pointer" />
          <AtSign size={18} className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}