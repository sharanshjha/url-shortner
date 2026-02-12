import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";

import UrlForm from "../components/UrlForm";

const featureCards = [
  {
    title: "Instant redirects",
    body: "Optimized endpoint flow with safe validations and low-latency Mongo reads.",
  },
  {
    title: "Reliable auth",
    body: "HTTP-only token cookies, secure middleware chain, and session-aware dashboard.",
  },
  {
    title: "Actionable insights",
    body: "Track click volume and link activity from your personal control center.",
  },
];

const HomePage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="grid gap-8 pb-8 md:gap-10">
      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="fade-up">
          <p className="mb-3 inline-flex rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">
            Production-grade URL platform
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Shrink links with <span className="gradient-text">style, speed, and security.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--ink-2)] sm:text-lg">
            PulseLink turns long links into polished short URLs backed by hardened APIs, secure auth, and real-time click tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth"}
              className="action-btn bg-[var(--ink-1)] text-sm text-white"
            >
              {isAuthenticated ? "Open Dashboard" : "Create Free Account"}
            </Link>
            <a
              href="#features"
              className="action-btn border border-[rgba(20,33,61,0.2)] bg-white/75 text-sm font-semibold text-[var(--ink-1)]"
            >
              Explore Features
            </a>
          </div>
        </div>

        <UrlForm />
      </section>

      <section id="features" className="grid gap-4 sm:grid-cols-3">
        {featureCards.map((feature, idx) => (
          <article
            key={feature.title}
            className="glass-card fade-up rounded-2xl p-5"
            style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
          >
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm text-[var(--ink-2)]">{feature.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
