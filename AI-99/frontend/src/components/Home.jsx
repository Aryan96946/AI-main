import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #0f172a 50%, #134e4a 75%, #0f172a 100%)' }}>
      <BgAnim />

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" 
               style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Dropout</h2>
            <p className="text-xs text-gray-400">Prediction & Counseling</p>
          </div>
        </motion.div>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a href="#how" className="text-gray-300 hover:text-white transition-colors">
              How it works
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl font-medium transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
          >
            Sign in
          </motion.button>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid gap-12 grid-cols-1 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300">AI-Powered Prevention System</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Reduce Student</span>
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
                Dropout with AI
              </span>
            </motion.h2>

            <motion.p
              className="text-lg text-gray-300 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Harness the power of machine learning to identify at-risk students early and provide personalized counseling to keep them on track.
            </motion.p>

            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl font-semibold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
              >
                Get Started
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#how"
                className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white transition-colors"
              >
                Learn more →
              </motion.a>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <StatsBox value="92%" label="Accuracy" />
              <StatsBox value="3x" label="Better Retention" />
              <StatsBox value="24/7" label="AI Support" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <DashPreview />
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Powerful </span>
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>Features</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to predict, prevent, and counsel students effectively.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Predictive Analytics"
              desc="Machine learning models analyze attendance, grades, and behavior to identify at-risk students early."
              icon={PredictIcon}
              delay={0}
            />
            <FeatureCard
              title="Counselor Workspace"
              desc="Schedule sessions, track progress, and maintain detailed notes for each student."
              icon={CounselIcon}
              delay={0.1}
            />
            <FeatureCard
              title="Real-time Insights"
              desc="Dashboard with live metrics, risk distribution, and trend analysis for data-driven decisions."
              icon={AnalyticsIcon}
              delay={0.2}
            />
            <FeatureCard
              title="Automated Alerts"
              desc="Get notified when students show warning signs and need immediate attention."
              icon={AlertIcon}
              delay={0.3}
            />
            <FeatureCard
              title="Privacy First"
              desc="Role-based access control ensures student data is only visible to authorized personnel."
              icon={ShieldIcon}
              delay={0.4}
            />
            <FeatureCard
              title="Easy Integration"
              desc="Import student data via CSV and integrate with existing systems seamlessly."
              icon={UploadIcon}
              delay={0.5}
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h3>
            <p className="text-gray-400">Three simple steps to reduce dropout rates</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepBox
              index={1}
              title="Import Data"
              desc="Upload student records including attendance, grades, and behavioral data."
              color="#3b82f6"
              delay={0}
            />
            <StepBox
              index={2}
              title="AI Analysis"
              desc="Our ML model analyzes patterns and identifies students at risk of dropping out."
              color="#10b981"
              delay={0.1}
            />
            <StepBox
              index={3}
              title="Take Action"
              desc="Counselors receive insights and can schedule interventions to help students succeed."
              color="#8b5cf6"
              delay={0.2}
            />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="max-w-4xl mx-auto px-6 py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 md:p-12"
            style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Get In Touch</h3>
              <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <motion.div
                className="p-4"
                whileHover={{ scale: 1.05 }}
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" 
                     style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-white font-medium">Location</p>
                <p className="text-gray-400 text-sm">GEC Ajmer, India</p>
              </motion.div>

              <motion.div
                className="p-4"
                whileHover={{ scale: 1.05 }}
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" 
                     style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white font-medium">Email</p>
                <a href="mailto:aryannawal185@gmail.com" className="text-emerald-400 text-sm hover:underline">
                  aryannawal185@gmail.com
                </a>
              </motion.div>

              <motion.div
                className="p-4"
                whileHover={{ scale: 1.05 }}
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" 
                     style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-white font-medium">Phone</p>
                <a href="tel:+919586272685" className="text-purple-400 text-sm hover:underline">
                  +91 95862 72685
                </a>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-8 md:p-12 text-center"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          >
            <h4 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ready to Make a Difference?
            </h4>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join educational institutions using AI to prevent student dropout and improve retention rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-8 py-3 rounded-xl font-semibold"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
              >
                Create Free Account
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#contact"
                className="px-8 py-3 rounded-xl font-medium text-gray-300 border border-gray-600 hover:border-white transition-colors"
              >
                Contact Sales
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm border-t border-gray-800">
          <p>© {new Date().getFullYear()} AI Dropout Prevention System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

/* --- Components --- */
function StatsBox({ value, label }) {
  return (
    <motion.div
      className="p-3 rounded-xl text-center"
      style={{ background: 'rgba(255,255,255,0.05)' }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-xl font-bold" style={{ color: '#10b981' }}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ title, desc, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className="p-6 rounded-2xl border border-gray-800"
      style={{ background: 'rgba(15, 23, 42, 0.8)' }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
           style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)' }}>
        <Icon />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
}

function PredictIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CounselIcon() {
  return (
    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function StepBox({ index, title, desc, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative"
    >
      <div className="p-6 rounded-2xl border border-gray-800 h-full" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold text-lg"
             style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`, color: 'white' }}>
          {index}
        </div>
        <h5 className="text-lg font-semibold text-white mb-2">{title}</h5>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
      {index < 3 && (
        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

function DashPreview() {
  return (
    <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" 
         style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold text-white">Dashboard</h4>
          <p className="text-xs text-gray-400">Risk Overview</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium" 
             style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
          Live
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <p className="text-xs text-gray-400">High Risk</p>
          <p className="text-xl font-bold text-red-400">12</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
          <p className="text-xs text-gray-400">Moderate</p>
          <p className="text-xl font-bold text-yellow-400">28</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
          <p className="text-xs text-gray-400">Low Risk</p>
          <p className="text-xl font-bold text-green-400">156</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-xl font-bold text-blue-400">196</p>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-end justify-between h-20 gap-1">
          {[65, 45, 78, 32, 56, 89, 45, 67, 54, 78, 45, 65].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t"
              style={{ 
                height: `${h}%`, 
                background: i > 9 ? 'linear-gradient(to top, #ef4444, #f87171)' : 'linear-gradient(to top, #10b981, #34d399)'
              }}
              animate={{ height: [`${h-10}%`, `${h}%`, `${h-10}%`] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Jan</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
          View Report
        </button>
        <button className="py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
          Add Student
        </button>
      </div>
    </div>
  );
}

function BgAnim() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-1/4 top-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute right-1/4 top-1/2 w-80 h-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute left-1/2 bottom-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)' }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" 
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      {/* Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `${(i * 47) % 100}%`,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

