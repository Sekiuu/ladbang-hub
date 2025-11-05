"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../api";
import { Zap, Shield, Users, ArrowRight, User, LayoutDashboard, Sparkles } from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  // const testApi = async () => {
  //   const res = await api.get("/users");
  //   if (res?.body) {
  //     console.log(JSON.stringify(res.body, null, 2));
  //   } else {
  //     console.log(res);
  //   }
  // };
  // testApi();

  // if (status === "loading") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-light text-slate-700 mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent font-normal">
              Ladbang Hub
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto font-light">
            Smart financial management powered by AI
          </p>

          {session ? (
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border border-sky-100 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
                <h2 className="text-2xl font-light text-slate-700 mb-1">
                  Hey, {session.user?.name}!
                </h2>
                <p className="text-slate-500 mb-4 font-light">
                  Ready to manage your finances?
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl hover:bg-sky-600 transition font-light shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-sky-50 transition font-light border border-sky-100"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-light hover:bg-sky-600 transition shadow-sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-sm text-slate-400 font-light">
                Demo: admin@example.com / password
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-light text-slate-700 mb-3">
            Why Ladbang Hub?
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-light">
            Built for people who want to take control of their money
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-light text-slate-700 mb-2">
              Fast & Simple
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Track your spending in seconds, not minutes
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-400 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-light text-slate-700 mb-2">
              Safe & Private
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Your data stays secure with enterprise-grade protection
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-light text-slate-700 mb-2">
              AI Insights
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Get personalized tips to save more and spend smarter
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div className="bg-gradient-to-r from-sky-400 to-cyan-400 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-light text-white mb-3">
              Ready to take control?
            </h2>
            <p className="text-sky-50 mb-8 max-w-2xl mx-auto font-light">
              Join thousands who've transformed how they manage money
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-xl font-light hover:bg-sky-50 transition shadow-sm"
            >
              Start Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
