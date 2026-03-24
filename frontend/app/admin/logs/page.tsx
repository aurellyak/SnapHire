"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        // Ambil semua log (tidak dilimit) + join ke tabel users
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            log_id,
            timestamp,
            activity,
            users ( name )
          `)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        if (data) setLogs(data);

      } catch (error) {
        console.error("Error fetching all activity logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllLogs();
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Halaman */}
      <div className="mb-8 pb-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Activity Log</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600 whitespace-nowrap">
              <thead>
                <tr className="border-b-2 border-stone-200 text-slate-800">
                  <th className="py-4 px-6 font-semibold">Timestamp</th>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold w-full">Activity Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {logs.length > 0 ? logs.map((log) => {
                  const date = new Date(log.timestamp);
                  // Format tanggal persis seperti desain: [YYYY-MM-DD HH:mm:ss]
                  const formattedDate = `[${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}]`;
                  const userName = log.users?.name || 'Unknown User';
                  
                  return (
                    <tr key={log.log_id} className="hover:bg-[#FFFAF5] transition-colors">
                      <td className="py-4 px-6 text-stone-400 font-medium">{formattedDate}</td>
                      <td className="py-4 px-6 text-stone-700">[{userName}]</td>
                      <td className="py-4 px-6">{log.activity}</td>
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
      )}

    </div>
  );
}