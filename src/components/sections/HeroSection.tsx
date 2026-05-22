"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";

interface HeroSectionProps {
  badge?: string;
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  stats?: Array<{ label: string; value: string; pct: string }>;
  features?: Array<{ title: string; desc: string; iconName: string }>;
  theme?: "light" | "dark";
}

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

export default function HeroSection({
  badge = "Trusted by 2,000+ businesses",
  title = "Grow your business",
  titleGradient = "with a beautiful website",
  subtitle = "Launch a professional site in minutes. No design skills or coding required — just describe what you need and we'll build it for you.",
  primaryBtnText = "Get Started Free",
  secondaryBtnText = "See Examples",
  features = [
    {
      title: "Ready in minutes",
      desc: "Go from idea to live website with AI-powered design",
      iconName: "Zap",
    },
    {
      title: "Looks professional",
      desc: "Polished layouts that build trust with your customers",
      iconName: "Award",
    },
    {
      title: "Easy to update",
      desc: "Change copy, colors, and sections anytime in plain language",
      iconName: "MessageSquare",
    },
  ],
  theme = "light",
}: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLight = theme === "light";

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center px-6 py-20 md:py-28 transition-colors duration-300 ${
        isLight ? "bg-white text-slate-900" : "bg-slate-950 text-white"
      }`}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none ${
          isLight ? "bg-indigo-500/[0.06]" : "bg-indigo-500/10"
        }`}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 ${
            isLight
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
              : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
          }`}
        >
          <Icons.Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{badge}</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.08] mb-6">
          {title}{" "}
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-r ${
              isLight
                ? "from-indigo-600 to-violet-600"
                : "from-indigo-400 to-violet-400"
            }`}
          >
            {titleGradient}
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl max-w-2xl mb-10 leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-16">
          <button
            type="button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
          >
            {primaryBtnText}
            <Icons.ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-0.5" : ""}`}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
              isLight
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {secondaryBtnText}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {features.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-5 rounded-xl transition-all ${
                isLight
                  ? "bg-slate-50/80 border border-slate-100"
                  : "bg-slate-900/50 border border-slate-800"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  isLight
                    ? "bg-white border border-slate-200 shadow-sm"
                    : "bg-slate-800 border border-slate-700"
                }`}
              >
                <DynamicIcon
                  name={item.iconName}
                  className="w-5 h-5 text-indigo-600"
                />
              </div>
              <h3
                className={`font-semibold text-sm ${
                  isLight ? "text-slate-900" : "text-slate-100"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-xs mt-1.5 leading-relaxed ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Clean product preview — no browser chrome */}
        <div
          className={`w-full max-w-2xl mt-4 rounded-2xl border overflow-hidden shadow-xl ${
            isLight
              ? "border-slate-200 bg-gradient-to-b from-slate-50 to-white"
              : "border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950"
          }`}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
              <div className="text-left">
                <div
                  className={`h-3 w-24 rounded-full mb-1.5 ${
                    isLight ? "bg-slate-200" : "bg-slate-700"
                  }`}
                />
                <div
                  className={`h-2 w-16 rounded-full ${
                    isLight ? "bg-slate-100" : "bg-slate-800"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-3">
              {[100, 85, 70].map((w, i) => (
                <div
                  key={i}
                  className={`h-3 rounded-full ${
                    isLight ? "bg-slate-100" : "bg-slate-800"
                  }`}
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            <div
              className={`mt-6 h-24 rounded-xl flex items-center justify-center ${
                isLight
                  ? "bg-indigo-50 border border-indigo-100"
                  : "bg-indigo-500/10 border border-indigo-500/20"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isLight ? "text-indigo-600" : "text-indigo-400"
                }`}
              >
                Your brand, beautifully presented
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
