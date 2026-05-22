"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  email?: string;
  supportText?: string;
  formPlaceholderEmail?: string;
  formPlaceholderMessage?: string;
  submitBtnText?: string;
  theme?: "light" | "dark";
}

export default function ContactSection({
  title = "Let's build your next SaaS together",
  subtitle = "Have questions about integrations, security, or enterprise options? Drop us a line. Our AI agents and support teams are available 24/7.",
  email = "sales@example.com",
  supportText = "Live chat support active",
  formPlaceholderEmail = "name@company.com",
  formPlaceholderMessage = "How can we help you?",
  submitBtnText = "Send Request",
  theme = "dark"
}: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`relative py-16 px-6 border rounded-xl mt-6 overflow-hidden transition-all duration-300 ${
      theme === "light"
        ? "bg-white text-slate-900 border-slate-200"
        : "bg-slate-950 text-white border-slate-800/40"
    }`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}>{title}</h2>
          <p className={`text-sm leading-relaxed transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {subtitle}
          </p>
          <div className="space-y-4">
            <div className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-350'
            }`}>
              <Mail className="w-4.5 h-4.5 text-indigo-500" />
              <span>{email}</span>
            </div>
            <div className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-350'
            }`}>
              <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
              <span>{supportText}</span>
            </div>
          </div>
        </div>

        <div className={`flex-1 w-full p-6 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200 bg-slate-50/50'
            : 'border-slate-900 bg-slate-950/60'
        }`}>
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Thank you!</h3>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder={formPlaceholderEmail}
                  className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:border-indigo-500 transition-colors ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-450 text-slate-800'
                      : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>Message</label>
                <textarea 
                  rows={3}
                  required
                  placeholder={formPlaceholderMessage}
                  className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:border-indigo-500 transition-colors ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-450 text-slate-800'
                      : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  }`}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 rounded bg-indigo-600 hover:bg-indigo-500 font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors text-white"
              >
                {submitBtnText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
