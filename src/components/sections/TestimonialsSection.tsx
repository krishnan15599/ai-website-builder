"use client";

import React from "react";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  items?: Array<{
    quote: string;
    author: string;
    role?: string;
    avatarUrl?: string;
  }>;
  theme?: "light" | "dark";
}

export default function TestimonialsSection({
  title = "Loved by builders worldwide",
  subtitle = "See how developers, creators, and teams are shipping beautiful pages using our editor workspace.",
  items = [
    {
      quote: "Aetheria changed how we ship prototypes. What used to take hours of manual Tailwind setups is now ready in minutes using conversational prompts.",
      author: "Sarah Jenkins",
      role: "Founder, DevSprint",
      avatarUrl: ""
    },
    {
      quote: "The clean structure of the generated code is what stands out. It's fully typed, ready for Next.js App Router, and integrates seamlessly with our existing project systems.",
      author: "David Chen",
      role: "Lead Engineer, TechFlow",
      avatarUrl: ""
    },
    {
      quote: "I can edit sections live just by speaking to the chatbot. Changing colors, pricing tables, or adding accordion FAQs takes seconds. Truly revolutionary.",
      author: "Elena Rostova",
      role: "Product Designer, Aura Studio",
      avatarUrl: ""
    }
  ],
  theme = "dark"
}: TestimonialsSectionProps) {
  return (
    <div className={`relative py-16 px-6 border rounded-xl mt-6 overflow-hidden transition-all duration-300 ${
      theme === "light"
        ? "bg-white text-slate-900 border-slate-200"
        : "bg-slate-950 text-white border-slate-800/40"
    }`}>
      {/* Background Glow */}
      <div className={`absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
        theme === 'light' ? 'bg-purple-600/2' : 'bg-purple-500/5'
      }`} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}>
            {title}
          </h2>
          <p className={`text-sm transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between ${
                theme === 'light'
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-900 bg-slate-950/60'
              }`}
            >
              <div>
                {/* 5-Star Ratings */}
                <div className="flex gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className={`text-sm leading-relaxed italic mb-6 transition-colors duration-300 ${
                  theme === 'light' ? 'text-slate-650' : 'text-slate-300'
                }`}>
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                  theme === 'light'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {item.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                  }`}>{item.author}</h4>
                  <p className={`text-xs transition-colors duration-300 ${
                    theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                  }`}>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
