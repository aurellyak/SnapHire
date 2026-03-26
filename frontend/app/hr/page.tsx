"use client";

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileCheck, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';

export default function HRDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataStats, setDataStats] = useState({
    totalKandidat: 0,
    totalHR: 0,
    lowonganAktif: 0,
    cvTerproses: 0
  });
  const [chartDataTren, setChartDataTren] = useState<{tanggal: string, pelamar: number}[]>([]);
  const [chartDataPosisi, setChartDataPosisi] = useState<{posisi: string, jumlah: number}[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil Angka Cards
        const { count: countKandidat } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'applicant');
        const { count: countHR } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'hr');
        const { count: countJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status_job', 'active');
        const { count: countCV } = await supabase.from('applications').select('*', { count: 'exact', head: true }).not('ai_score', 'is', null);

        setDataStats({
          totalKandidat: countKandidat || 0,
          totalHR: countHR || 0,
          lowonganAktif: countJobs || 0,
          cvTerproses: countCV || 0
        });

        // 2. Ambil Data Tren Pelamar (Berdasarkan tanggal dibuat di tabel applications)
        const { data: trendData } = await supabase
          .from('applications')
          .select('created_at');
        
        // Grouping data per tanggal (sederhana)
        const processTrend = trendData?.reduce((acc: any, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const formattedTrend = Object.keys(processTrend || {}).map(key => ({
          tanggal: key,
          pelamar: processTrend[key]
        })).slice(-7); // Ambil 7 hari terakhir

        setChartDataTren(formattedTrend.length > 0 ? formattedTrend : [{tanggal: 'No Data', pelamar: 0}]);

        // 3. Ambil Data Posisi Paling Diminati (Join applications ke jobs)
        const { data: positionData } = await supabase
          .from('applications')
          .select(`
            job_id,
            jobs ( title )
          `);

        const processPos = positionData?.reduce((acc: any, curr: any) => {
          const title = curr.jobs?.title || 'Unknown';
          acc[title] = (acc[title] || 0) + 1;
          return acc;
        }, {});

        const formattedPos = Object.keys(processPos || {}).map(key => ({
          posisi: key,
          jumlah: processPos[key]
        })).sort((a, b) => b.jumlah - a.jumlah).slice(0, 5); // Ambil Top 5

        setChartDataPosisi(formattedPos.length > 0 ? formattedPos : [{posisi: 'No Data', jumlah: 0}]);

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Kandidat", value: dataStats.totalKandidat, icon: <Users size={24} className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Total Akun HR", value: dataStats.totalHR, icon: <UserPlus size={24} className="text-indigo-600" />, bg: "bg-indigo-50" },
    { title: "Lowongan Aktif", value: dataStats.lowonganAktif, icon: <Briefcase size={24} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { title: "CV Terproses AI", value: dataStats.cvTerproses, icon: <FileCheck size={24} className="text-orange-600" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Dashboard</h1>
          <p className="text-stone-500 mt-1">Ringkasan aktivitas rekrutmen snapHire hari ini.</p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-stone-400 mb-1">{stat.title}</p>
                {isLoading ? (
                  <Loader2 size={28} className="text-stone-300 animate-spin mt-2" />
                ) : (
                  <h3 className="text-3xl font-black text-stone-800">{stat.value}</h3>
                )}
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION STATISTIK */}
      <div className="pt-4">
        <h2 className="text-2xl font-black text-stone-800 mb-6">Statistik</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* GRAFIK 1: AREA CHART */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-stone-800 mb-6 px-2">Grafik Tren Pelamar Harian</h3>
            <div className="flex-1 w-full h-full min-h-0">
              {isLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-stone-300" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataTren} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPelamar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#e7e5e4', strokeWidth: 2, strokeDasharray: '3 3' }}
                    />
                    <Area type="monotone" dataKey="pelamar" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPelamar)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* GRAFIK 2: BAR CHART */}
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-stone-800 mb-6 px-2">Posisi Paling Diminati</h3>
            <div className="flex-1 w-full h-full min-h-0">
              {isLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-stone-300" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartDataPosisi} 
                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }} 
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                    <YAxis 
                      dataKey="posisi" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#44403c', fontSize: 12, fontWeight: 600}} 
                      width={120} 
                    />
                    <RechartsTooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="jumlah" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}