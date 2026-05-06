const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\tomor\\Documents\\003';

const files = {
  'src/app/admin/layout.tsx': `import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0f1c] text-slate-200 overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Premium ambient light background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      <AdminSidebar className="relative z-10 hidden md:flex w-72 flex-col bg-white/[0.02] backdrop-blur-3xl border-r border-white/10 shadow-2xl" />
      
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
    <header className="bg-white/[0.01] backdrop-blur-2xl border-b border-white/5 h-20 flex items-center justify-between px-8 flex-shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-4 w-96 relative group">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search orders, leads..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0a0f1c] rounded-full animate-pulse" />
        </button>
        <div className="h-8 w-[1px] bg-white/10" />
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200 leading-tight">Admin User</p>
            <p className="text-xs text-blue-400 font-medium">Workspace A</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-blue-900/20">
             <div className="w-full h-full bg-[#0a0f1c] rounded-full flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-white/90" />
             </div>
          </div>
        </button>
      </div>
    </header>
  );
}`,

  'src/components/admin/admin-sidebar.tsx': `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, PackageSearch, Layers, LogOut, Box } from "lucide-react";

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
         <Link href="/admin" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight flex items-center no-underline">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 shadow-lg shadow-blue-600/30">
             <Box className="w-6 h-6 text-white" />
           </div>
           PackOS<span className="text-blue-500">.</span>
         </Link>
      </div>
      
      <div className="flex-1 py-8 px-4 space-y-2">
         <p className="px-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Main Menu</p>
         {navItems.map((item) => {
           const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
           return (
             <Link key={item.label} href={item.href} className={\`group relative flex items-center px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 no-underline \${isActive ? 'text-white bg-blue-600/10 border border-blue-500/20 shadow-[inset_0px_0px_20px_rgba(37,99,235,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}\`}>
               {isActive && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
               )}
               <item.icon className={\`w-5 h-5 mr-4 flex-shrink-0 transition-colors \${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}\`} />
               {item.label}
             </Link>
           );
         })}
      </div>
      
      <div className="p-6">
         <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all duration-300 group">
           <LogOut className="w-4 h-4 mr-3 group-hover:text-red-400 transition-colors" /> Sign Out
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
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome back, Admin</h1>
          <p className="text-slate-400 text-lg">Here's the performance of your packaging platform today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md">
           <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
           <span className="text-sm font-semibold text-slate-200">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Active Leads", value: "1,248", trend: "+12% vs last month", icon: Users, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
          { label: "Quotes Pending Review", value: "24", trend: "Needs immediate action", icon: FileText, color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/20" },
          { label: "Live Configurations", value: "32", trend: "Product models active", icon: PackageSearch, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" }
        ].map((card, i) => (
          <div key={i} className="relative group rounded-3xl bg-white/[0.03] border border-white/10 p-8 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden hover:border-white/20">
             <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${card.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity\`} />
             <div className={\`w-14 h-14 rounded-2xl bg-gradient-to-br \${card.color} p-0.5 mb-6 shadow-lg \${card.shadow}\`}>
               <div className="w-full h-full bg-[#0a0f1c]/80 rounded-[14px] flex items-center justify-center backdrop-blur-md">
                 <card.icon className="w-6 h-6 text-white" />
               </div>
             </div>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{card.label}</p>
             <h3 className="text-5xl font-black text-white mb-4 tracking-tight">{card.value}</h3>
             <div className="flex items-center text-xs font-semibold text-slate-500">
               <ArrowUpRight className="w-3 h-3 mr-1 text-emerald-400" />
               {card.trend}
             </div>
          </div>
        ))}
      </div>

      {/* Bottom Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quotes Panel */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Recent Quote Requests</h3>
            <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-full">View All</button>
          </div>
          <div className="space-y-4">
            {mockQuotes.slice(0,5).map(quote => (
              <div key={quote.id} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-xs border border-blue-500/30">
                     {quote.id.split('_')[1]}
                   </div>
                   <div>
                     <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{quote.companyName}</p>
                     <p className="text-xs text-slate-400 mt-1">{quote.boxType.replace('_', ' ')}</p>
                   </div>
                </div>
                <span className={\`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border \${quote.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-300 border-slate-500/20'}\`}>
                  {quote.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Panel */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">New Inbound Leads</h3>
            <button className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-4 py-2 rounded-full">View All</button>
          </div>
          <div className="space-y-4">
            {mockLeads.slice(0,5).map(lead => (
              <div key={lead.id} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                    {lead.contactName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{lead.contactName}</p>
                    <p className="text-xs text-slate-400 mt-1">{lead.email}</p>
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-full text-slate-400 group-hover:text-white group-hover:bg-purple-500 transition-all">
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
  console.log('Updated Premium UI:', relativePath);
}
