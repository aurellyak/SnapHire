"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { UserPlus, Users, Mail, Lock, User, ShieldCheck, Search, Trash2, BadgeCheck } from 'lucide-react';

export default function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Form Registrasi HR
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setUsers(data);
    setIsLoading(false);
  };

  const handleCreateHR = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'hr' // Paksa role jadi HR
          }
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: `Akun HR untuk ${formData.fullName} berhasil dibuat!` });
      setFormData({ fullName: '', email: '', password: '' });
      fetchUsers(); // Refresh list setelah buat akun
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Manajemen User</h1>
          <p className="text-stone-500 font-medium">Kelola akses dan otoritas akun snapHire</p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Users size={18} /> Daftar User
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <UserPlus size={18} /> Registrasi HR
          </button>
        </div>
      </div>

      {/* CONTENT: DAFTAR USER */}
      {activeTab === 'list' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none font-bold text-stone-900"
            />
          </div>

          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-stone-900 font-black">{user.name}</p>
                          <p className="text-stone-400 text-sm font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'hr' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                        <BadgeCheck size={16} /> Aktif
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENT: REGISTRASI HR */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-2xl shadow-blue-900/5">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-black text-stone-900">Registrasi Akun HR</h2>
              <p className="text-stone-500 font-medium mt-2">Buat akun akses internal untuk tim Recruitment</p>
            </div>

            {message.text && (
              <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreateHR} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-stone-800 ml-1">Nama Lengkap HR</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="text" required value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 font-bold focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:font-normal"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-stone-800 ml-1">Email Kerja</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="email" required value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 font-bold focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:font-normal"
                    placeholder="email@snaphire.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-stone-800 ml-1">Password Sementara</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="password" required value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-2xl text-stone-900 font-bold focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:font-normal"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 disabled:bg-stone-300 flex justify-center items-center gap-3 text-lg"
              >
                {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : 'Aktifkan Akun HR'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}