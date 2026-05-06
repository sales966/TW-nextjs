import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
      <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-300 relative overflow-hidden">
        <span className="text-xs">[Image Slot]</span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">{product.boxType.replace('_', ' ')}</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{product.summary}</p>
        <div className="flex justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400">MOQ: {product.moq}</span>
          <span className="text-blue-600 group-hover:translate-x-1 transition"><ArrowRight className="w-5 h-5" /></span>
        </div>
      </div>
    </Link>
  );
}