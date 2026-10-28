"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuShieldCheck,
  LuSparkles,
  LuCheck,
  LuArrowRight,
  LuFileText,
  LuLock,
  LuClock,
  LuTrendingUp,
  LuChevronRight,
} from "react-icons/lu";

export default function LandingPage() {
  const features = [
    {
      icon: LuFileText,
      title: "పెండింగ్ దరఖాస్తులు",
      desc: "అన్ని దరఖాస్తులు ఒకే చోట. అత్యవసరమైనవి (Urgent) ఆటోమేటిక్‌గా పైకి వస్తాయి.",
    },
    {
      icon: LuSparkles,
      title: "AI సహాయం",
      desc: "సారాంశం, మిస్ అయిన పత్రాలు, మరియు తీసుకోవాల్సిన నిర్ణయంపై తక్షణ సూచనలు.",
    },
    {
      icon: LuCheck,
      title: "అధికారి నిర్ణయం",
      desc: "ఆమోదించు, తిరస్కరించు, లేదా తిరిగి పంపు. తుది నిర్ణయం ఎప్పుడూ అధికారిదే.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700 shadow-sm">
              <LuShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-tight">
                భూ రికార్డుల అధికారి
              </p>
              <p className="text-[11px] font-medium text-neutral-500 leading-tight">
                Revenue Officer Portal
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <LuLock className="h-4 w-4" />
            అధికారి లాగిన్
          </Link>
        </div>
      </header>

      {/* ================= HERO (With Image Background) ================= */}
      <section className="relative overflow-hidden bg-neutral-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              // ఒక ప్రభుత్వ కార్యాలయం లేదా ల్యాండ్ రికార్డ్స్ కి సంబంధించిన క్లీన్ ఫోటో
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Dark Blue Overlay for perfect text readability */}
        <div className="absolute inset-0 bg-primary-900/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-80" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 md:py-32 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent-300 border border-white/20 mb-8 backdrop-blur-sm">
              <LuSparkles className="h-3.5 w-3.5" />
              AI-సహాయక వ్యవస్థ
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              భూ రికార్డు దరఖాస్తులను <br className="hidden md:block" />
              <span className="text-accent-400">వేగంగా పరిష్కరించండి</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-neutral-200 leading-relaxed max-w-2xl mx-auto">
              తెలంగాణ రెవెన్యూ అధికారుల కోసం రూపొందించిన AI ప్లాట్‌ఫారమ్.
              పెండింగ్ దరఖాస్తులు, మిస్ అయిన పత్రాలు, మరియు సూచనలు — అన్నీ ఒకే
              చోట.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:bg-accent-400"
              >
                ప్రారంభించండి
                <LuArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                ఎలా పని చేస్తుంది?
                <LuChevronRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-b border-neutral-200 bg-neutral-50/50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-neutral-200 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <LuFileText className="h-6 w-6 text-primary-600 mb-3" />
              <p className="text-3xl font-bold text-neutral-900">6</p>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                నమూనా దరఖాస్తులు
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <LuTrendingUp className="h-6 w-6 text-primary-600 mb-3" />
              <p className="text-3xl font-bold text-neutral-900">3</p>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                ప్రాధాన్యత స్థాయిలు
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <LuClock className="h-6 w-6 text-primary-600 mb-3" />
              <p className="text-3xl font-bold text-neutral-900">2</p>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                నిమిషాల్లో AI విశ్లేషణ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            అధికారి పనిని సులభతరం చేసే ముఖ్యమైన భాగాలు
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            ప్రతి దరఖాస్తుపై స్పష్టమైన సమాచారం, తక్షణ సూచనలు, మరియు తుది నిర్ణయం
            మీదే.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 mb-6 border border-primary-100">
                <f.icon className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                {f.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              ఇప్పుడే ప్రారంభించండి
            </h2>
            <p className="mt-4 text-neutral-600">
              డెమో క్రెడెన్షియల్స్ ఉపయోగించి ప్లాట్‌ఫారమ్‌ను అన్వేషించండి.
            </p>
            <div className="mt-6 inline-flex flex-wrap justify-center items-center gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-700 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="text-neutral-500">యూజర్‌నేమ్:</span>
                <code className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-primary-700 border border-neutral-200">
                  officer
                </code>
              </span>
              <span className="hidden sm:block h-4 w-px bg-neutral-300" />
              <span className="flex items-center gap-2">
                <span className="text-neutral-500">పాస్‌వర్డ్:</span>
                <code className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs font-semibold text-primary-700 border border-neutral-200">
                  demo123
                </code>
              </span>
            </div>

            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-800 hover:shadow-md"
              >
                అధికారి లాగిన్
                <LuArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LuShieldCheck className="h-5 w-5 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-800">
              భూ రికార్డుల అధికారి పోర్టల్
            </span>
          </div>
          <p className="text-xs font-medium text-neutral-500 text-center md:text-right">
            Kenpath Full Stack AI Engineer Assignment
            <br className="hidden md:block" />
            <span className="text-neutral-400 mt-1 inline-block">
              Sample data only · No real citizen data used
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
