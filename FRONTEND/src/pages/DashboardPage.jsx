import { useSelector } from "react-redux";

import UrlForm from "../components/UrlForm";
import UserUrl from "../components/UserUrl";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="grid gap-6 pb-8">
      <section className="glass-card fade-up rounded-3xl p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)]">Dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold">Welcome, {user?.name || "Creator"}</h1>
        <p className="mt-2 text-sm text-[var(--ink-2)]">
          Manage your link portfolio, monitor click trends, and publish new short URLs instantly.
        </p>
      </section>

      <UrlForm compact />
      <UserUrl />
    </div>
  );
};

export default DashboardPage;
