import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";

import { loginUser } from "../api/user.api";
import { setUser } from "../store/slice/authSlice";

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      dispatch(setUser(data.user));
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/dashboard" });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card w-full rounded-3xl p-6 sm:p-7">
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <p className="mt-1 text-sm text-[var(--ink-2)]">Sign in to manage your links and analytics.</p>

      <div className="mt-5 grid gap-3">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="login-email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-semibold">
            Password
          </label>
          <input
            id="login-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="action-btn mt-2 bg-[var(--ink-1)] text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </div>

      {loginMutation.isError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {loginMutation.error.message}
        </p>
      )}

      <p className="mt-4 text-sm text-[var(--ink-2)]">
        New to PulseLink?{" "}
        <button type="button" onClick={onToggle} className="font-semibold text-[var(--accent-2)] hover:underline">
          Create account
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
