"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    isPopular?: boolean;
    btnText?: string;
  }>;
  theme?: "light" | "dark";
}

export default function PricingSection({
  title = "Flexible plans for any scale",
  subtitle = "Simple pricing. Build, export, and scale without worrying about hidden quotas or overages.",
  plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      features: [
        "Up to 5 active pages",
        "AI assistant access",
        "Standard templates library",
        "Community support"
      ],
      isPopular: false,
      btnText: "Get Started"
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      features: [
        "Unlimited generated pages",
        "Elite AI prompt capacity",
        "React & HTML raw code export",
        "24/7 dedicated support",
        "Custom design tokens editor"
      ],
      isPopular: true,
      btnText: "Upgrade to Pro"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Dedicated edge domain configuration",
        "SOC2 security audit compliance",
        "Tailored layout libraries",
        "Direct API workspace integrations",
        "Custom SLAs & uptime agreements"
      ],
      isPopular: false,
      btnText: "Contact Sales"
    }
  ],
  theme = "dark"
}: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className={`relative py-16 px-6 border rounded-xl mt-6 overflow-hidden transition-all duration-300 ${
      theme === "light"
        ? "bg-white text-slate-900 border-slate-200"
        : "bg-slate-950 text-white border-slate-800/40"
    }`}>
      {/* Background Gradients */}
      <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
        theme === 'light' ? 'bg-indigo-600/2' : 'bg-indigo-500/5'
      }`} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
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

          {/* Optional Billing Cycle Selector (Visual Only) */}
          <div className="inline-flex items-center gap-1 bg-zinc-900/60 p-1 border border-zinc-800/40 rounded-lg mt-6">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Yearly <span className="text-[9px] text-indigo-200 bg-indigo-500/20 px-1 py-0.5 rounded ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            // Adjust yearly visual price
            const isMonthlyNumeric = plan.price.startsWith("$");
            let displayPrice = plan.price;
            let displayPeriod = plan.period;

            if (billingCycle === "yearly" && isMonthlyNumeric) {
              const basePrice = parseInt(plan.price.replace("$", ""), 10);
              const discountedPrice = Math.round(basePrice * 0.8);
              displayPrice = `$${discountedPrice}`;
              displayPeriod = "/month, billed yearly";
            }

            return (
              <div
                key={idx}
                className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] ${
                  plan.isPopular
                    ? theme === "light"
                      ? "border-indigo-500 bg-indigo-500/5 shadow-xl shadow-indigo-500/5"
                      : "border-indigo-500 bg-indigo-500/10 shadow-2xl shadow-indigo-500/10"
                    : theme === "light"
                      ? "border-slate-200 bg-slate-50/50"
                      : "border-slate-900 bg-slate-950/40"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-[10px] text-white font-bold tracking-wide uppercase shadow-lg shadow-indigo-650/30">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className={`text-lg font-bold transition-colors duration-300 ${
                    theme === "light" ? "text-slate-800" : "text-slate-100"
                  }`}>{plan.name}</h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
                      theme === "light" ? "text-slate-900" : "text-white"
                    }`}>
                      {displayPrice}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      theme === "light" ? "text-slate-500" : "text-slate-550"
                    }`}>
                      {displayPeriod}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className={`my-6 border-b transition-colors duration-300 ${
                    theme === "light" ? "border-slate-200" : "border-slate-900"
                  }`} />

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          theme === "light"
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            : "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={theme === "light" ? "text-slate-650" : "text-slate-350"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                    plan.isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                      : theme === "light"
                        ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white"
                  }`}
                >
                  {plan.btnText || "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
