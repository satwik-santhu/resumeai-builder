import { FileText, Zap, Download, Palette, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    { icon: <FileText size={24} />, title: 'Multiple Templates', desc: 'Choose from Professional, Modern, and Executive designs.' },
    { icon: <Zap size={24} />, title: 'AI-Powered Writing', desc: 'Gemini AI generates summaries, improves descriptions & suggests skills.' },
    { icon: <Download size={24} />, title: 'PDF Download', desc: 'Export your resume as a pixel-perfect PDF in one click.' },
    { icon: <Palette size={24} />, title: 'Live Preview', desc: 'See your changes reflected in real-time as you type.' },
    { icon: <Shield size={24} />, title: 'Secure Storage', desc: 'Your data stays private and locally stored.' },
    { icon: <Star size={24} />, title: 'Premium Templates', desc: 'Unlock exclusive professional designs for standout resumes.' },
  ];

  const steps = [
    { num: '1', title: 'Choose a Template', desc: 'Pick from our curated collection of professional resume templates.' },
    { num: '2', title: 'Fill Your Details', desc: 'Enter your experience, education, skills, projects and more.' },
    { num: '3', title: 'AI-Enhance & Download', desc: 'Use AI to polish your content, preview, and download as PDF.' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-8">
            <Zap size={14} className="animate-pulse" />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            Build Your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Dream Resume
            </span>{' '}
            in Minutes
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning, ATS-friendly resumes with AI assistance. Choose beautiful templates, 
            live-preview your changes, and download a professional PDF instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              Create Resume — It's Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              View Templates
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-500">
            {['No sign-up required', 'Free templates available', 'AI-powered suggestions'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-violet-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Mock resume preview card */}
        <div className="relative max-w-3xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gray-900/50 px-6 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="ml-2 text-xs text-gray-500">resume-builder.app</span>
            </div>
            <div className="grid grid-cols-5 gap-0 p-0 min-h-[260px]">
              <div className="col-span-2 bg-gradient-to-b from-violet-900/40 to-indigo-900/40 p-6 border-r border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full mb-4 flex items-center justify-center text-2xl font-bold">J</div>
                <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                <div className="h-2 bg-white/10 rounded w-1/2 mb-6" />
                <div className="space-y-2">
                  <div className="h-2 bg-white/15 rounded w-full" />
                  <div className="h-2 bg-white/10 rounded w-4/5" />
                  <div className="h-2 bg-white/10 rounded w-3/4" />
                </div>
                <div className="mt-6 flex flex-wrap gap-1">
                  {['React', 'Node.js', 'Python'].map(s => (
                    <span key={s} className="px-2 py-0.5 bg-violet-500/30 border border-violet-500/30 rounded text-xs text-violet-300">{s}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-3 p-6">
                <div className="h-3 bg-white/20 rounded w-2/3 mb-4" />
                <div className="space-y-1.5 mb-5">
                  <div className="h-2 bg-white/10 rounded w-full" />
                  <div className="h-2 bg-white/10 rounded w-5/6" />
                  <div className="h-2 bg-white/10 rounded w-4/5" />
                </div>
                <div className="h-3 bg-white/20 rounded w-1/3 mb-3" />
                <div className="space-y-1.5 mb-5">
                  <div className="h-2 bg-white/10 rounded w-full" />
                  <div className="h-2 bg-white/10 rounded w-3/4" />
                </div>
                <div className="h-3 bg-white/20 rounded w-1/4 mb-3" />
                <div className="space-y-1.5">
                  <div className="h-2 bg-white/10 rounded w-5/6" />
                  <div className="h-2 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 inset-x-8 h-4 bg-gray-800/50 rounded-b-2xl blur-sm" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Land Your Dream Job</h2>
            <p className="text-gray-400 text-lg">Powerful tools to help you create professional resumes that stand out.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-white/10 rounded-xl p-6 hover:border-violet-500/30 hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg mb-14">Three simple steps to your perfect resume.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-500/50 to-transparent z-0 -translate-x-1/2" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg shadow-violet-500/30">
                    {s.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-10 text-center shadow-2xl shadow-violet-500/20">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Resume?</h2>
          <p className="text-violet-200 text-lg mb-8">Join thousands of job seekers who landed their dream role with ResumeAI.</p>
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2 mx-auto px-8 py-4 bg-white text-violet-700 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            Start Building Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded flex items-center justify-center">
            <FileText size={12} className="text-white" />
          </div>
          <span className="font-semibold text-gray-400">ResumeAI</span>
        </div>
        <p>© 2024 ResumeAI. Built with React, Tailwind CSS & Google Gemini.</p>
      </footer>
    </div>
  );
}
