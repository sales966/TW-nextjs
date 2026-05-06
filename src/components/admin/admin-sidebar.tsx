"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, PackageSearch, LogOut, Box, UserCog } from "lucide-react";

export default function AdminSidebar({ className, userRole = 'MANAGER' }: { className?: string, userRole?: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { label: "数据总览", href: "/admin", icon: LayoutDashboard },
    { label: "客户线索", href: "/admin/leads", icon: Users },
    { label: "报价引擎", href: "/admin/quote-requests", icon: FileText },
    { label: "产品配置", href: "/admin/products", icon: PackageSearch },
  ];

  // 只有超级管理员才显示账号管理
  if (userRole === 'ADMIN') {
    navItems.push({ label: "账号管理", href: "/admin/users", icon: UserCog });
  }

  return (
    <aside className={className}>
      <div className="p-8 pb-4">
         <Link href="/admin" className="text-2xl font-black text-slate-900 tracking-tight flex items-center no-underline gap-3">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
             <Box className="w-5 h-5 text-white" />
           </div>
           PackOS<span className="text-blue-600">.</span>
         </Link>
      </div>
      
      <div className="flex-1 py-8 px-4 space-y-2">
         <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">主菜单</p>
         {navItems.map((item) => {
           const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
           return (
             <Link key={item.label} href={item.href} className={`group relative flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 no-underline ${isActive ? 'text-blue-700 bg-blue-50/80 border border-blue-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
               {isActive && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
               )}
               <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
               {item.label}
             </Link>
           );
         })}
      </div>
      
      <div className="p-6 border-t border-slate-100">
         <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 group shadow-sm">
           <LogOut className="w-4 h-4 mr-3 group-hover:text-red-600 transition-colors" /> 退出系统
         </button>
      </div>
    </aside>
  );
}