import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";

import { registerUser } from "../api/user.api";
import { setUser } from "../store/slice/authSlice";

const RegisterForm = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      dispatch(setUser(data.user));
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/dashboard" });
    },
  });

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card w-full rounded-3xl p-6 sm:p-7">
      <h2 className="text-2xl font-bold">Create account</h2>
      <p className="mt-1 text-sm text-[var(--ink-2)]">Get custom slugs, personal dashboard, and link metrics.</p>

      <div className="mt-5 grid gap-3">
        <div>
          <label htmlFor="register-name" className="mb-1 block text-sm font-semibold">
            Name
          </label>
          <input
            id="register-name"
            name="name"
            className="input"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            minLength={2}
            required
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="register-email"
            name="email"
            className="input"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password" className="mb-1 block text-sm font-semibold">
            Password
          </label>
          <input
            id="register-password"
            name="password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="action-btn mt-2 bg-[var(--ink-1)] text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          {registerMutation.isPending ? "Creating..." : "Create account"}
        </button>
      </div>

      {registerMutation.isError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {registerMutation.error.message}
        </p>
      )}

      <p className="mt-4 text-sm text-[var(--ink-2)]">
        Already registered?{" "}
        <button type="button" onClick={onToggle} className="font-semibold text-[var(--accent-2)] hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
