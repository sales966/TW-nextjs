import Link from "next/link";
import { Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function LeadsListPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">客户线索 (Leads)</h1>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-sm w-full">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b text-slate-500 font-semibold text-xs uppercase">
               <tr>
                 <th className="p-4">联系人</th>
                 <th className="p-4">公司</th>
                 <th className="p-4">国家</th>
                 <th className="p-4">状态</th>
                 <th className="p-4 text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {leads.map((lead: any) => (
                 <tr key={lead.id} className="hover:bg-slate-50 transition">
                   <td className="p-4">
                     <div className="font-semibold text-slate-900">{lead.contactName}</div>
                     <div className="text-xs text-slate-500">{lead.email}</div>
                   </td>
                   <td className="p-4 font-medium text-slate-600">{lead.companyName || '-'}</td>
                   <td className="p-4 text-slate-600">{lead.country}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>{lead.status}</span>
                   </td>
                   <td className="p-4 text-right">
                     <Link href={`/admin/leads/${lead.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"><Eye className="w-4 h-4 inline" /></Link>
                   </td>
                 </tr>
               ))}
               {leads.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-slate-400">暂无线索数据</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
