import { Users, FileText, PackageSearch, ArrowUpRight, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mockLeads, mockQuotes } from "@/lib/mock/admin";

export default async function AdminDashboard() {
  let leadsCount = 0, quotesCount = 0, productsCount = 0;
  let recentQuotes: any[] = [], recentLeads: any[] = [];
  let isDbConnected = false;

  try {
    [leadsCount, quotesCount, productsCount, recentQuotes, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.quoteRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { lead: true } }),
      prisma.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ]);
    isDbConnected = true;
  } catch (error) {
    console.warn("Database connection failed, falling back to mock data.", error);
    leadsCount = 1248; quotesCount = 24; productsCount = 32;
    recentQuotes = mockQuotes.slice(0, 5).map((q: any) => ({ ...q, lead: { companyName: q.companyName } }));
    recentLeads = mockLeads.slice(0, 5);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">欢迎回来，管理员</h1>
          <p className="text-slate-500 text-lg">这是您今天包装平台的运行数据概览。</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
           <Activity className={`w-4 h-4 ${isDbConnected ? 'text-green-500 animate-pulse' : 'text-amber-500'}`} />
           <span className="text-sm font-bold text-slate-700">{isDbConnected ? '系统运行中 (实时数据库)' : '模拟模式 (数据库离线)'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "活跃客户线索总数", value: leadsCount.toString(), trend: "实时记录", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "待审核报价单", value: quotesCount.toString(), trend: "需要立即处理", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "已上架产品型号", value: productsCount.toString(), trend: "活跃产品模型", icon: PackageSearch, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((card, i) => (
          <div key={i} className="group rounded-3xl bg-white border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
             <div className={`w-14 h-14 rounded-2xl ${card.bg} text-slate-900 flex items-center justify-center mb-6 border border-slate-100 shadow-sm`}>
                 <card.icon className={`w-6 h-6 ${card.color}`} />
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
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">近期报价请求</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-wider">查看全部</button>
          </div>
          <div className="space-y-3">
            {recentQuotes.map(quote => (
              <div key={quote.id} className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center font-bold font-mono text-xs border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                     {quote.id.slice(-4)}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{quote.lead?.companyName || quote.lead?.contactName || "未知名称"}</p>
                     <p className="text-xs text-slate-500 mt-1 font-medium">{quote.boxType.replace('_', ' ')}</p>
                   </div>
                </div>
                <span className={`px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider ${quote.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {quote.status}
                </span>
              </div>
            ))}
            {recentQuotes.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">暂无报价请求</div>
            )}
          </div>
        </div>

        {/* Leads Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">新增客户线索</h3>
            <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 px-4 py-2 rounded-full border border-slate-200 uppercase tracking-wider">查看全部</button>
          </div>
          <div className="space-y-3">
            {recentLeads.map(lead => (
              <div key={lead.id} className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                    {lead.contactName ? lead.contactName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{lead.contactName || "未知名称"}</p>
                    <p className="text-xs text-slate-500 mt-1">{lead.email}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">暂无客户线索</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}