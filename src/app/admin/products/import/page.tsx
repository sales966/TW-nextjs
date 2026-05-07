"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileType, CheckCircle2, Loader2 } from "lucide-react";
import { upload } from "@vercel/blob/client";

export default function SimpleImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file && images.length === 0) {
      alert("请至少上传一个 CSV 数据表或产品图片");
      return;
    }
    setIsUploading(true);
    try {
      // 1. 直接在客户端将图片上传到 Vercel Blob（突破 4.5MB 限制）
      const imageMap: Record<string, string> = {};
      if (images.length > 0) {
        // 并发上传所有图片
        const uploadPromises = images.map(async (img) => {
          const fileName = `${Date.now()}-${img.name}`;
          const matchName = img.name.split('.')[0].toLowerCase();
          
          const newBlob = await upload(fileName, img, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
          
          imageMap[matchName] = newBlob.url;
        });
        
        await Promise.all(uploadPromises);
      }

      // 2. 将 CSV 文件和 图片映射关系 一起发送给后端
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("imageMap", JSON.stringify(imageMap));

      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        alert(`请求失败 (状态码: ${res.status}): 服务器返回了非标准数据。可能是上传的图片总体积太大了（Vercel 限制单次上传不超过 4.5MB）。\n返回内容片段: ${text.slice(0, 100)}...`);
        setIsUploading(false);
        return;
      }
      
      if (res.ok && data.success) {
        setResult(data);
      } else {
        alert(`导入失败: ${data.error || "未知错误"}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`导入过程发生彻底断连，可能是网络超时或图片过大: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (result) {
    return (
      <div className="p-12 max-w-4xl mx-auto flex flex-col items-center mt-20">
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-3">自动导入成功！</h2>
        <p className="text-slate-500 mb-8 text-lg">系统已自动清洗字段并入库了 <span className="font-bold text-slate-900">{result.totalInserted}</span> 条产品数据。</p>
        <button 
          onClick={() => { setResult(null); setFile(null); setImages([]); }}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-md"
        >
          返回继续导入
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-16 px-6">
      <div className="max-w-3xl w-full mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">一键产品导入系统</h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          抛弃繁琐的映射。只需上传 CSV 表格和 JPG 图片多选，后端将通过模糊搜索为您自动完成字段匹配、单位转换和数据清洗。
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-10 space-y-8">
        
        {/* CSV Upload */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-slate-800">1. 上传数据表 (CSV) <span className="text-slate-400 font-normal text-sm ml-2">(选填)</span></h3>
          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className={`h-10 w-10 mb-4 ${file ? 'text-blue-500' : 'text-slate-400'}`} />
            <p className="text-base font-medium text-slate-700">{file ? file.name : "点击选择 CSV 文件"}</p>
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-slate-800">2. 上传产品图 (JPG/PNG 支持多选)</h3>
          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${images.length > 0 ? 'border-green-400 bg-green-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
            onClick={() => imageInputRef.current?.click()}
          >
            <FileType className={`h-10 w-10 mb-4 ${images.length > 0 ? 'text-green-500' : 'text-slate-400'}`} />
            <p className="text-base font-medium text-slate-700">{images.length > 0 ? `已准备好 ${images.length} 张图片` : "点击选择电脑上的图片 (可框选多张)"}</p>
            <p className="text-sm text-slate-500 mt-2">图片名只要包含产品名或货号，系统会自动帮您关联</p>
            <input type="file" accept="image/jpeg, image/png" multiple className="hidden" ref={imageInputRef} onChange={(e) => setImages(Array.from(e.target.files || []))} />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={handleSubmit} 
            disabled={(!file && images.length === 0) || isUploading}
            className="w-full bg-slate-900 text-white rounded-xl py-4 text-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all flex justify-center items-center shadow-lg"
          >
            {isUploading ? (
              <span className="animate-pulse flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                正在直传云端并解析数据，请耐心等待...
              </span>
            ) : (
              "一键全自动导入"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
