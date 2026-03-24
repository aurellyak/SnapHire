"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Palette, Code, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Job {
  job_id: string;
  title: string;
  location: string;
  employment_type: string;
  additional_tag: string;
  salary_min: number;
  salary_max: number;
  department: string;
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status_job', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatSalary = (amount: number) => {
    return `${amount / 1000000} Jt`;
  };

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'design':
        return <Palette size={24} />;
      case 'engineering':
        return <Code size={24} />;
      case 'data':
        return <Database size={24} />;
      default:
        return <Building2 size={24} />; 
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Lowongan Terbaru</h2>
          <p className="text-slate-500">Temukan posisi yang pas untuk mengembangkan karirmu.</p>
        </div>
        <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          Lihat Semua Lowongan &rarr;
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {getDepartmentIcon(job.department)}
                </div>
                
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {job.department}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{job.title}</h3>
              
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <Briefcase size={16} className="text-slate-400" />
                  <span>{job.employment_type} • {job.additional_tag}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <DollarSign size={16} className="text-slate-400" />
                  <span>IDR {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Clock size={14} /> Baru saja
                </span>
                <button className="bg-slate-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                  Lamar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500">Belum ada lowongan yang tersedia saat ini.</p>
        </div>
      )}
    </section>
  );
}