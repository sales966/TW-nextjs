"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">产品管理系统 (Product Management)</h1>
          <p className="text-muted-foreground mt-2">使用动态 JSON 属性与 AI 进行深度管理</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/admin/products/import")} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            导入产品
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-3 w-24">主图 (Image)</th>
                <th className="px-6 py-3">型号 (Code)</th>
                <th className="px-6 py-3">名称 (Name)</th>
                <th className="px-6 py-3">动态属性 (Attributes)</th>
                <th className="px-6 py-3">AI 标签 (AI Tags)</th>
                <th className="px-6 py-3">状态 (Status)</th>
                <th className="px-6 py-3">操作 (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-3">
                    <div className="w-14 h-14 relative rounded-md border border-slate-200 overflow-hidden bg-slate-50 shadow-sm group">
                      {product.featuredImage ? (
                        <Image 
                          src={product.featuredImage.startsWith('http') ? product.featuredImage : `/uploads/${product.featuredImage.split('/').pop()}`} 
                          alt={product.name || "主图"} 
                          fill 
                          unoptimized
                          className="object-cover cursor-zoom-in group-hover:scale-110 transition-transform duration-300" 
                          onClick={() => setSelectedImage(product.featuredImage.startsWith('http') ? product.featuredImage : `/uploads/${product.featuredImage.split('/').pop()}`)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">无图</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{product.productCode || "-"}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <pre className="text-xs bg-muted p-2 rounded-sm overflow-x-auto max-w-[200px]">
                      {JSON.stringify(product.attributes, null, 2)}
                    </pre>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.aiTags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === "NEEDS_REVIEW" ? "bg-amber-100 text-amber-800" :
                      product.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <span className="text-blue-600 hover:underline cursor-pointer">编辑</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 图片放大预览遮罩层 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] aspect-square md:aspect-[4/3] bg-transparent">
             <Image 
               src={selectedImage} 
               alt="高清大图" 
               fill 
               className="object-contain drop-shadow-2xl" 
               unoptimized
             />
          </div>
          <button className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
