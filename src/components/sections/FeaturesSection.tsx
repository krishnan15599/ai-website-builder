"use client";

import React from "react";
import * as Icons from "lucide-react";

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  featuresList?: Array<{ title: string; description: string; iconName: string }>;
  items?: string[];
  theme?: "light" | "dark";
}

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

export default function FeaturesSection({
  title = "Engineered for high performance SaaS development",
  subtitle = "A complete list of developer utilities to transform prompts into production code in milliseconds.",
  featuresList,
  items,
  theme = "dark"
}: FeaturesSectionProps) {
  const displayList = featuresList || (items ? items.map((item, idx) => ({
    title: item,
    description: "Experience premium features designed for optimal speed, styling, and flexibility.",
    iconName: ["Zap", "Shield", "Star", "Cpu", "Layers", "Rocket"][idx % 6]
  })) : [
    {
      iconName: "Cpu",
      title: "AI Component Generator",
      description: "Describe what you want in simple English and watch the component generate, compile, and render live."
    },
    {
      iconName: "Globe",
      title: "Global Edge Hosting",
      description: "Automatic global edge deploys to 100+ cities with pre-rendered pages, optimizing LCP and SEO rankings."
    },
    {
      iconName: "Terminal",
      title: "Interactive CLI",
      description: "Direct API access and sync functions. Pull components into your local project files with one line of code."
    },
    {
      iconName: "Layers",
      title: "Custom Design Tokens",
      description: "A comprehensive style library tailored dynamically to align with your brand, logos, and styling preferences."
    },
    {
      iconName: "RefreshCw",
      title: "Dynamic Refinement",
      description: "Iterate by feeding feedback. Ask the AI to change styles, update colors, or add layouts instantly."
    },
    {
      iconName: "Rocket",
      title: "Next.js App Ready",
      description: "All generated React structures support server components, typescript variables, and loading patterns."
    }
  ]);

  return (
    <div className={`relative py-16 px-6 border rounded-xl mt-6 overflow-hidden transition-all duration-300 ${
      theme === "light"
        ? "bg-white text-slate-900 border-slate-200"
        : "bg-slate-950 text-white border-slate-800/40"
    }`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
        theme === 'light' ? 'bg-indigo-600/2' : 'bg-indigo-500/5'
      }`} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}>
            {title}
          </h2>
          <p className={`transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayList.map((feature, idx) => (
            <div key={idx} className={`p-6 rounded-xl border transition-all group hover:scale-[1.01] duration-300 ${
              theme === 'light'
                ? 'border-slate-200 bg-slate-50 hover:border-slate-300'
                : 'border-slate-900 bg-slate-950 hover:border-slate-800'
            }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-indigo-50 border border-indigo-100/60 text-indigo-600'
                  : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400'
              }`}>
                <DynamicIcon name={feature.iconName} className={`w-6 h-6 group-hover:text-white transition-colors duration-300 ${
                  theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                }`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                theme === 'light' ? 'text-slate-800' : 'text-slate-200'
              }`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
