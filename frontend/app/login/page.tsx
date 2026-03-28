"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // CHECK: Apakah sudah ada session active di localStorage
  useEffect(() => {
    const checkExistingSession = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('[LOGIN] ✅ Found active session:', userData.email);
          setHasActiveSession(true);
          setActiveUser(userData);
        } catch (err) {
          console.log('[LOGIN] Invalid stored user data');
          setHasActiveSession(false);
          setActiveUser(null);
        }
      }
      setIsCheckingSession(false);
    };

    checkExistingSession();
  }, []);

  // SYNC: Detect logout/login di tab lain
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Jika token dihapus/berubah di tab lain, auto refresh page
      if (event.key === 'token' && !event.newValue) {
        console.log('[LOGIN] Token dihapus di tab lain, refresh page...');
        window.location.href = '/login';
      }
      // Jika user berubah di tab lain (login user berbeda)
      if (event.key === 'user' && event.newValue !== event.oldValue) {
        console.log('[LOGIN] User berbeda login di tab lain, refresh page...');
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // 1. Login ke Auth Supabase (dapatkan JWT token)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // 2. Dapatkan JWT session token dari Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.access_token) {
        throw new Error('Gagal mendapatkan token dari Supabase');
      }

      const token = sessionData.session.access_token;

      // 3. Call backend /login API dengan JWT token
      // Backend akan verify token dan return user role via middleware
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const loginData = await response.json();
      const userData = loginData.data;

      // 4. Simpan JWT token ke localStorage untuk API calls berikutnya
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log(`[LOGIN] ✅ Token saved for: ${userData?.email} (${userData?.role})`);
      }

      // 5. CATAT KE ACTIVITY LOGS (PENTING!)
      const { error: logError } = await supabase.from('activity_logs').insert({
        user_id: authData.user.id,
        activity: `LOGIN: ${userData?.name || 'User'} masuk sebagai ${userData?.role || 'user'}`
      });

      // Debugging: Jika log gagal masuk, muncul di console browser
      if (logError) console.error("Gagal mencatat log:", logError.message);

      // 6. LOGIKA PENGALIHAN (Redirect) berdasarkan role dari backend
      const role = userData?.role?.toLowerCase();
      router.refresh();

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'hr') {
        router.push('/hr');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Login Error:", error.message);
      setErrorMsg('Email atau kata sandi salah. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* ILUSTRASI SISI KIRI */}
        <div className="hidden md:flex flex-col items-center justify-center w-full">
          <div className="relative w-full max-w-[500px] aspect-square">
            <Image 
              src="/ilustrasi.png" 
              alt="Ilustrasi Login" 
              fill priority 
              className="object-contain drop-shadow-2xl" 
            />
          </div>
          <div className="mt-8 text-center px-6">
            <h2 className="text-2xl font-black text-stone-800 tracking-tight">Cepat. Tepat. Transparan.</h2>
            <p className="text-stone-500 mt-2 font-medium">Platform HR automation paling cerdas untuk tim kamu.</p>
          </div>
        </div>

        {/* FORM SISI KANAN */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 sm:p-10">
            
            <div className="flex flex-col items-center mb-10 text-center">
              <Link href="/">
                <Image src="/SmallLogo.png" alt="Logo" width={150} height={40} className="w-auto h-9 mb-4" priority />
              </Link>
              <h1 className="text-xl font-black text-stone-900 tracking-tight">Selamat datang kembali</h1>
              <div className="h-1.5 w-10 bg-blue-600 rounded-full mt-3"></div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Mail size={14} className="text-blue-600" /> Alamat Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@snaphire.com" 
                  className="w-full px-5 py-4 rounded-2xl border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-stone-300"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <Lock size={14} className="text-blue-600" /> Kata Sandi
                  </label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Lupa sandi?</Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 rounded-2xl border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-stone-300"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-black py-4.5 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all mt-2 shadow-xl shadow-blue-600/25 disabled:bg-blue-400 flex justify-center items-center gap-2 text-lg"
              >
                {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : <><LogIn size={20} /> Masuk Sekarang</>}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-stone-100"></div>
              <span className="text-[10px] font-black text-stone-300 tracking-[0.2em]">ATAU</span>
              <div className="flex-1 h-px bg-stone-100"></div>
            </div>

            <p className="text-center text-sm text-stone-500 font-medium">
              Belum punya akun? <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-4">Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}