import React from 'react';
import { UserCircle, Search, Sparkles } from 'lucide-react';

export default function RecruitmentProcess() {
  return (
    <section className="bg-white py-24 mt-12 border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Proses Rekrutmen Kami</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Langkah transparan menuju karir baru Anda di snapHire.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border-[8px] border-white shadow-sm z-10 relative">
                <UserCircle size={32} />
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20">1</div>
            </div>
            <h3 className="font-bold text-xl mb-3">Buat Profil</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Lengkapi data diri dan portofoliomu. Biarkan sistem kami mencocokkan profilmu dengan posisi yang tepat.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 border-[8px] border-white shadow-sm z-10 relative">
                <Search size={32} />
              </div>
              <div className="absolute -top-2 -right-2 bg-teal-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20">2</div>
            </div>
            <h3 className="font-bold text-xl mb-3">Review Internal</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Tim rekrutmen kami akan meninjau profil dan portofoliomu dengan cermat untuk memastikan kesesuaian dengan budaya kerja kami.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border-[8px] border-white shadow-sm z-10 relative">
                <Sparkles size={32} />
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20">3</div>
            </div>
            <h3 className="font-bold text-xl mb-3">Mulai Berkontribusi</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Selesaikan proses interview, terima penawaran, dan mulailah perjalananmu untuk memberikan dampak nyata bersama kami.</p>
          </div>
        </div>
      </div>
    </section>
  );
}