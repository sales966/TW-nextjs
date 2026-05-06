"use client";
import { useForm } from "react-hook-form";
import { Package, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const onSubmit = async () => window.location.href = "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4"><Package className="w-6 h-6" /></div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" {...register("email")} className="w-full border rounded-lg p-3 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" {...register("password")} className="w-full border rounded-lg p-3 outline-none" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800">
            <Lock className="w-4 h-4 mr-2" /> Sign In
          </button>
        </form>
      </div>
    </div>
  );
}