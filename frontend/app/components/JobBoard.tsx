import React from 'react';
import { Sparkles, UserCircle, Bookmark, ArrowRight } from 'lucide-react';

export default function JobBoard() {
  return (
    // Padding kiri-kanan disesuaikan: px-5 di mobile, px-8 di desktop
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      
      {/* Header Responsif: Stack di mobile (flex-col), Sejajar di desktop (md:flex-row) */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Peluang Karir Terkini</h2>
          <p className="text-slate-500">Posisi terbuka di departemen kami.</p>
        </div>
        <a href="#" className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
          Lihat Semua <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">UI/UX Designer</h3>
          <p className="text-sm text-slate-500 mb-4">Jakarta, Indonesia</p>
          <div className="flex gap-2 mb-8">
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">FULL TIME</span>
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">REMOTE</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <p className="font-bold text-sm">IDR 12jt - 15jt</p>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <UserCircle size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1">Software Engineer</h3>
          <p className="text-sm text-slate-500 mb-4">Remote</p>
          <div className="flex gap-2 mb-8">
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">FULLTIME</span>
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">SENIOR</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <p className="font-bold text-sm">IDR 25jt - 35jt</p>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-1">Data Analyst</h3>
          <p className="text-sm text-slate-500 mb-4">Bandung, Indonesia</p>
          <div className="flex gap-2 mb-8">
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">CONTRACT</span>
            <span className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md">JUNIOR</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <p className="font-bold text-sm">IDR 8jt - 12jt</p>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}