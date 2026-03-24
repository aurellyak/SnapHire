"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Search, UserCog, ShieldCheck, UserMinus, X, Save } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Membuka modal dan mengisi data user yang dipilih
  const openEditModal = (user: any) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  // Menyimpan perubahan ke Supabase
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: editingUser.name,
          role: editingUser.role,
          is_active: editingUser.is_active
        })
        .eq('user_id', editingUser.user_id);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchUsers(); // Refresh tabel
      alert('Data user berhasil diperbarui!');
    } catch (error: any) {
      alert('Gagal memperbarui data: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="mb-8 pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">User Management</h1>
          <p className="text-stone-500 mt-1">Kelola hak akses dan peran seluruh pengguna sistem.</p>
        </div>
        
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
            <input 
                type="text"
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm placeholder:text-stone-400 placeholder:font-normal"
            />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600 whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-stone-200 text-stone-800 bg-stone-50/50">
                <th className="py-4 px-6 font-semibold">Nama Pengguna</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-[#FFFAF5] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-800">{user.name}</div>
                      <div className="text-xs text-stone-400">ID: {user.user_id.slice(0,8)}...</div>
                    </td>
                    <td className="py-4 px-6 font-medium">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role?.toLowerCase() === 'hr' ? 'bg-blue-100 text-blue-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {user.role || 'Candidate'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-stone-700">{user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
                        >
                          <UserCog size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-stone-400">Tidak ada pengguna ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL EDIT --- */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Edit Profil User</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveUpdate} className="space-y-5">
                {/* Input Nama */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-stone-800 uppercase tracking-tight">Nama Lengkap</label>
                    <input 
                        type="text"
                        required
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-950 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                </div>

                {/* Info Email (Read Only) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-stone-700">Email (ID Login)</label>
                  <input 
                    type="text"
                    disabled
                    value={editingUser.email}
                    className="w-full px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed"
                  />
                </div>

                {/* Pilih Role */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-stone-800 uppercase tracking-tight">Hak Akses (Role)</label>
                    <select 
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-950 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all bg-white cursor-pointer"
                    >
                        <option value="candidate">Candidate</option>
                        <option value="hr">HR Personnel</option>
                        <option value="admin">Super Admin</option>
                    </select>
                </div>

                {/* Toggle Status */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div>
                    <div className="font-semibold text-stone-800 italic">Status Akun</div>
                    <div className="text-xs text-stone-500">Nonaktifkan untuk memutus akses login.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingUser({...editingUser, is_active: !editingUser.is_active})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${editingUser.is_active ? 'bg-green-500' : 'bg-stone-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingUser.is_active ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={18} /> Simpan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}