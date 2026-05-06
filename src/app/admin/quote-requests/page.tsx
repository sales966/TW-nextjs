import Link from "next/link";
import { Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function QuotesListPage() {
  const quotes = await prisma.quoteRequest.findMany({
    include: { lead: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div><h1 className="text-2xl font-bold text-slate-900">报价引擎 (Quote Requests)</h1></div>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-sm w-full">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-slate-500 font-semibold text-xs uppercase">
               <tr>
                 <th className="p-4">单号</th>
                 <th className="p-4">客户信息</th>
                 <th className="p-4">产品类型</th>
                 <th className="p-4">数量</th>
                 <th className="p-4">状态</th>
                 <th className="p-4 text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {quotes.map((q) => (
                 <tr key={q.id} className="hover:bg-slate-50 transition">
                   <td className="p-4 font-mono font-medium text-slate-500 text-xs">{q.id.slice(-6)}</td>
                   <td className="p-4">
                     <div className="font-semibold text-slate-900">{q.lead?.companyName || q.lead?.contactName || '未知客户'}</div>
                     <div className="text-xs text-slate-500">{q.lead?.email}</div>
                   </td>
                   <td className="p-4 text-slate-700">{q.boxType.replace('_', ' ')}</td>
                   <td className="p-4 text-slate-700">{q.quantity}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${q.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                       {q.status}
                     </span>
                   </td>
                   <td className="p-4 text-right">
                     <Link href={`/admin/quote-requests/${q.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"><Eye className="w-4 h-4 inline" /></Link>
                   </td>
                 </tr>
               ))}
               {quotes.length === 0 && (
                 <tr><td colSpan={6} className="p-8 text-center text-slate-400">暂无报价请求</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}