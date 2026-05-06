"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

const ConfigFormSchema = z.object({
  boxType: z.string().min(1, "Please select a box type"),
  length: z.number().min(1), width: z.number().min(1), height: z.number().min(1),
  material: z.string().min(1, "Material needed"),
  printing: z.string().min(1),
  quantity: z.number().min(100),
  contactName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(2),
  companyName: z.string().optional()
});

type ConfigFormData = z.infer<typeof ConfigFormSchema>;

export default function ConfiguratorForm({ initialProductId, initialBoxType }: { initialProductId?: string, initialBoxType?: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ConfigFormData>({
    resolver: zodResolver(ConfigFormSchema),
    defaultValues: {
      boxType: initialBoxType || "",
      length: undefined, width: undefined, height: undefined,
      material: "",
      printing: "",
      quantity: 500,
    }
  });

  const currentValues = watch();

  const onSubmit = async (data: ConfigFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setIsSuccess(true);
    } catch (error) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return (
    <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-100 max-w-2xl mx-auto mt-20">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
      <button onClick={() => window.location.href="/"} className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">Return Home</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full">
        {step === 1 ? (
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-bold border-b pb-4 mb-6">1. Identify Structure</h3>
              <div className="grid grid-cols-2 gap-4">
                {["MAILER_BOX", "SHIPPING_BOX", "FOLDING_CARTON", "RIGID_BOX"].map((type) => (
                   <label key={type} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition ${currentValues.boxType === type ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                      <input type="radio" value={type} {...register("boxType")} className="hidden" />
                      <span className="text-sm font-semibold">{type.replace('_', ' ')}</span>
                   </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold border-b pb-4 mb-6">2. Exact Dimensions <span className="text-sm font-normal text-slate-400">(mm)</span></h3>
              <div className="flex gap-4">
                <input type="number" {...register("length", { valueAsNumber: true })} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Length" />
                <input type="number" {...register("width", { valueAsNumber: true })} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Width" />
                <input type="number" {...register("height", { valueAsNumber: true })} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Height" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold border-b pb-4 mb-6">3. Material & Print</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <select {...register("material")} className="w-full border rounded-lg p-3 text-sm outline-none bg-white">
                  <option value="">Select Material...</option><option value="KRAFT">Kraft Corrugated (Eco)</option><option value="WHITE_B_FLUTE">White B-Flute Corrugated</option><option value="CCNB_300">CCNB 300gsm</option>
                </select>
                <select {...register("printing")} className="w-full border rounded-lg p-3 text-sm outline-none bg-white">
                  <option value="">Select Printing...</option><option value="CMYK_OUT">CMYK Outside Only</option><option value="CMYK_BOTH">CMYK Full (Inside & Out)</option><option value="NONE">No Printing (Blank)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
               <button type="button" onClick={() => setStep(2)} className="flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800">Continue <ChevronRight className="w-4 h-4 ml-2"/></button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="text-sm text-blue-600 font-semibold cursor-pointer mb-6" onClick={() => setStep(1)}>&larr; Back</div>
            <div>
               <h3 className="text-xl font-bold border-b pb-4 mb-6">4. Quantity & Artwork</h3>
               <input type="number" {...register("quantity", { valueAsNumber: true })} className="w-full border rounded-lg p-3 text-sm bg-slate-50 mb-6" />
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                  <span className="font-semibold text-slate-700">Upload Artwork (PDF/AI)</span>
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold border-b pb-4 mb-6">5. Contact Information</h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" {...register("contactName")} placeholder="Full Name *" className="w-full border rounded-lg p-3 text-sm" />
                  <input type="email" {...register("email")} placeholder="Coporate Email *" className="w-full border rounded-lg p-3 text-sm" />
               </div>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" {...register("companyName")} placeholder="Company Name" className="w-full border rounded-lg p-3 text-sm" />
                  <input type="text" {...register("country")} placeholder="Country/Region *" className="w-full border rounded-lg p-3 text-sm" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-80 flex-shrink-0 sticky top-24">
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
          <h4 className="font-bold text-lg mb-4 text-slate-100 border-b border-slate-700 pb-4">Quote Summary</h4>
          <div className="mt-8">
            <button type={step === 2 ? "submit" : "button"} onClick={() => { if(step===1) setStep(2) }} disabled={isSubmitting} className="w-full flex justify-center px-4 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 2 ? "Submit Request" : "Next Step")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}