import React from 'react';
import Navbar from './components/navbar';
import HeroSection from './components/HeroSection';
import SearchBar from './components/SearchBar';
import JobBoard from './components/JobBoard';
import RecruitmentProcess from './components/RecruitmentProcess';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFAF5] text-slate-900 font-plus-jakarta-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <SearchBar />
        <JobBoard />
        <RecruitmentProcess />
      </main>

      <Footer />
    </div>
  );
}