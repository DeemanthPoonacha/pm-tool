import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users2, 
  GitPullRequestDraft 
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
              P
            </div>
            <span className="text-xl font-bold tracking-tight">PM Tool</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Enterprise</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                NEW VERSION 2.0 IS LIVE
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Master Your Project <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Lifecycle</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                A professional project management tool designed for startups. 
                Track from requirement gathering to production deployment with ease.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Managing Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10 hover:bg-zinc-800 transition-all">
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] -z-10" />
              <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-zinc-900 premium-shadow">
                <div className="h-8 bg-zinc-800 flex items-center px-4 gap-1.5 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="p-4 sm:p-8 bg-zinc-950 flex gap-4 min-h-[400px]">
                   <div className="w-48 bg-zinc-900/50 rounded-xl hidden md:block border border-white/5" />
                   <div className="flex-1 flex flex-col gap-4">
                      <div className="h-12 bg-zinc-900/50 rounded-xl border border-white/5 w-1/3" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="h-32 bg-zinc-900/50 rounded-2xl border border-white/5" />
                        <div className="h-32 bg-zinc-900/50 rounded-2xl border border-white/5" />
                        <div className="h-32 bg-zinc-900/50 rounded-2xl border border-white/5" />
                      </div>
                      <div className="h-64 bg-zinc-900/50 rounded-2xl border border-white/5" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to deliver</h2>
              <p className="text-zinc-400">Streamlined features for high-performance teams.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: GitPullRequestDraft, 
                  title: "Requirement Management", 
                  desc: "Create, review, and approve BRDs and FRDs with full version control and audit logs." 
                },
                { 
                  icon: Zap, 
                  title: "Workflow Automation", 
                  desc: "Define custom stages per project from Requirement to Production deployment." 
                },
                { 
                  icon: Users2, 
                  title: "Role-Based Access", 
                  desc: "Specific dashboards and permissions for Clients, PMs, BAs, and Developers." 
                },
                { 
                  icon: BarChart3, 
                  title: "Real-time Analytics", 
                  desc: "Track project health, task progress, and team performance with automated reports." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Quality Assurance", 
                  desc: "Integrated bug tracking and UAT approval workflows to ensure delivery quality." 
                },
                { 
                  icon: CheckCircle2, 
                  title: "Seamless Collaboration", 
                  desc: "Direct communication between clients and internal teams via comments and notifications." 
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:border-blue-600/30 transition-all group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-lg font-bold tracking-tight">PM Tool</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 PM Tool Enterprise. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
