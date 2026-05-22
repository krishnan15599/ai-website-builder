export const HERO_SECTION_CODE = `"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Play, Shield, Zap, Star } from "lucide-react";

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "performance">("analytics");

  return (
    <div className="relative min-h-[600px] w-full bg-slate-950 text-white overflow-hidden flex flex-col items-center justify-center px-6 py-16 md:py-24 border border-slate-800/40 rounded-xl">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: \`radial-gradient(circle at 1px 1px, white 1px, transparent 0)\`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next Generation AI Builder</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6">
          Build stunning SaaS products{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            in split seconds
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 font-normal leading-relaxed">
          Create, deploy, and scale your application. Experience a developer-first platform powered by artificial intelligence and state-of-the-art designs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            Start Free Trial
            <ArrowRight className={\`w-4 h-4 transition-transform duration-300 \${isHovered ? 'translate-x-1' : ''}\`} />
          </button>
          
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all cursor-pointer">
            <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            Watch Video
          </button>
        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {[
            { icon: Zap, title: "Instant Deployment", desc: "Push to edge CDN globally in 2 seconds" },
            { icon: Shield, title: "Enterprise Grade", desc: "SOC2 compliant secure hosting environment" },
            { icon: Star, title: "Adaptive Styling", desc: "Stunning light/dark themes, components & layouts" }
          ].map((item, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-900 bg-slate-950/40 text-left hover:border-slate-800 transition-colors duration-200">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-850">
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-200">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

export const FEATURES_SECTION_CODE = `"use client";

import React from "react";
import { Cpu, Globe, Rocket, Terminal, Layers, RefreshCw } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Cpu,
      title: "AI Component Generator",
      description: "Describe what you want in simple English and watch the component generate, compile, and render live."
    },
    {
      icon: Globe,
      title: "Global Edge Hosting",
      description: "Automatic global edge deploys to 100+ cities with pre-rendered pages, optimizing LCP and SEO rankings."
    },
    {
      icon: Terminal,
      title: "Interactive CLI",
      description: "Direct API access and sync functions. Pull components into your local project files with one line of code."
    },
    {
      icon: Layers,
      title: "Custom Design Tokens",
      description: "A comprehensive style library tailored dynamically to align with your brand, logos, and styling preferences."
    },
    {
      icon: RefreshCw,
      title: "Dynamic Refinement",
      description: "Iterate by feeding feedback. Ask the AI to change styles, update colors, or add layouts instantly."
    },
    {
      icon: Rocket,
      title: "Next.js App Ready",
      description: "All generated React structures support server components, typescript variables, and loading patterns."
    }
  ];

  return (
    <div className="relative bg-slate-950 text-white py-16 px-6 border border-slate-800/40 rounded-xl mt-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Engineered for high performance SaaS development
          </h2>
          <p className="text-slate-400">
            A complete list of developer utilities to transform prompts into production code in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-slate-900 bg-slate-950 hover:border-slate-800 transition-all group hover:scale-[1.01] duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <feature.icon className="w-6 h-6 text-indigo-400 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

export const CONTACT_SECTION_CODE = `"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative bg-slate-950 text-white py-16 px-6 border border-slate-800/40 rounded-xl mt-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Let's build your next SaaS together</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Have questions about integrations, security, or enterprise options? Drop us a line. Our AI agents and support teams are available 24/7.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-350 text-sm">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>sales@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-slate-350 text-sm">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Live chat support active</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full p-6 rounded-xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm">
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg">Thank you!</h3>
              <p className="text-slate-400 text-sm mt-1">Our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full px-3 py-2 text-sm rounded bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="How can we help you?" 
                  className="w-full px-3 py-2 text-sm rounded bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Send Request
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}`;
