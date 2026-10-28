"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  LuLock,
  LuUser,
  LuLoader,
  LuShieldCheck,
  LuArrowLeft,
  LuSparkles,
  LuCircleCheck,
} from "react-icons/lu";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) router.push("/dashboard");
      } catch {
        // ignore
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "లాగిన్ విఫలమైంది");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ================= LEFT SIDE: BRANDING & IMAGE (Desktop Only) ================= */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between p-12 bg-neutral-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-primary-900/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <LuShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              భూ రికార్డుల అధికారి
            </p>
            <p className="text-[11px] font-medium text-primary-200 leading-tight">
              Revenue Officer Portal
            </p>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            భూ రికార్డు దరఖాస్తులను <br />
            <span className="text-accent-400">వేగంగా పరిష్కరించండి</span>
          </h2>
          <p className="text-primary-100 text-sm leading-relaxed mb-8">
            తెలంగాణ రెవెన్యూ అధికారుల కోసం రూపొందించిన AI ప్లాట్‌ఫారమ్. పెండింగ్
            దరఖాస్తులు, మిస్ అయిన పత్రాలు, మరియు సూచనలు — అన్నీ ఒకే చోట.
          </p>

          <div className="space-y-3">
            {[
              "పెండింగ్ దరఖాస్తులపై స్పష్టమైన వ్యూ",
              "AI ద్వారా తక్షణ సారాంశం & సూచనలు",
              "తుది నిర్ణయం ఎప్పుడూ అధికారిదే",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-primary-50"
              >
                <LuCircleCheck className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-primary-300">
          © 2026 Kenpath Assignment. Sample data only.
        </div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM ================= */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Back to home (Mobile & Desktop) */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-primary-700 transition-colors"
          >
            <LuArrowLeft className="h-4 w-4" />
            హోమ్‌కు తిరిగి
          </Link>

          {/* Mobile Header (Since left side is hidden) */}
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
              <LuShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              అధికారి లాగిన్
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              దయచేసి మీ క్రెడెన్షియల్స్ నమోదు చేయండి
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">
              అధికారి లాగిన్
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              దయచేసి మీ అధికారిక క్రెడెన్షియల్స్ నమోదు చేయండి.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                యూజర్‌నేమ్
              </label>
              <div className="relative">
                <LuUser className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="officer"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                పాస్‌వర్డ్
              </label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-start gap-2"
              >
                <span className="mt-0.5 font-bold">!</span>
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LuLoader className="h-4 w-4 animate-spin" />
                  లాగిన్ అవుతోంది…
                </>
              ) : (
                "లాగిన్"
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-8 rounded-xl bg-neutral-50 p-4 border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <LuSparkles className="h-4 w-4 text-accent-600" />
              <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                Demo Credentials
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <div className="flex justify-between items-center">
                <span>యూజర్‌నేమ్:</span>
                <code className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-primary-700 border border-neutral-200">
                  officer
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span>పాస్‌వర్డ్:</span>
                <code className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-primary-700 border border-neutral-200">
                  demo123
                </code>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
