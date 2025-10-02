import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Activity, Users, Shield, BarChart3, Zap, MapPin, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="relative rounded-2xl p-[1px] card-gradient"
  >
    <div className="rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-white/10 p-6 h-full">
      <div className={`inline-flex items-center justify-center rounded-xl p-3 mb-4 ${accent}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Stat = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
    <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">{label}</div>
  </div>
);

export default function LandingEventPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-600/40 to-purple-600/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-emerald-500/30 to-cyan-500/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0)_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center space-x-3 px-3 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Water Safety Intelligence Platform</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Predict. Prevent. Protect.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl">
              Real-time monitoring and ML-powered predictions to combat waterborne diseases across communities.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="btn-primary px-6 py-3 rounded-xl inline-flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/workflow" className="px-6 py-3 rounded-xl glass border border-white/15 inline-flex items-center text-white justify-center">
                Explore Workflow
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
              <Stat label="Villages" value="1,247" />
              <Stat label="Active Cases" value="23" />
              <Stat label="Resolved" value="1,156" />
              <Stat label="Accuracy" value="94.2%" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white">Everything you need for proactive public health</h2>
            <p className="text-gray-400 mt-3">Built for ASHA workers, PHCs, and health officials</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={Activity} title="Real-Time Monitoring" description="Live dashboards, alerts, and streaming data from the field for immediate response." accent="bg-blue-500/20 border border-blue-400/20" />
            <FeatureCard icon={Shield} title="Risk Assessment" description="Automated risk scoring and recommendations based on environmental and health signals." accent="bg-purple-500/20 border border-purple-400/20" />
            <FeatureCard icon={Users} title="Community Network" description="Coordination tools for ASHA workers, PHCs, and officials to act quickly." accent="bg-emerald-500/20 border border-emerald-400/20" />
            <FeatureCard icon={BarChart3} title="Analytics & Reports" description="Visualize trends, manage outbreaks, and generate actionable insights." accent="bg-amber-500/20 border border-amber-400/20" />
            <FeatureCard icon={Zap} title="Automations" description="Automated workflows for case triage, notification routing, and follow-ups." accent="bg-cyan-500/20 border border-cyan-400/20" />
            <FeatureCard icon={MapPin} title="Geo Insights" description="Hotspot mapping to focus resources where they're needed most." accent="bg-rose-500/20 border border-rose-400/20" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl p-[1px] card-gradient">
            <div className="rounded-3xl bg-gray-900/70 border border-white/10 px-8 py-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to safeguard your community?</h3>
              <p className="text-gray-400 mt-3">Start with live dashboards, AI predictions, and collaborative tools.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login" className="btn-primary px-6 py-3 rounded-xl">Sign In</Link>
                <Link to="/reports" className="px-6 py-3 rounded-xl glass border border-white/15 text-white">View Reports</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
