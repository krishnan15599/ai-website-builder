"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
  theme?: "light" | "dark";
}

export default function FAQSection({
  title = "Frequently asked questions",
  subtitle = "Everything you need to know about our templates, custom domain setup, and billing queries.",
  questions = [
    {
      question: "Can I customize the generated code after exporting?",
      answer: "Absolutely! The exported code is standard Next.js / Tailwind React components. It uses raw styling classes and does not require any custom library or external framework wrapping, meaning you can plug it into any codebase instantly."
    },
    {
      question: "How does the conversational editing model work?",
      answer: "Instead of rebuilding your layout from scratch, our editor passes your existing website JSON along with your edit command to our custom AI parser. The assistant identifies only the requested changes, updating texts, themes, or layouts incrementally while preserving your other sections."
    },
    {
      question: "Is there support for custom fonts and color tokens?",
      answer: "Yes, our styles integrate with the standard Tailwind configuration. You can change themes (light/dark) dynamically, or ask the AI to map specific color tokens, badges, or button borders to your brand colors."
    },
    {
      question: "Do you offer enterprise hosting options?",
      answer: "We support direct deployment exports. You can host on Vercel, Netlify, Cloudflare Pages, or let our platform deploy to standard edge node servers globally with full SSL verification."
    }
  ],
  theme = "dark"
}: FAQSectionProps) {
  // Manage open question index in state for interactive accordion functionality
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className={`relative py-16 px-6 border rounded-xl mt-6 overflow-hidden transition-all duration-300 ${
      theme === "light"
        ? "bg-white text-slate-900 border-slate-200"
        : "bg-slate-950 text-white border-slate-800/40"
    }`}>
      {/* Background Decor */}
      <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
        theme === 'light' ? 'bg-indigo-600/1' : 'bg-indigo-500/5'
      }`} />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className={`text-3xl font-bold tracking-tight mb-4 transition-colors duration-300 ${
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

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {questions.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all duration-300 ${
                  theme === 'light'
                    ? 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    : 'border-slate-900 bg-slate-950/40 hover:bg-slate-950/80'
                }`}
              >
                {/* Header Toggle Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm cursor-pointer select-none"
                >
                  <span className={theme === 'light' ? 'text-slate-800' : 'text-slate-200'}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-indigo-500' : 'text-zinc-500'
                  }`} />
                </button>

                {/* Answer Content Panel */}
                <div
                  className={`overflow-hidden transition-all duration-350 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t' : 'max-h-0'
                  } ${
                    theme === 'light' ? 'border-slate-200' : 'border-slate-900'
                  }`}
                >
                  <p className={`px-5 py-4 text-xs leading-relaxed transition-colors duration-300 ${
                    theme === 'light' ? 'text-slate-650' : 'text-slate-400'
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
