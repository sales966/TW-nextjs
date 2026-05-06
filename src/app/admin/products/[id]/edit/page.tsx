"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadCloud, X, ArrowLeft } from "lucide-react";

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const updateAttribute = (key: string, value: string) => {
    setProduct((prev: any) => ({
      ...prev,
      attributes: {
        ...(prev.attributes || {}),
        [key]: value
      }
    }));
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();
      if (json.success) setProduct(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      let newMediaUrls: string[] = [];

      // 如果有新选择的图片，先上传
      if (mediaFiles.length > 0) {
        const formData = new FormData();
        mediaFiles.forEach(f => formData.append("file", f));
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upJson = await upRes.json();
        if (upJson.success) {
          newMediaUrls = upJson.urls;
        } else {
          alert("图片上传失败");
          setSubmitting(false);
          return;
        }
      }

      const currentMedia = Array.isArray(product.media) ? product.media : [];
      const updatedMedia = [...currentMedia, ...newMediaUrls];

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PUBLISHED",
          media: updatedMedia,
          name: product.name,
          productCode: product.productCode,
          aiSummary: product.aiSummary,
          moq: parseInt(product.moq) || 500,
          attributes: product.attributes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("审批并上架成功！");
        router.push("/admin/products");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">加载中...</div>;
  if (!product) return <div className="p-8">产品不存在</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 bg-[#FBFAF7] min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-900" title="返回上一页">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">产品详情审批 (Data Review)</h1>
          </div>
          <p className="text-muted-foreground ml-11 text-sm">人工核查 AI 抓取与清洗的包装参数，无误后可直接上架发布。</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl">取消</Button>
          <Button onClick={handleSave} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
            {submitting ? "保存中..." : "保存并上架 (Publish)"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧主内容区 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 基础信息卡片 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold mb-6 text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              基础信息与详情属性
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">型号 (SKU)</label>
                <input 
                  value={product.productCode || ""} 
                  onChange={(e) => setProduct({...product, productCode: e.target.value})}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="请输入产品型号"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">产品名称 (Name)</label>
                <input 
                  value={product.name || ""} 
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="请输入产品名称"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">产品分类 (Category)</label>
                <input 
                  value={product.attributes?.category || ""} 
                  onChange={(e) => updateAttribute("category", e.target.value)}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="例如: General Packaging"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">基础起订量 (MOQ)</label>
                <input 
                  type="number"
                  value={product.moq || ""} 
                  onChange={(e) => setProduct({...product, moq: e.target.value})}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">推荐材质 (Material)</label>
                <input 
                  value={product.attributes?.material || ""} 
                  onChange={(e) => updateAttribute("material", e.target.value)}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="例如: 高克重卡纸"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">工艺及提手 (Printing & Handles)</label>
                <input 
                  value={product.attributes?.printing || ""} 
                  onChange={(e) => updateAttribute("printing", e.target.value)}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="例如: 烫金工艺 + 触感覆膜"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">参考生产周期 (Lead Time)</label>
                <input 
                  value={product.attributes?.leadTime || ""} 
                  onChange={(e) => updateAttribute("leadTime", e.target.value)}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="例如: 排单生产约 10-15 天"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs text-slate-500 uppercase font-medium">AI 一句话总结 (Description)</label>
                <textarea 
                  rows={3}
                  value={product.aiSummary || ""}
                  onChange={(e) => setProduct({...product, aiSummary: e.target.value})}
                  className="w-full font-medium text-slate-900 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow resize-none"
                  placeholder="请输入产品描述..."
                />
              </div>
              
              <div className="col-span-2 space-y-2 mt-2">
                <label className="text-xs text-slate-500 uppercase font-medium">AI 营销标签 (Tags)</label>
                <div className="flex flex-wrap gap-2">
                  {product.aiTags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  {(!product.aiTags || product.aiTags.length === 0) && <span className="text-sm text-slate-400">无标签</span>}
                </div>
              </div>
            </div>
          </div>

          {/* 细节图上传区 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold mb-6 text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              产品图集 (Media)
            </h3>
            
            {/* 已存在的图片 */}
            {product.media && product.media.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                {product.media.map((url: string, i: number) => (
                  <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <Image src={url.startsWith('http') ? url : `/uploads/${url.split('/').pop()}`} alt="detail" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* 新图片预览 */}
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6 pt-6 border-t border-dashed border-slate-200">
                {mediaFiles.map((f, i) => (
                  <div key={i} className="aspect-square relative rounded-xl overflow-hidden border-2 border-blue-300 shadow-sm">
                    <Image src={URL.createObjectURL(f)} alt="preview" fill className="object-cover" />
                    <button onClick={() => setMediaFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors backdrop-blur-md">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 拖拽上传区域 */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group bg-slate-50/50"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    setMediaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                  }
                }} 
              />
              <div className="bg-white p-3 rounded-full shadow-sm border border-slate-200 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700">点击或拖拽添加细节图</p>
              <p className="text-xs text-slate-400 mt-1">支持 JPG / PNG，推荐尺寸比例 1:1</p>
            </div>
          </div>
        </div>

        {/* 右侧属性区 */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden flex flex-col sticky top-8 border border-slate-800">
            <div className="px-5 py-4 border-b border-slate-700/50 bg-[#0F172A] flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                核心动态属性 (JSON)
              </h3>
            </div>
            <div className="p-5 overflow-y-auto max-h-[500px]">
              <pre className="text-[13px] text-emerald-400 font-mono leading-relaxed">
                {JSON.stringify(product.attributes, null, 2)}
              </pre>
            </div>
            <div className="px-5 py-4 bg-[#0F172A]/80 border-t border-slate-700/50">
               <p className="text-xs text-slate-400 leading-relaxed">
                * 此 JSON 结构由 AI 自动生成，将被用于 3D 模型渲染、精确过滤与报价。
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
