import { useState } from "react";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <section className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
      <div className="glass-card fade-up rounded-3xl p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">Authentication</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Build trusted short links at scale.</h1>
        <p className="mt-3 text-sm text-[var(--ink-2)] sm:text-base">
          Sign in to control branded links, view click analytics, and operate your own production-grade URL stack.
        </p>
        <div className="mt-5 space-y-2 text-sm text-[var(--ink-2)]">
          <p>1. Secure JWT cookie sessions</p>
          <p>2. Rate-limited, validated API requests</p>
          <p>3. Full link ownership controls</p>
        </div>
      </div>

      <div key={isLoginMode ? "login" : "register"} className="fade-up">
        {isLoginMode ? (
          <LoginForm onToggle={() => setIsLoginMode(false)} />
        ) : (
          <RegisterForm onToggle={() => setIsLoginMode(true)} />
        )}
      </div>
    </section>
  );
};

export default AuthPage;
