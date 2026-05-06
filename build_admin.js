const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\tomor\\Documents\\003';

const files = {
  'src/app/admin/layout.tsx': `import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-slate-800" />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}`,

  'src/components/admin/admin-header.tsx': `export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
      <div className="font-semibold text-slate-800">Workspace</div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">A</div>
      </div>
    </header>
  );
}`,

  'src/components/admin/admin-sidebar.tsx': `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, PackageSearch, Layers, LogOut } from "lucide-react";

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: Users },
    { label: "Inquiries (Quotes)", href: "/admin/quote-requests", icon: FileText },
    { label: "Products", href: "/admin/products", icon: PackageSearch },
  ];

  return (
    <aside className={className}>
      <div className="p-6 border-b border-slate-800">
         <div className="text-xl font-black text-white tracking-tight flex items-center">
           <PackageSearch className="w-6 h-6 mr-2 text-blue-500" /> PackAdmin.
         </div>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1">
         <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Operations</p>
         {navItems.map((item) => {
           const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
           return (
             <Link key={item.label} href={item.href} className={\`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}>
               <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
               {item.label}
             </Link>
           );
         })}
      </div>
      <div className="p-4 border-t border-slate-800 mt-auto">
         <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
           <LogOut className="w-4 h-4 mr-3" /> Log Out
         </button>
      </div>
    </aside>
  );
}`,

  'src/app/admin/login/page.tsx': `"use client";
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
}`,

  'src/app/admin/page.tsx': `import Link from "next/link";
import { Users, FileText, PackageSearch, ArrowUpRight } from "lucide-react";
import { mockLeads, mockQuotes } from "@/lib/mock/admin";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your platform today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Leads", value: "1,248", icon: Users, color: "text-blue-600" },
          { label: "Pending Quotes", value: "24", icon: FileText, color: "text-amber-600" },
          { label: "Active Products", value: "32", icon: PackageSearch, color: "text-emerald-600" }
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
             <div className={\`p-2 bg-slate-50 rounded-lg w-fit mb-4 \${card.color}\`}><card.icon className="w-5 h-5" /></div>
             <p className="text-slate-500 text-sm font-medium">{card.label}</p>
             <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'src/app/admin/quote-requests/page.tsx': `import Link from "next/link";
import { Eye } from "lucide-react";
import { mockQuotes } from "@/lib/mock/admin";

export default function QuotesListPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div><h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1></div>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-sm w-full">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-slate-500 font-semibold text-xs uppercase">
               <tr><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {mockQuotes.map((q) => (
                 <tr key={q.id} className="hover:bg-slate-50 transition">
                   <td className="p-4 font-mono font-medium text-slate-600">{q.id}</td>
                   <td className="p-4"><div className="font-semibold text-slate-900">{q.companyName}</div></td>
                   <td className="p-4"><span className="px-2 py-1 text-[10px] font-bold rounded-full uppercase bg-amber-100 text-amber-800">{q.status}</span></td>
                   <td className="p-4 text-right">
                     <Link href={\`/admin/quote-requests/\${q.id}\`} className="p-2 text-blue-600 hover:underline"><Eye className="w-4 h-4 inline" /></Link>
                   </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created Admin:', relativePath);
}
