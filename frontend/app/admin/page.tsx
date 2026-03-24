"use client";

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Bot, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    candidates: 0,
    hrUsers: 0,
    activeJobs: 0,
    processedCVs: 0
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { count: candidatesCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true });
        const { count: hrCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).ilike('role', '%hr%');
        const { count: activeJobsCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).ilike('status_job', 'open');
        const { count: applicationsCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });

        setMetrics({
          candidates: candidatesCount || 0,
          hrUsers: hrCount || 0,
          activeJobs: activeJobsCount || 0,
          processedCVs: applicationsCount || 0
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const { data: appsData } = await supabase.from('applications').select('created_at').gte('created_at', sevenDaysAgo.toISOString());

        if (appsData) {
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
          });

          const counts: Record<string, number> = {};
          last7Days.forEach(date => counts[date] = 0);

          appsData.forEach(app => {
            const date = new Date(app.created_at).toISOString().split('T')[0];
            if (counts[date] !== undefined) counts[date]++;
          });

          const formattedChart = last7Days.map(date => {
            const d = new Date(date);
            return { name: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), pelamar: counts[date] };
          });
          setChartData(formattedChart);
        }

        const { data: logsData } = await supabase.from('activity_logs').select(`log_id, timestamp, activity, users ( name )`).order('timestamp', { ascending: false }).limit(5);
        if (logsData) setLogs(logsData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 pb-4 border-b border-stone-200">
        <h1 className="text-3xl font-bold text-stone-800">Dashboard & Overview</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <span className="text-blue-600 font-bold text-sm md:text-base">Total Kandidat</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-extrabold text-stone-800">{metrics.candidates}</span>
                <Users className="text-stone-300" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <span className="text-blue-600 font-bold text-sm md:text-base">Total Akun HR</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-extrabold text-stone-800">{metrics.hrUsers}</span>
                <Users className="text-stone-300" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <span className="text-blue-600 font-bold text-sm md:text-base">Lowongan Aktif</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-extrabold text-stone-800">{metrics.activeJobs}</span>
                <Briefcase className="text-stone-300" size={32} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4">
              <span className="text-blue-600 font-bold text-sm md:text-base">CV Terproses AI</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-4xl font-extrabold text-stone-800">{metrics.processedCVs}</span>
                <Bot className="text-stone-300" size={32} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8">
            <h3 className="text-stone-800 font-semibold mb-6">Grafik Tren Pelamar (7 Hari Terakhir)</h3>
            <div className="w-full h-[300px] text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPelamar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="pelamar" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPelamar)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-stone-800 font-semibold flex items-center gap-2">
                <Activity size={20} className="text-stone-400" />
                Activity Log
              </h3>
              <Link 
                href="/admin/logs" 
                className="bg-[#1A56DB] hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-600 whitespace-nowrap">
                <thead>
                  <tr className="border-b-2 border-stone-200 text-stone-800">
                    <th className="pb-3 font-semibold px-4">Timestamp</th>
                    <th className="pb-3 font-semibold px-4">User</th>
                    <th className="pb-3 font-semibold px-4 w-full">Activity Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {logs.length > 0 ? logs.map((log) => {
                    const date = new Date(log.timestamp);
                    const formattedDate = `[${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}]`;
                    const userName = log.users?.name || 'Unknown User';
                    
                    return (
                      <tr key={log.log_id} className="hover:bg-[#FFFAF5] transition-colors">
                        <td className="py-4 px-4 text-stone-400">{formattedDate}</td>
                        <td className="py-4 px-4 font-medium text-stone-700">[{userName}]</td>
                        <td className="py-4 px-4">{log.activity}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-stone-400">Belum ada aktivitas terekam.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}