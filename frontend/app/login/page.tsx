import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center p-4 md:p-8 font-sans">
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* KOLOM KIRI: Ilustrasi (Hanya muncul di desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center w-full">
          <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
            <Image 
              src="/ilustrasi.png" 
              alt="Ilustrasi Login snapHire" 
              fill 
              priority 
              className="object-contain" 
            />
          </div>
        </div>

        {/* KOLOM KANAN: Form Login */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
            
            {/* Header Form */}
            <div className="flex flex-col items-center mb-8">
              <Link href="/">
                <Image 
                  src="/SmallLogo.png" 
                  alt="snapHire Logo" 
                  width={150} 
                  height={40} 
                  className="w-auto h-8 mb-3 cursor-pointer" 
                  priority
                />
              </Link>
              <p className="text-slate-500 text-sm font-medium">Selamat Datang Kembali!</p>
            </div>

            {/* Form Input */}
            <form className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Alamat Email</label>
                <input 
                  type="email" 
                  placeholder="contoh@gmail.com" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Kata Sandi</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Checkbox Ingat Saya & Lupa Kata Sandi */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="remember"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer select-none">
                    Ingat saya
                  </label>
                </div>
                <Link href="#" className="text-sm text-blue-600 font-semibold hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>

              {/* Tombol Login Utama */}
              <button 
                type="button" 
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors mt-4 shadow-lg shadow-blue-600/20"
              >
                Login
              </button>

            </form>

            {/* Divider "ATAU" */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider">ATAU</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Tombol Login dengan Google */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors">
              <Image 
                src="/google.png" 
                alt="Logo Google" 
                width={20} 
                height={20} 
                className="w-5 h-5 object-contain"
              />
              Daftar dengan Google
            </button>

            {/* Link ke Register */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}