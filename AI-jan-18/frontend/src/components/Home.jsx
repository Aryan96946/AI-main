import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Shield, Users, TrendingUp, Calendar, MessageSquare,
  BarChart3, Lock, ChevronRight, Play, CheckCircle, Sparkles
} from "lucide-react";
import AnimatedCounter from "./shared/AnimatedCounter";
import GlassCard from "./shared/GlassCard";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Brain size={24} className="text-gray-900" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI Dropout Prediction
            </h2>
            <p className="text-xs text-gray-400">Smart Student Support System</p>
          </div>
        </motion.div>

        <motion.nav 
          className="hidden md:flex gap-8 items-center text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {['Home', 'Features', 'How it works', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-gray-300 hover:text-white transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.button
            onClick={() => navigate("/login")}
            className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in
          </motion.button>
        </motion.nav>
      </header>

      {/* Main */}
      <main className="relative z-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 px-4 py-2 rounded-full"
              >
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-300">AI-Powered Student Success</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Predict. Prevent.
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Support Students.
                </span>
              </h2>

              <p className="text-lg text-gray-300 max-w-xl">
                Reduce student dropout with AI-driven insights and human-first 
                counseling. Identify at-risk students early and provide personalized support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={18} className="fill-white" />
                  Try the Demo
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.a>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: 92, suffix: '%', label: 'Accuracy' },
                  { value: 85, suffix: '%', label: 'Retention' },
                  { value: 500, suffix: '+', label: 'Students' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} duration={2} />
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <GlassCard className="p-8" glowEffect>
                {/* Dashboard Preview */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white">Risk Overview</h4>
                      <p className="text-sm text-gray-400">Real-time student monitoring</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-400">Live</span>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'High Risk', value: '12', color: 'red' },
                      { label: 'Medium Risk', value: '28', color: 'yellow' },
                      { label: 'Low Risk', value: '145', color: 'emerald' },
                      { label: 'Counseling', value: '8', color: 'blue' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className={`p-4 rounded-xl bg-gray-800/50 border border-gray-700/50`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <p className="text-sm text-gray-400">{item.label}</p>
                        <p className={`text-2xl font-bold ${
                          item.color === 'red' ? 'text-red-400' :
                          item.color === 'yellow' ? 'text-yellow-400' :
                          item.color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini Chart */}
                  <div className="h-32 bg-gray-800/30 rounded-xl p-4 flex items-end gap-2">
                    {[65, 45, 78, 52, 89, 43, 67, 75, 58, 82, 49, 71].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-500/60 to-cyan-500/60 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Floating Cards */}
              <motion.div
                className="absolute -top-4 -right-4 p-3 bg-gray-800/90 backdrop-blur rounded-xl border border-gray-700/50 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-emerald-400" />
                  <span className="text-xs font-medium">AI Analysis</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 p-3 bg-gray-800/90 backdrop-blur rounded-xl border border-gray-700/50 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-cyan-400" />
                  <span className="text-xs font-medium">Privacy First</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools for educational institutions to identify and support at-risk students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Predictive Analytics',
                desc: 'ML-powered dropout risk prediction using academic and behavioral data',
                color: 'emerald',
                features: ['Early detection', '95% accuracy', 'Real-time updates']
              },
              {
                icon: Users,
                title: 'Counselor Workspace',
                desc: 'Streamlined tools for scheduling sessions, tracking progress, and managing notes',
                color: 'blue',
                features: ['Session tracking', 'Progress dashboards', 'Automated reminders']
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Comprehensive insights into student performance and institutional trends',
                color: 'purple',
                features: ['Custom reports', 'Trend analysis', 'Export options']
              },
              {
                icon: Lock,
                title: 'Privacy First',
                desc: 'Enterprise-grade security with role-based access controls',
                color: 'amber',
                features: ['Encryption', 'GDPR compliant', 'Audit logs']
              },
              {
                icon: MessageSquare,
                title: 'Smart Notifications',
                desc: 'Automated alerts for counselors when students need attention',
                color: 'cyan',
                features: ['Email & SMS', 'Custom triggers', 'Escalation rules']
              },
              {
                icon: TrendingUp,
                title: 'Intervention Tracking',
                desc: 'Monitor the effectiveness of support strategies over time',
                color: 'rose',
                features: ['Outcome metrics', 'ROI analysis', 'Best practices']
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hoverEffect className="h-full">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                    <feature.icon size={24} className={`text-${feature.color}-400`} />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{feature.desc}</p>
                  <ul className="space-y-2">
                    {feature.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className={`text-${feature.color}-400`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A simple three-step process to transform student outcomes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: BarChart3,
                title: 'Collect Signals',
                desc: 'Automatically gather academic data, attendance records, and engagement metrics from existing systems.',
                color: 'blue'
              },
              {
                step: '02',
                icon: Brain,
                title: 'Predict & Analyze',
                desc: 'AI model identifies at-risk students with explainable factors, highlighting key intervention points.',
                color: 'emerald'
              },
              {
                step: '03',
                icon: Calendar,
                title: 'Act & Track',
                desc: 'Counselors plan interventions, track progress, and measure the impact of support strategies.',
                color: 'purple'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <GlassCard className="h-full text-center relative overflow-hidden">
                  {/* Step Number */}
                  <div className={`absolute top-4 right-4 text-6xl font-bold text-${item.color}-500/10`}>
                    {item.step}
                  </div>

                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center`}>
                    <item.icon size={32} className={`text-${item.color}-400`} />
                  </div>
                  
                  <h4 className="text-xl font-semibold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>

                  {/* Connector */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-700 to-transparent" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            
            <GlassCard className="relative z-10 p-8 md:p-12 text-center border-0">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Student Success?
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Join educational institutions using AI to identify and support at-risk students before it's too late.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Demo
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h3>
            
            <GlassCard className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Users, label: 'Team', value: 'Group Project', subtext: 'GECA Ajmer' },
                  { icon: MailIcon, label: 'Email', value: 'aryannawal185@gmail.com', subtext: '' },
                  { icon: PhoneIcon, label: 'Phone', value: '+91 95862 72685', subtext: '' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <item.icon size={24} className="text-amber-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                    {item.subtext && (
                      <p className="text-gray-500 text-sm">{item.subtext}</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AI Dropout Prediction System | Built with ❤️ for student success
          </p>
        </footer>
      </main>
    </div>
  );
}

// Helper icons
function MailIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function PhoneIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

