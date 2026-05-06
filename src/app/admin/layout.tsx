import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { getSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar 
        className="relative z-10 hidden md:flex w-72 flex-col bg-white border-r border-slate-200 shadow-sm" 
        userRole={session?.role}
      />
      
      <div className="relative z-10 flex flex-col flex-1 w-full overflow-hidden">
        <AdminHeader userName={session?.name || "管理员"} userRole={session?.role === "ADMIN" ? "超级管理员" : "管理员"} />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}