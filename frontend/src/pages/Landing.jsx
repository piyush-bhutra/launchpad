import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Rocket, Mail, Sparkles, CalendarClock, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import CopLight from "../components/CopLight";
import ShadyDealer from "../components/ShadyDealer";

const backgroundQuotes = [
  "These job applications actually reply. Unlike your crush.",
  "You either pass out employed or live long enough to see yourself a CAT slave.",
  "The placement season has started. (Your character development arc has not.)",
  "Bhowana pimp",
  "\"You miss 100% of the internships you don't apply for.\" — Launchpad"
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-retro-grid text-black relative overflow-hidden" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <div className="w-full bg-white border-b-4 border-black relative z-20">
        <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 place-items-center bg-[#3b82f6] border-4 border-black shadow-[4px_4px_0px_#000]">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl text-[#3b82f6] tracking-widest text-shadow-[2px_2px_0px_#000]">LAUNCHPAD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-black uppercase">Login</Link>
            <Link to="/signup" className="bg-[#22c55e] border-4 border-black px-4 py-2 text-sm text-white shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all uppercase">
              Start
            </Link>
          </div>
        </header>
      </div>

      <div className="relative overflow-hidden w-full border-b-4 border-black bg-white/50">
        {/* Background Marquees */}
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-center gap-12 sm:gap-16 opacity-[0.05] transform -rotate-3 scale-[1.5] select-none">
          {Array(3).fill(backgroundQuotes).flat().map((quote, i) => (
            <div 
              key={i} 
              className={`flex whitespace-nowrap ${i % 2 === 0 ? 'animate-marquee-left' : 'animate-marquee-right'}`}
            >
              {Array(10).fill(quote).map((q, j) => (
                <span key={j} className="mx-16 text-4xl sm:text-5xl lg:text-6xl font-black uppercase">{q}</span>
              ))}
            </div>
          ))}
        </div>

        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Top Badge - Centered on page between columns */}
        <div className="w-full flex justify-center mb-12 lg:mb-16">
          <div className="inline-block border-[3px] border-black bg-[#fde047] px-3 py-1.5 shadow-[3px_3px_0px_#000] retro-hover cursor-default">
            <span className="text-black font-bold tracking-wider text-[10px] uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Because VTOP is already enough suffering
            </span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
        
          <div className="flex flex-col items-center text-center pt-8 lg:ml-10">
            
            <div className="mb-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">
              <div><span className="retro-3d retro-3d-purple mb-4">YOUR INBOX IS</span></div>
              <div><span className="retro-3d retro-3d-purple mb-4">FULL OF</span></div>
              <div className="mb-8"><span className="retro-3d retro-3d-purple">OPPORTUNITIES.</span></div>
              <div><span className="retro-3d retro-3d-blue text-2xl md:text-3xl lg:text-4xl">(AND 300</span></div>
              <div className="mt-3"><span className="retro-3d retro-3d-blue text-2xl md:text-3xl lg:text-4xl">EMAILS FROM</span></div>
              <div className="mt-3"><span className="retro-3d retro-3d-blue text-2xl md:text-3xl lg:text-4xl">QUORA.)</span></div>
            </h1>
          </div>
          
          <p className="mt-2 max-w-xl text-[10px] text-gray-400 lowercase leading-loose tracking-widest text-center">
            {`> seriously, who tf uses quora in 2026? block them. block them now. we'll handle the rest.`}
          </p>
          </div>

        {/* Shady Dealer Graphic */}
        <div className="relative flex justify-center lg:justify-end items-start h-[500px] lg:h-[600px] pt-32">
          <ShadyDealer />
        </div>

        {/* Centered Paragraph & Buttons (Spans full width, pulled up into center) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center w-full lg:-mt-20 relative z-20">
          <p className="mt-10 max-w-xl text-sm leading-10 text-gray-800 text-center">
            Stop doomscrolling and connect your Gmail. We'll sniff out the placements before your 
            <span className="hazard-hover inline-block bg-[#ef4444] text-white px-2 py-1 mx-2 border-2 border-black shadow-[3px_3px_0px_#000] -rotate-3 hover:rotate-3 transition-transform cursor-pointer align-middle">
              3-pointer
            </span> 
            tanks your chances.
            <span className="inline-block ml-2 align-middle">
              <CopLight />
            </span>
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup" className="flex items-center gap-3 bg-[#60a5fa] border-4 border-black px-8 py-5 text-base text-white shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] transition-all uppercase font-bold">
              CONNECT GMAIL <ArrowRight className="h-6 w-6" />
            </Link>
            <Link to="/dashboard" className="border-4 border-black bg-white px-8 py-5 text-base text-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] transition-all uppercase font-bold">
              SEE DEMO
            </Link>
          </div>
        </div>
        </div>
      </section>
      </div>

      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-24 md:grid-cols-3 pt-24 z-10">
        {/* Blue Card - Scanner Effect */}
        <div className="group relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300 hover:bg-[#60a5fa] overflow-hidden cursor-pointer">
           <div className="mb-6 grid h-12 w-12 place-items-center border-4 border-black bg-white shadow-[4px_4px_0px_#000] group-hover:border-black transition-colors duration-300 relative z-10" style={{ borderColor: "#60a5fa" }}>
              <Mail className="h-6 w-6 text-[#60a5fa] group-hover:text-black transition-colors duration-300" />
           </div>
           <h3 className="mb-4 text-xl font-black uppercase text-[#60a5fa] group-hover:text-black transition-colors duration-300 relative z-10">GMAIL SCAN</h3>
           <p className="text-sm leading-relaxed text-black font-bold relative z-10">SCANS INCOMING MAIL IN REAL TIME AND CLASSIFIES OPPORTUNITIES.</p>
           
           {/* Scanner Light */}
           <div className="absolute left-0 right-0 h-4 bg-cyan-300 shadow-[0_0_30px_15px_rgba(103,232,249,0.8)] opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none z-20"></div>
        </div>

        {/* Red Card - Alarm Clock Shake */}
        <div className="group relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] transition-all duration-300 hover:bg-[#f87171] hover:animate-shake-pop cursor-pointer">
           <div className="mb-6 grid h-12 w-12 place-items-center border-4 border-black bg-white shadow-[4px_4px_0px_#000] group-hover:border-black transition-colors duration-300 relative z-10" style={{ borderColor: "#f87171" }}>
              <CalendarClock className="h-6 w-6 text-[#f87171] group-hover:text-black transition-colors duration-300 group-hover:animate-ring" />
           </div>
           <h3 className="mb-4 text-xl font-black uppercase text-[#f87171] group-hover:text-black transition-colors duration-300 relative z-10">DEADLINES</h3>
           <p className="text-sm leading-relaxed text-black font-bold relative z-10">AUTO-EXTRACTS DATES AND QUEUES REMINDERS.</p>
        </div>

        {/* Green Card - Lock Down */}
        <div className="group relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300 hover:bg-[#4ade80] overflow-hidden cursor-pointer">
           <div className="mb-6 grid h-12 w-12 place-items-center border-4 border-black bg-white shadow-[4px_4px_0px_#000] group-hover:border-black transition-colors duration-300 relative z-20" style={{ borderColor: "#4ade80" }}>
              <ShieldCheck className="h-6 w-6 text-[#4ade80] group-hover:opacity-0 transition-opacity duration-300 absolute" />
              <Lock className="h-6 w-6 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute" />
           </div>
           <h3 className="mb-4 text-xl font-black uppercase text-[#4ade80] group-hover:text-black transition-colors duration-300 relative z-20">TRUST US MORE THAN INCOGNITO</h3>
           <p className="text-sm leading-relaxed text-black font-bold relative z-20">READ-ONLY ACCESS. ELECTRONS NEVER LEAVE THE PIPELINE.</p>

           {/* Big Lock Overlay Slam */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
             <Lock 
               className="w-48 h-48 text-black opacity-0 group-hover:opacity-20 transform scale-[3] -translate-y-20 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" 
               strokeWidth={1.5} 
             />
           </div>
        </div>
      </section>
    </div>
  );
}
