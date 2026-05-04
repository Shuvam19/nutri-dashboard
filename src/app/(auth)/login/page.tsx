"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsPending(false);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Brand Panel (Visible on Tablet/Desktop) */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-primary-50">
        <img
          src="/login-bg.png"
          alt="Healthy Nutrition"
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary-50/40 to-transparent" />

        <div className="relative z-10 flex flex-col h-full p-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-on-surface">NutriCRM</span>
          </div>

          <div className="mt-auto">
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-on-surface">
              Empowering <span className="text-primary">Nutritionists</span> to Transform Lives.
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
              The all-in-one CRM and meal planning platform designed for professional clinical excellence.
            </p>
          </div>

          <div className="mt-12 flex gap-12">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">500+</span>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Active Clinics</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">10k+</span>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Happy Clients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full space-y-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">N</span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight">Welcome back</h2>
            <p className="text-on-surface-variant mt-3 text-lg">Please enter your credentials to access your dashboard.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-on-surface-variant ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px]">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@clinic.com"
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl text-on-surface placeholder-outline focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-on-surface-variant"
                >
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl text-on-surface placeholder-outline focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-error-container/10 border border-error/20 rounded-2xl text-error text-sm font-bold animate-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 bg-primary text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-outline-variant/50">
            <p className="text-center text-sm text-on-surface-variant font-medium">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-primary hover:text-primary-700 transition-colors">Request access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
