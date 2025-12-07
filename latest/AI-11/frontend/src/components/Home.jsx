import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 text-slate-100">
      <BgAnim />

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoBox />
          <div>
            <h2 className="text-xs text-slate-300">
              AI Dropout Prediction & Counseling System
            </h2>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#how" className="hover:text-white">
            How it works
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
          <button
            onClick={() => navigate("/login")}
            className="ml-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur"
          >
            Sign in
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid gap-12 grid-cols-1 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-sm text-emerald-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5v14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Predict • Prevent • Counsel
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Reduce student dropout with AI-driven insights and human-first
              counseling
            </h2>

            

            <div className="flex gap-4 items-center">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-3 bg-emerald-400 text-slate-900 font-semibold px-5 py-3 rounded-lg shadow-lg hover:scale-[1.02] transform transition"
              >
                Try the demo
              </button>
              <a
                href="#how"
                className="text-sm text-slate-300 hover:text-white"
              >
                Learn how it works →
              </a>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatsBox value="92%" label="Early detection" />
              <StatsBox value="3x" label="Improved retention" />
              <StatsBox value="Personal" label="Tailored counseling" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="w-[460px] max-w-full">
              <DashPreview />
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-6">What it does</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Predictive Models"
              desc="Uses ML to find students at risk early using academic and emotional data."
              icon={PredictIcon}
            />
            <FeatureCard
              title="Counselor Workspace"
              desc="Helps counselors schedule sessions, record notes and track student progress."
              icon={CounselIcon}
            />
            <FeatureCard
              title="Privacy-first"
              desc="All data is encrypted with restricted access to protect student privacy."
              icon={ShieldIcon}
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-6">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <StepBox
              index={1}
              title="Collect Signals"
              desc="Attendance, grades, and LMS data combined securely."
            />
            <StepBox
              index={2}
              title="Predict & Explain"
              desc="Model predicts dropout risk with explainable factors."
            />
            <StepBox
              index={3}
              title="Act & Track"
              desc="Counselors plan and track interventions effectively."
            />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="max-w-7xl mx-auto px-6 py-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-white/10 to-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur"
          >
            <h3 className="text-3xl font-bold mb-4">📞 Contact Us</h3>
            <p className="text-slate-300 mb-6">
              Have questions or want to collaborate? Reach out anytime.
            </p>
            <div className="space-y-2 text-slate-200">
              <p>
                📍 <span className="font-medium">Address:</span> Government Engineering College, Ajmer, India
              </p>
              <p>
                📧{" "}
                <a
                  href="mailto:aryannawal185@gmail.com"
                  className="text-emerald-400 hover:underline"
                >
                  aryannawal185@gmail.com
                </a>
              </p>
              <p>
                ☎️{" "}
                <a
                  href="tel:+919586272685"
                  className="text-emerald-400 hover:underline"
                >
                  +91 95862 72685
                </a>
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-r from-white/6 to-white/3 backdrop-blur p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h4 className="text-2xl font-bold">
                Ready to protect your students?
              </h4>
              <p className="text-slate-300">
                Join our pilot program and start predicting today!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 rounded-lg bg-emerald-400 text-slate-900 font-semibold"
              >
                Request demo
              </button>
              <a
                href="#contact"
                className="px-6 py-3 rounded-lg border border-white/10"
              >
                Contact
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-400 text-center">
          © {new Date().getFullYear()} | Group Project
        </footer>
      </main>
    </div>
  );
}

/* --- Subcomponents (unchanged) --- */
function LogoBox() {
  return (
    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12h16M12 4v16"
          stroke="#022"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
function StatsBox({ value, label }) {
  return (
    <div className="bg-white/3 px-3 py-2 rounded-lg text-center">
      <div className="text-xl font-medium">{value}</div>
      <div className="text-xs text-slate-300">{label}</div>
    </div>
  );
}
function FeatureCard({ title, desc, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-xl p-6 bg-white/4 backdrop-blur border border-white/6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-md bg-white/6">
          <Icon />
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-slate-300 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
function PredictIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h4l2 4 4-8 4 6h4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function CounselIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12c2.5 0 4-1.5 4-3.5S14.5 5 12 5 8 6.5 8 8.5 9.5 12 12 12z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6 19c1.5-3 4-4 6-4s4.5 1 6 4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4v5c0 5-3.6 9-8 10-4.4-1-8-5-8-10V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function StepBox({ index, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-xl bg-white/4 border border-white/6"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center font-semibold">
          {index}
        </div>
        <div>
          <h5 className="font-semibold">{title}</h5>
          <p className="text-sm text-slate-300 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
function DashPreview() {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/6 to-white/4 backdrop-blur border border-white/8 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold">Risk heatmap</h4>
          <p className="text-sm text-slate-300">At-risk students (live)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
            AI
          </div>
          <div className="text-xs text-slate-400">v1.0</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-36 rounded-lg bg-gradient-to-br from-rose-500/20 via-amber-300/10 to-emerald-400/10 p-3"
        >
          <svg viewBox="0 0 200 150" className="w-full h-full">
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 8 }).map((__, c) => {
                const x = c * 24 + 6;
                const y = r * 26 + 6;
                const intensity =
                  Math.round(Math.abs(Math.sin((r + c) / 3) * 9)) + 1;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x}
                    y={y}
                    width={18}
                    height={18}
                    rx={3}
                    fill={`rgba(255,255,255,${0.03 * intensity})`}
                  />
                );
              })
            )}
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-36 rounded-lg bg-white/3 p-3 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Top risk factors</div>
              <div className="text-xs text-slate-300">
                Attendance, grades, low engagement
              </div>
            </div>
            <div className="text-xs">More →</div>
          </div>

          <div className="flex gap-2">
            <Badge label="Attendance" value="82%" />
            <Badge label="Engagement" value="45%" />
            <Badge label="Grades" value="2.7/4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
function Badge({ label, value }) {
  return (
    <div className="bg-white/6 rounded-md px-3 py-2 text-center text-xs w-full">
      <div className="font-semibold">{value}</div>
      <div className="text-slate-300">{label}</div>
    </div>
  );
}
function BgAnim() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-transparent to-purple-900 opacity-40" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-10 top-10 w-72 h-72 rounded-full blur-3xl bg-purple-700/30"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute right-20 top-40 w-56 h-56 rounded-full blur-2xl bg-emerald-500/20"
      />
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/10 rounded-full"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
