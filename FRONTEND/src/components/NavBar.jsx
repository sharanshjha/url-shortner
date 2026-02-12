import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../api/user.api";
import { clearUser } from "../store/slice/authSlice";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: async () => {
      dispatch(clearUser());
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.removeQueries({ queryKey: ["userUrls"] });
      navigate({ to: "/" });
    },
  });

  return (
    <header className="sticky top-0 z-20 border-b border-white/55 bg-white/70 backdrop-blur-lg">
      <div className="shell flex h-16 items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="rounded-full bg-[var(--ink-1)] px-2 py-0.5 text-xs font-semibold text-white">PL</span>
          <span className="font-['Sora'] text-lg font-bold tracking-tight">PulseLink</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg border border-[rgba(20,33,61,0.18)] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--ink-1)] transition hover:bg-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="action-btn bg-[var(--ink-1)] px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Logout"
              >
                {logoutMutation.isPending ? "Signing out..." : `Logout ${user?.name?.split(" ")[0] || ""}`}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="action-btn rounded-lg bg-[var(--ink-1)] px-3 py-1.5 text-sm text-white"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
