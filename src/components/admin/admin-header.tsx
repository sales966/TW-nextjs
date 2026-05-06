'use client'

import { Bell, Search, Hexagon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
}

export default function AdminHeader({ userName = "管理员", userRole = "工作区" }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-between px-8 flex-shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-4 w-96 relative group">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="搜索订单、线索..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm inset-shadow-sm"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
        </button>
        <div className="h-8 w-[1px] bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 leading-tight">{userName}</p>
            <p className="text-xs text-slate-500 font-medium">{userRole}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
             <Hexagon className="w-5 h-5" />
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-full border border-slate-200 group"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}