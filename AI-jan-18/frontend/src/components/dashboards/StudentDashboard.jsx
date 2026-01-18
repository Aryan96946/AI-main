import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from "recharts";
import { 
  User, BookOpen, TrendingUp, Clock, Award, AlertTriangle,
  CheckCircle, Calendar, Target, Activity, ChevronRight
} from "lucide-react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import GlassCard from "../shared/GlassCard";
import ProgressRing from "../shared/ProgressRing";
import AnimatedCounter from "../shared/AnimatedCounter";
import RiskMeter from "../shared/RiskMeter";
import ProfileCard from "../shared/ProfileCard";
import StatCard from "../shared/StatCard";
import Tabs from "../shared/Tabs";

export default function StudentDashboard({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [err, setErr] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setErr("");
      try {
        const profileRes = await API.get("/students/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(profileRes.data.student);

        if (user.role === 'admin' || user.role === 'teacher') {
          const allRes = await API.get("/students/", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setAllStudents(allRes.data.students);
        }
      } catch (error) {
        if (error.response?.status === 401) handleLogout();
        else setErr(error.response?.data?.error || "Failed to load data");
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (err)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="bg-red-500/20 border border-red-500/50 text-red-400 px-8 py-6 rounded-2xl text-xl backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {err}
        </motion.div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-gray-400 text-lg">Loading your dashboard...</span>
        </motion.div>
      </div>
    );

  const latestPrediction = profile.predictions?.[profile.predictions.length - 1];
  const latestRiskScore = latestPrediction?.risk_score ?? 0;
  const latestRiskTier = latestPrediction?.risk_tier ?? "Unknown";

  // Enhanced data preparation
  const performanceData = [
    { name: "Attendance", value: profile.attendance || 0, color: "#3b82f6", icon: "📊" },
    { name: "Avg Score", value: profile.avg_score || 0, color: "#10b981", icon: "📈" },
    { name: "Grade", value: profile.grade || 0, color: "#f59e0b", icon: "🏆" },
    { name: "Approved", value: Math.round(((profile.curricular_units_1st_sem_approved || 0) + (profile.curricular_units_2nd_sem_approved || 0)) / 2), color: "#8b5cf6", icon: "✅" },
  ];

  const radarData = [
    { subject: "1st Sem Grade", A: profile.curricular_units_1st_sem_grade || 0, fullMark: 20 },
    { subject: "2nd Sem Grade", A: profile.curricular_units_2nd_sem_grade || 0, fullMark: 20 },
    { subject: "Attendance", A: profile.attendance || 0, fullMark: 100 },
    { subject: "Avg Score", A: profile.avg_score || 0, fullMark: 20 },
    { subject: "Approval Rate", A: Math.round(((profile.curricular_units_1st_sem_approved || 0) / Math.max(profile.curricular_units_1st_sem_enrolled || 1, 1)) * 100), fullMark: 100 },
  ];

  const semesterData = [
    { semester: "1st Sem", enrolled: profile.curricular_units_1st_sem_enrolled || 0, approved: profile.curricular_units_1st_sem_approved || 0, grade: profile.curricular_units_1st_sem_grade || 0 },
    { semester: "2nd Sem", enrolled: profile.curricular_units_2nd_sem_enrolled || 0, approved: profile.curricular_units_2nd_sem_approved || 0, grade: profile.curricular_units_2nd_sem_grade || 0 },
  ];

  const riskTrendData = profile.predictions?.map((p, index) => ({
    prediction: `P${index + 1}`,
    riskScore: p.risk_score,
    riskTier: p.risk_tier === "High" ? 3 : p.risk_tier === "Medium" ? 2 : 1
  })) || [];

  const approvalRate = Math.round(((profile.curricular_units_1st_sem_approved || 0) + (profile.curricular_units_2nd_sem_approved || 0)) / 
    Math.max((profile.curricular_units_1st_sem_enrolled || 0) + (profile.curricular_units_2nd_sem_enrolled || 0), 1) * 100);

  const tabs = [
    {
      label: "Overview",
      icon: <Activity size={18} />,
      content: (
        <div className="space-y-6">
          {/* Profile Card */}
          <ProfileCard 
            user={profile} 
            stats={{
              "Avg Score": profile.avg_score || 0,
              "Attendance": `${profile.attendance || 0}%`,
              "Grade": profile.grade || 0
            }}
          />

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Attendance" 
              value={profile.attendance || 0} 
              suffix="%" 
              icon={Clock} 
              color="blue"
            />
            <StatCard 
              title="Avg Score" 
              value={profile.avg_score || 0} 
              icon={TrendingUp} 
              color="emerald"
            />
            <StatCard 
              title="Grade" 
              value={profile.grade || 0} 
              icon={Award} 
              color="amber"
            />
            <StatCard 
              title="Risk Score" 
              value={latestRiskScore} 
              icon={AlertTriangle} 
              color={latestRiskTier === "High" ? "red" : latestRiskTier === "Medium" ? "amber" : "emerald"}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Performance Overview
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={performanceData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <Target size={20} /> Skills Radar
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar name="Performance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Semester Progress */}
          <GlassCard>
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Calendar size={20} /> Semester Progress
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={semesterData}>
                <defs>
                  <linearGradient id="enrolledGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="semester" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="enrolled" stroke="#3b82f6" fill="url(#enrolledGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="approved" stroke="#10b981" fill="url(#approvedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )
    },
    {
      label: "Details",
      icon: <BookOpen size={18} />,
      content: (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <User size={20} /> Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Name", value: profile.full_name, icon: User },
                { label: "Course", value: profile.course, icon: BookOpen },
                { label: "Gender", value: profile.gender, icon: User },
                { label: "Age at Enrollment", value: profile.age_at_enrollment, icon: Calendar },
                { label: "Marital Status", value: profile.marital_status, icon: User },
                { label: "Application Mode", value: profile.application_mode, icon: Target },
                { label: "Scholarship", value: profile.scholarship_holder ? "Yes" : "No", icon: Award },
                { label: "Tuition Fees", value: profile.tuition_fees_up_to_date ? "Up to Date" : "Pending", icon: CheckCircle },
                { label: "Debtor", value: profile.debtor ? "Yes" : "No", icon: AlertTriangle },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-800/50 rounded-xl flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Target size={20} /> Academic Progress
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center">
                <ProgressRing progress={approvalRate} color="#10b981" label="Approval Rate" />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing progress={profile.attendance || 0} color="#3b82f6" label="Attendance" />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing progress={(profile.grade / 20) * 100 || 0} color="#f59e0b" label="Grade" />
              </div>
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      label: "Risk Analysis",
      icon: <AlertTriangle size={18} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <Activity size={20} /> Current Risk Assessment
              </h4>
              <div className="flex justify-center">
                <RiskMeter riskScore={latestRiskScore} riskTier={latestRiskTier} size="large" />
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Risk Trend
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="prediction" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="riskScore" stroke="#ef4444" fill="url(#riskGradient)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Recommendations */}
          <GlassCard>
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Target size={20} /> Recommendations
            </h4>
            <div className="space-y-3">
              {latestRiskTier === "High" && (
                <motion.div 
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-400 font-medium">High Risk Alert</p>
                    <p className="text-gray-300 text-sm">Consider scheduling a counseling session with your advisor immediately to discuss academic support options.</p>
                  </div>
                </motion.div>
              )}
              <motion.div 
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-emerald-400 font-medium">Study Tips</p>
                  <p className="text-gray-300 text-sm">Maintain regular attendance and complete all assignments on time to improve your academic performance.</p>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      label: "Counseling",
      icon: <Calendar size={18} />,
      content: (
        <GlassCard>
          <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <Calendar size={20} /> Counseling Sessions
          </h4>
          {profile.counseling_sessions?.length ? (
            <div className="space-y-4">
              {profile.counseling_sessions.map((s, index) => (
                <motion.div
                  key={s.id || index}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-200">{s.notes}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(s.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-500" size={20} />
                  </div>
                  {s.follow_up_at && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      <Calendar size={14} />
                      Follow-up: {new Date(s.follow_up_at).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No counseling sessions scheduled yet.</p>
              <p className="text-sm text-gray-500 mt-1">Contact your advisor if you need support.</p>
            </motion.div>
          )}
        </GlassCard>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Student Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {profile.full_name}</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl font-medium border border-red-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
}

