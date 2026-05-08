"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function QuotePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useI18n();
  const tq = t.quote;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      company: formData.get("company"),
      companyName: formData.get("companyName"),
      quantity: formData.get("quantity"),
      message: formData.get("message"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("提交失败，请重试 (Failed to submit)");
      }
    } catch (err) {
      alert("网络错误 (Network error)");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] pt-40 pb-32 flex flex-col items-center justify-center font-sans px-6 text-[#101828]">
         <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
         </div>
         <h1 className="text-4xl font-black mb-4 tracking-tighter">{tq.doneT}</h1>
         <p className="text-[#667085] text-xl max-w-md text-center leading-relaxed">{tq.doneS}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF] pt-32 pb-32 font-sans selection:bg-[#EAE8E2] text-[#101828]">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-black tracking-tighter leading-tight mb-6">{tq.title}</h1>
          <p className="text-[#667085] text-lg font-medium max-w-2xl mx-auto leading-relaxed">{tq.sub}</p>
        </div>

        <div className="bg-[#FBFAF7] rounded-[4px] shadow-[0_20px_80px_rgba(16,24,40,0.06)] border border-[#101828]/5 overflow-hidden">
           
           <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-20">
             
             {/* Section 1 */}
             <div className="space-y-8">
                <div className="pb-6 border-b border-[#101828]/10 mb-8">
                   <h3 className="text-2xl font-black tracking-tight">{tq.formB1}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div>
                     <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.comp}</label>
                     <input required name="company" type="text" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.qty}</label>
                     <input required min="1" type="number" name="quantity" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" placeholder="e.g., 5000" />
                   </div>
                </div>
             </div>

             {/* Section 2 */}
             <div className="space-y-8">
                <div className="pb-6 border-b border-[#101828]/10 mb-8">
                   <h3 className="text-2xl font-black tracking-tight">{tq.formB2}</h3>
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.msg}</label>
                  <textarea name="message" rows={5} className="w-full bg-[#F6F4EF] rounded border border-[#101828]/10 p-6 font-medium focus:outline-none focus:border-[#101828] transition-colors resize-none placeholder:text-[#667085]/60" placeholder={tq.ph}></textarea>
                </div>
             </div>

             {/* Section 3 */}
             <div className="space-y-8 pb-8">
                <div className="pb-6 border-b border-[#101828]/10 mb-8">
                   <h3 className="text-2xl font-black tracking-tight">{tq.formB3}</h3>
                </div>
                <div className="mb-10">
                  <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{(tq as any).companyName}</label>
                  <input name="companyName" type="text" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.fname}</label>
                    <input required name="firstName" type="text" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.lname}</label>
                    <input required name="lastName" type="text" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.email}</label>
                    <input required name="email" type="email" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold tracking-[0.05em] text-[#101828]/60 uppercase mb-3">{tq.phone}</label>
                    <input required name="phone" type="tel" className="w-full bg-transparent border-b-[1.5px] border-[#101828]/20 py-3 font-medium focus:outline-none focus:border-[#101828] transition-colors" />
                  </div>
                </div>
             </div>

             <div className="pt-10 flex justify-end items-center border-t border-[#101828]/10">
                <button type="submit" className="w-full md:w-auto px-16 py-6 bg-[#101828] text-white font-bold tracking-[0.1em] uppercase text-[15px] shadow-[0_12px_40px_rgba(16,24,40,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-500 hover:-translate-y-1 rounded-[4px]">
                   {tq.submit}
                </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
}
