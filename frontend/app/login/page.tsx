"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Pemanggilan API Supabase untuk verifikasi kredensial
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Jika berhasil, redirect ke beranda (atau nantinya ke Dashboard Kandidat)
      router.push('/');
      
    } catch (error: any) {
      setErrorMsg('Email atau kata sandi tidak valid. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        <div className="hidden md:flex flex-col items-center justify-center w-full">
          <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
            <Image src="/ilustrasi.png" alt="Ilustrasi Login" fill priority className="object-contain" />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
            
            <div className="flex flex-col items-center mb-8">
              <Link href="/">
                <Image src="/SmallLogo.png" alt="Logo" width={150} height={40} className="w-auto h-8 mb-3 cursor-pointer" priority />
              </Link>
              <p className="text-slate-500 text-sm font-medium">Selamat datang kembali</p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Alamat Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Kata Sandi</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors mt-4 shadow-lg shadow-blue-600/20 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Login'
                )}
              </button>

            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider">ATAU</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}