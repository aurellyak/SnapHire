import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 relative z-20 mt-8 md:-mt-10 mb-16 md:mb-20">
      <div className="bg-white p-5 md:p-2.5 rounded-3xl md:rounded-full shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-4 md:gap-2">
        
        {/* Input 1: Posisi */}
        <div className="flex items-center gap-3 px-2 md:px-4 py-2 w-full">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input 
            type="text" 
            placeholder="Posisi, skill, atau perusahaan..." 
            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
          />
        </div>
        
        {/* Garis Pembatas */}
        <div className="hidden md:block w-px h-8 bg-slate-200 shrink-0"></div>
        <div className="md:hidden w-full h-px bg-slate-100"></div>
        
        {/* Input 2: Lokasi */}
        <div className="flex items-center gap-3 px-2 md:px-4 py-2 w-full">
          <MapPin className="text-slate-400 shrink-0" size={20} />
          <input 
            type="text" 
            placeholder="Lokasi (Jakarta, Remote...)" 
            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
          />
        </div>
        
        {/* Tombol Cari - Ditambahkan whitespace-nowrap dan shrink-0 */}
        <button className="bg-blue-600 text-white px-8 py-3.5 md:py-3 rounded-2xl md:rounded-full text-sm font-semibold hover:bg-blue-700 w-full md:w-auto transition-colors mt-2 md:mt-0 whitespace-nowrap shrink-0">
          Cari Sekarang
        </button>
      </div>
    </div>
  );
}