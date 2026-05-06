const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\tomor\\Documents\\003';

const files = {
  'src/app/admin/layout.tsx': `import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar className="relative z-10 hidden md:flex w-72 flex-col bg-white border-r border-slate-200 shadow-sm" />
      
      <div className="relative z-10 flex flex-col flex-1 w-full overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}`,

  'src/components/admin/admin-header.tsx': `import { Bell, Search, Hexagon } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-between px-8 flex-shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-4 w-96 relative group">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search orders, leads..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm inset-shadow-sm"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
        </button>
        <div className="h-8 w-[1px] bg-slate-200" />
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 leading-tight">Admin User</p>
            <p className="text-xs text-slate-500 font-medium">Workspace A</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
             <Hexagon className="w-5 h-5" />
          </div>
        </button>
      </div>
    </header>
  );
}`,

  'src/components/admin/admin-sidebar.tsx': `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, PackageSearch, LogOut, Box } from "lucide-react";

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Customer Leads", href: "/admin/leads", icon: Users },
    { label: "Quote Engine", href: "/admin/quote-requests", icon: FileText },
    { label: "Product Configs", href: "/admin/products", icon: PackageSearch },
  ];

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
         <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Main Menu</p>
         {navItems.map((item) => {
           const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
           return (
             <Link key={item.label} href={item.href} className={\`group relative flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 no-underline \${isActive ? 'text-blue-700 bg-blue-50/80 border border-blue-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}\`}>
               {isActive && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
               )}
               <item.icon className={\`w-5 h-5 mr-3 flex-shrink-0 transition-colors \${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}\`} />
               {item.label}
             </Link>
           );
         })}
      </div>
      
      <div className="p-6 border-t border-slate-100">
         <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 group shadow-sm">
           <LogOut className="w-4 h-4 mr-3 group-hover:text-red-600 transition-colors" /> Sign Out
         </button>
      </div>
    </aside>
  );
}`,

  'src/app/admin/page.tsx': `import { Users, FileText, PackageSearch, ArrowUpRight, Activity } from "lucide-react";
import { mockLeads, mockQuotes } from "@/lib/mock/admin";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back, Admin</h1>
          <p className="text-slate-500 text-lg">Here's the performance of your packaging platform today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
           <Activity className="w-4 h-4 text-green-500 animate-pulse" />
           <span className="text-sm font-bold text-slate-700">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Active Leads", value: "1,248", trend: "+12% vs last month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Quotes Pending Review", value: "24", trend: "Needs immediate action", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Live Configurations", value: "32", trend: "Product models active", icon: PackageSearch, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((card, i) => (
          <div key={i} className="group rounded-3xl bg-white border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
             <div className={\`w-14 h-14 rounded-2xl \${card.bg} text-slate-900 flex items-center justify-center mb-6 border border-slate-100 shadow-sm\`}>
                 <card.icon className={\`w-6 h-6 \${card.color}\`} />
             </div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{card.label}</p>
             <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{card.value}</h3>
             <div className="flex items-center text-xs font-bold text-slate-500">
               <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
               <span className="bg-slate-100 px-2 py-0.5 rounded-full">{card.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Bottom Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quotes Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Quote Requests</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-3">
            {mockQuotes.slice(0,5).map(quote => (
              <div key={quote.id} className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center font-bold font-mono text-xs border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                     {quote.id.split('_')[1]}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{quote.companyName}</p>
                     <p className="text-xs text-slate-500 mt-1 font-medium">{quote.boxType.replace('_', ' ')}</p>
                   </div>
                </div>
                <span className={\`px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider \${quote.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}\`}>
                  {quote.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">New Inbound Leads</h3>
            <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 px-4 py-2 rounded-full border border-slate-200 uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-3">
            {mockLeads.slice(0,5).map(lead => (
              <div key={lead.id} className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                    {lead.contactName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{lead.contactName}</p>
                    <p className="text-xs text-slate-500 mt-1">{lead.email}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Updated Light Admin UI:', relativePath);
}
