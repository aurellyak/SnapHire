"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  Plus, Search, Edit2, Trash2, 
  MapPin, Loader2, X, CheckCircle2 
} from 'lucide-react';

export default function KelolaLowongan() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    work_type: 'On-site',
    employment_type: 'Full-time',
    status_job: 'active',
    salary_min: '',
    salary_max: '',
    description: '',
    requirement: ''
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error) setJobs(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  // LOGIKA WARNA SISTEM KERJA (On-site, Remote, Hybrid)
  const getWorkTypeStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'on-site': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'remote': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'hybrid': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  // LOGIKA WARNA TIPE PEKERJAAN (Full-time, Part-time, Contract, Internship)
  const getEmpTypeStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'part-time': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'contract': return 'bg-stone-600 text-white border-stone-700'; // Sesuai gambar: lebih gelap
      case 'internship': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (job: any = null) => {
    if (job) {
      setEditingId(job.job_id);
      setFormData({
        title: job.title,
        department: job.department || '',
        location: job.location || '',
        work_type: job.work_type || 'On-site',
        employment_type: job.employment_type || 'Full-time',
        status_job: job.status_job || 'active',
        salary_min: job.salary_min?.toString() || '',
        salary_max: job.salary_max?.toString() || '',
        description: job.description || '',
        requirement: job.requirement || ''
      });
    } else {
      setEditingId(null);
      setFormData({ 
        title: '', department: '', location: '', 
        work_type: 'On-site', employment_type: 'Full-time', 
        status_job: 'active', salary_min: '', salary_max: '', 
        description: '', requirement: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert("Sesi habis, silakan login ulang."); return; }

      const payload = { 
        ...formData, 
        created_by: user.id,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
      };

      let error;
      if (editingId) {
        const { error: err } = await supabase.from('jobs').update(payload).eq('job_id', editingId);
        error = err;
      } else {
        const { error: err } = await supabase.from('jobs').insert([payload]);
        error = err;
      }

      if (error) alert(`Gagal simpan: ${error.message}`);
      else { setIsModalOpen(false); fetchJobs(); }
    } catch (err) { alert("Terjadi kesalahan sistem."); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin mau hapus lowongan ini?")) {
      const { error } = await supabase.from('jobs').delete().eq('job_id', id);
      if (!error) fetchJobs();
    }
  };

  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase">Kelola Lowongan</h1>
          <p className="text-stone-500 mt-1">Total {jobs.length} lowongan aktif di sistem.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest">
          <Plus size={18} /> Tambah Lowongan
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text" placeholder="Cari berdasarkan judul lowongan..." 
          className="w-full pl-14 pr-6 py-5 bg-white border border-stone-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm font-medium text-stone-800"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[48px] border border-stone-100 shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-stone-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Lowongan</th>
                <th className="px-10 py-6 text-right pr-14">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr><td colSpan={2} className="p-32 text-center"><Loader2 className="animate-spin inline text-blue-600" size={40} /></td></tr>
              ) : filteredJobs.length === 0 ? (
                <tr><td colSpan={2} className="p-20 text-center text-stone-400 font-bold">Tidak ada lowongan ditemukan.</td></tr>
              ) : filteredJobs.map((job) => (
                <tr key={job.job_id} className="hover:bg-stone-50/40 transition-all duration-300 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8 justify-between w-full">
                      
                      {/* Bagian Kiri: Title & Location */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="font-black text-stone-800 text-xl tracking-tight leading-none group-hover:text-blue-600 transition-colors">{job.title}</div>
                        <span className="text-stone-300 font-light text-2xl">•</span>
                        <div className="flex items-center gap-2 text-stone-400 font-bold text-sm whitespace-nowrap">
                          <MapPin size={16} className="text-blue-400" />
                          {job.location}
                        </div>
                      </div>

                      {/* Bagian Tengah: Badges */}
                      <div className="flex items-center gap-4">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${getWorkTypeStyles(job.work_type)}`}>
                          {job.work_type}
                        </span>
                        <span className="text-stone-300 font-light text-2xl">•</span>
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${getEmpTypeStyles(job.employment_type)}`}>
                          {job.employment_type}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* Bagian Kanan: Aksi */}
                  <td className="px-10 py-8 text-right pr-12">
                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(job)} className="p-3 text-stone-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent"><Edit2 size={20}/></button>
                      <button onClick={() => handleDelete(job.job_id)} className="p-3 text-stone-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent"><Trash2 size={20}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Sudah dioptimasi) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-stone-900/60 backdrop-blur-md transition-all">
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 p-12 overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight uppercase">{editingId ? 'Edit Data' : 'Buat Lowongan'}</h2>
                <p className="text-stone-500 text-sm font-medium mt-1">Lengkapi informasi lowongan pekerjaan.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-stone-100 rounded-full transition-colors"><X size={28} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-32">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Judul Lowongan Pekerjaan</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-stone-800 transition-all" placeholder="e.g. Lead Product Designer" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Departemen</label>
                  <input name="department" value={formData.department} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="Design / Tech" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Tipe Pekerjaan</label>
                  <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Lokasi (Kota, Negara)</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:border-blue-500 font-bold" placeholder="Jakarta, Indonesia" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Sistem Kerja</label>
                  <select name="work_type" value={formData.work_type} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Gaji Minimal (IDR)</label>
                  <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl" placeholder="Min" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Gaji Maksimal (IDR)</label>
                  <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl" placeholder="Max" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Deskripsi Pekerjaan</label>
                <textarea rows={5} name="description" value={formData.description} onChange={handleChange} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:border-blue-500" placeholder="Tulis rincian pekerjaan..." />
              </div>

              {/* ACTION BUTTONS (STICKY) */}
              <div className="fixed bottom-0 right-0 w-full max-w-2xl p-8 bg-white/80 backdrop-blur-md border-t border-stone-100 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-stone-400 uppercase text-[12px] tracking-widest hover:text-stone-600 transition-colors">Batal</button>
                <button disabled={isSubmitting} type="submit" className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-[32px] hover:bg-blue-700 flex justify-center items-center gap-3 shadow-xl shadow-blue-600/30 uppercase text-[12px] tracking-widest transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingId ? 'Simpan Perubahan' : 'Posting Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}