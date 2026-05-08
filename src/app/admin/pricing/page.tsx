"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Loader2, Layers, Box, CheckCircle2, Search, Edit2, Save, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function PricingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    material: "",
    size: "",
  });

  // 后台看板查看状态
  const [viewProduct, setViewProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 编辑状态
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedRules, setEditedRules] = useState<any[]>([]);

  const [tiers, setTiers] = useState([
    { quantity: "500", unitPrice: "" },
    { quantity: "2000", unitPrice: "" },
    { quantity: "5000", unitPrice: "" }
  ]);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validTiers = tiers.filter(t => t.quantity && t.unitPrice);
    if (validTiers.length === 0) return alert("请至少填写一个完整的价格阶梯");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: formData.material,
          size: formData.size,
          tiers: validTiers
        }),
      });
      const data = await res.json();
      if (data.success) {
        // 重置单价输入，但保留数量阶梯方便下次录入
        setTiers(tiers.map(t => ({ ...t, unitPrice: "" })));
        // 自动将下方总览的视角切换到刚才录入的商品
        setViewProduct(formData.material);
        fetchRules();
      } else {
        alert(data.error || "添加失败");
      }
    } catch (error) {
      alert("网络异常");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条报价吗？")) return;
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchRules();
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!viewProduct) return;
    if (!confirm(`确定要删除商品 "${viewProduct}" 的所有尺寸和阶梯价吗？此操作不可恢复！`)) return;
    
    setIsSubmitting(true);
    try {
      const productRules = rules.filter((r: any) => r.material === viewProduct);
      await Promise.all(
        productRules.map((rule: any) => 
          fetch(`/api/admin/pricing/${rule.id}`, { method: "DELETE" })
        )
      );
      
      // Select another product or null
      const remainingProducts = Array.from(new Set(rules.map((r: any) => r.material))).filter(p => p !== viewProduct);
      if (remainingProducts.length > 0) {
        setViewProduct(remainingProducts[0] as string);
      } else {
        setViewProduct(null);
      }
      
      fetchRules();
    } catch (error) {
      alert("批量删除出错");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = () => {
    const productRules = rules.filter((r: any) => r.material === viewProduct);
    setEditedRules(JSON.parse(JSON.stringify(productRules)));
    setEditedProductName(viewProduct || "");
    setEditingProduct(viewProduct);
  };

  const handleSaveProduct = async () => {
    try {
      setIsSubmitting(true);
      await Promise.all(editedRules.map(rule => 
        fetch(`/api/admin/pricing/${rule.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            material: editedProductName,
            unitPrice: rule.unitPrice.toString(), 
            quantity: rule.quantity.toString(),
            size: rule.size 
          }),
        })
      ));
      
      setEditingProduct(null);
      if (editedProductName !== viewProduct) {
        setViewProduct(editedProductName);
      }
      fetchRules();
    } catch (err) {
      alert("保存出错");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提取唯一的商品名与尺寸 (合并默认项与数据库已有项)
  const uniqueProducts = Array.from(new Set(["牛皮单色250克", "铜版纸4色250克", "黑卡单色250克", "普通纸单印120克", ...rules.map((r: any) => r.material)]));
  const uniqueSizes = Array.from(new Set(["12.8cm*9.5cm*22cm", "21cm*14cm*19cm", "28cm*15cm*28cm", ...rules.map((r: any) => r.size)]));
  const filteredProducts = uniqueProducts.filter((p: any) => p.toLowerCase().includes(searchTerm.toLowerCase()));

  // 默认选中第一个商品
  useEffect(() => {
    if (uniqueProducts.length > 0 && !viewProduct) {
      setViewProduct(uniqueProducts[0] as string);
    }
  }, [uniqueProducts, viewProduct]);

  // 根据选中的商品提取对应的尺寸和数据
  const activeRules = editingProduct === viewProduct ? editedRules : rules.filter((r: any) => r.material === viewProduct);
  const groupedSizes = activeRules
    .reduce((acc: any, rule: any) => {
      if (!acc[rule.size]) acc[rule.size] = [];
      acc[rule.size].push(rule);
      // 对阶梯数量进行排序
      acc[rule.size].sort((a: any, b: any) => a.quantity - b.quantity);
      return acc;
    }, {});

  const handleExportExcel = () => {
    if (!viewProduct || Object.keys(groupedSizes).length === 0) {
      return alert("当前商品没有数据可导出");
    }

    const exportData = activeRules.map((rule: any) => ({
      "商品名称": rule.material,
      "尺寸规格": rule.size,
      "订购数量(个)": rule.quantity,
      "预估单价($)": Number(rule.unitPrice).toFixed(3),
      "预估总价($)": Number(rule.totalPrice).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "报价表");
    
    // Auto-size columns roughly
    const maxWidths = [20, 25, 15, 15, 15];
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, `${viewProduct}_报价表.xlsx`);
  };


  return (
    <div className="min-h-screen bg-[#fafafa] p-8 lg:p-12 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* 头部标题区 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-[#101828] rounded-2xl flex items-center justify-center mr-6 shadow-xl shadow-slate-200">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#101828] tracking-tight">阶梯报价库 (Price Matrix)</h1>
              <p className="text-slate-500 mt-2 font-medium">批量录入不同规格的批发价格，自动同步至客户前台估价计算器。</p>
            </div>
          </div>
        </div>

        {/* 批量录入工作台 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-600" /> 批量添加价格阶梯
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">商品名</label>
                <input
                  type="text"
                  list="material-options"
                  required
                  value={formData.material}
                  placeholder="请选择或输入商品名..."
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#101828] outline-none font-medium text-slate-900 transition-all"
                />
                <datalist id="material-options">
                  {uniqueProducts.length > 0 ? (
                    uniqueProducts.map((p) => <option key={p as string} value={p as string} />)
                  ) : (
                    <>
                      <option value="牛皮单色250克" />
                      <option value="铜版纸4色250克" />
                      <option value="黑卡单色250克" />
                      <option value="普通纸单印120克" />
                    </>
                  )}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">选择尺寸 (长宽高)</label>
                <input
                  type="text"
                  list="size-options"
                  required
                  value={formData.size}
                  placeholder="请选择或输入尺寸 (长x宽x高)..."
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#101828] outline-none font-medium text-slate-900 transition-all"
                />
                <datalist id="size-options">
                  {uniqueSizes.length > 0 ? (
                    uniqueSizes.map((s) => <option key={s as string} value={s as string} />)
                  ) : (
                    <>
                      <option value="12.8cm*9.5cm*22cm" />
                      <option value="21cm*14cm*19cm" />
                      <option value="28cm*15cm*28cm" />
                    </>
                  )}
                </datalist>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-slate-700">配置数量与单价</label>
                <button
                  type="button"
                  onClick={() => setTiers([...tiers, { quantity: "", unitPrice: "" }])}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" /> 增加一个阶梯
                </button>
              </div>
              
              <div className="space-y-3">
                {tiers.map((tier, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">起订量</span>
                      <input
                        type="number"
                        min="1"
                        value={tier.quantity}
                        onChange={(e) => {
                          const newTiers = [...tiers];
                          newTiers[idx].quantity = e.target.value;
                          setTiers(newTiers);
                        }}
                        className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#101828] outline-none font-bold text-slate-900 transition-all"
                        placeholder="如：500"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">单价 $</span>
                      <input
                        type="number"
                        step="0.001"
                        value={tier.unitPrice}
                        onChange={(e) => {
                          const newTiers = [...tiers];
                          newTiers[idx].unitPrice = e.target.value;
                          setTiers(newTiers);
                        }}
                        className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold text-blue-600 transition-all"
                        placeholder="如：0.85"
                      />
                    </div>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTiers(tiers.filter((_, i) => i !== idx))}
                        className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#101828] hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                {isSubmitting ? "正在保存..." : "一键保存这批阶梯价"}
              </button>
            </div>
          </form>
        </div>

        {/* 沉浸式数据看板 */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <Box className="w-5 h-5 mr-2 text-slate-500" /> 已上架报价总览
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 text-[#101828] animate-spin" /></div>
          ) : uniqueProducts.length === 0 ? (
            <div className="p-24 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">暂无报价数据</p>
              <p className="text-sm">请使用上方的工作台批量录入</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* 左侧：商品导航树 */}
              <div className="md:w-1/3 lg:w-1/4 border-r border-slate-100 bg-slate-50/30 p-4 flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">选择商品名</h3>
                
                <div className="relative mb-4 px-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="搜索商品..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[600px] px-1 pb-4">
                  {filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                    <button
                      key={product}
                      onClick={() => setViewProduct(product)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        viewProduct === product
                          ? 'bg-[#101828] text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {product}
                    </button>
                  )) : (
                    <div className="text-sm text-slate-400 text-center py-4">未找到匹配商品</div>
                  )}
                </div>
              </div>

              {/* 右侧：尺寸与阶梯详情 */}
              <div className="md:w-2/3 lg:w-3/4 p-6 lg:p-8 bg-white">
                <div className="mb-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    {editingProduct === viewProduct ? (
                      <input
                        type="text"
                        value={editedProductName}
                        onChange={(e) => setEditedProductName(e.target.value)}
                        className="text-xl font-black text-slate-900 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-blue-50/50 px-2 py-1 rounded"
                        placeholder="商品名称"
                      />
                    ) : (
                      <h3 className="text-xl font-black text-slate-900">{viewProduct}</h3>
                    )}
                    <p className="text-sm text-slate-500 mt-2">此商品下配置的所有尺寸与阶梯价</p>
                  </div>
                  <div>
                    {editingProduct === viewProduct ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleSaveProduct}
                          disabled={isSubmitting}
                          className="flex items-center px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
                          保存全部修改
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportExcel}
                          className="flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition"
                        >
                          <Download className="w-4 h-4 mr-1.5" /> 导出 Excel
                        </button>
                        <button
                          onClick={handleDeleteProduct}
                          disabled={isSubmitting}
                          className="flex items-center px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
                          删除此商品
                        </button>
                        <button
                          onClick={handleEditProduct}
                          className="flex items-center px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" /> 编辑此商品
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {Object.keys(groupedSizes).length === 0 ? (
                  <p className="text-slate-500 italic">该商品暂无尺寸数据。</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedSizes).map(([size, group]: [string, any]) => (
                      <div key={size} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                            {editingProduct === viewProduct ? (
                                <span className="font-bold text-slate-800 text-sm">尺寸分组：{size} (编辑模式下修改下方尺寸即可)</span>
                            ) : (
                                <span className="font-bold text-slate-800 text-sm">{size}</span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {group.length} 个阶梯
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-3 text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 mb-2 px-2">
                            <div>订购数量 {editingProduct === viewProduct && "(及尺寸)"}</div>
                            <div className="text-right">预估单价</div>
                            <div className="text-right">预估总价</div>
                          </div>
                          
                          <div className="space-y-1">
                            {group.map((rule: any) => (
                              <div key={rule.id} className="grid grid-cols-3 items-center py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors group/row">
                                <div className="font-bold text-slate-900 text-sm">
                                  {editingProduct === viewProduct ? (
                                    <div className="flex flex-col gap-2 w-full pr-4">
                                      <input
                                        type="text"
                                        value={rule.size}
                                        onChange={(e) => {
                                          const newRules = [...editedRules];
                                          const target = newRules.find(r => r.id === rule.id);
                                          if(target) target.size = e.target.value;
                                          setEditedRules(newRules);
                                        }}
                                        className="w-full px-2 py-1.5 text-xs border border-blue-200 focus:border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                        placeholder="修改尺寸"
                                      />
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="number"
                                          value={rule.quantity}
                                          onChange={(e) => {
                                            const newRules = [...editedRules];
                                            const target = newRules.find(r => r.id === rule.id);
                                            if(target) target.quantity = Number(e.target.value);
                                            setEditedRules(newRules);
                                          }}
                                          className="w-20 px-2 py-1.5 text-xs border border-blue-200 focus:border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                          placeholder="数量"
                                        />
                                        <span className="text-xs text-slate-500 font-medium">个</span>
                                      </div>
                                    </div>
                                  ) : (
                                    `${rule.quantity.toLocaleString()} 个`
                                  )}
                                </div>
                                <div className="text-right font-bold text-blue-600 text-sm">
                                  {editingProduct === viewProduct ? (
                                    <div className="flex justify-end">
                                      <span className="text-slate-400 mr-1.5 pt-1.5">$</span>
                                      <input
                                        type="number"
                                        step="0.001"
                                        value={rule.unitPrice}
                                        onChange={(e) => {
                                          const newRules = [...editedRules];
                                          const target = newRules.find(r => r.id === rule.id);
                                          if(target) target.unitPrice = Number(e.target.value);
                                          setEditedRules(newRules);
                                        }}
                                        className="w-24 px-2 py-1.5 text-right border border-blue-200 focus:border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                      />
                                    </div>
                                  ) : (
                                    `$${rule.unitPrice.toFixed(3)}`
                                  )}
                                </div>
                                <div className="text-right font-medium text-slate-700 text-sm flex justify-end items-center gap-4">
                                  {editingProduct === viewProduct ? (
                                    <span className="text-slate-400">自动计算</span>
                                  ) : (
                                    `$${rule.totalPrice.toFixed(2)}`
                                  )}
                                  
                                  {/* 删除按钮 */}
                                  <div className={`flex items-center justify-center ${editingProduct === viewProduct ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100'} transition-opacity`}>
                                      <button
                                        onClick={() => handleDelete(rule.id)}
                                        className="text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-100 p-1.5 rounded-md"
                                        title="删除此阶梯"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
