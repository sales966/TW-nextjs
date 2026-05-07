"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Loader2, Layers, Box, CheckCircle2, Search, Edit2, Save } from "lucide-react";

export default function PricingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    material: "牛皮单色250克",
    size: "12.8cm*9.5cm*22cm",
  });

  // 后台看板查看状态
  const [viewProduct, setViewProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 编辑状态
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

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

  const handleSaveEdit = async (rule: any) => {
    if (!editPrice) return;
    try {
      const res = await fetch(`/api/admin/pricing/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitPrice: editPrice, quantity: rule.quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditPrice("");
        fetchRules();
      } else {
        alert("修改失败");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 提取唯一的商品名 (用于看板左侧)
  const uniqueProducts = Array.from(new Set(rules.map((r: any) => r.material)));
  const filteredProducts = uniqueProducts.filter((p: any) => p.toLowerCase().includes(searchTerm.toLowerCase()));

  // 默认选中第一个商品
  useEffect(() => {
    if (uniqueProducts.length > 0 && !viewProduct) {
      setViewProduct(uniqueProducts[0] as string);
    }
  }, [uniqueProducts, viewProduct]);

  // 根据选中的商品提取对应的尺寸和数据
  const groupedSizes = rules
    .filter((r: any) => r.material === viewProduct)
    .reduce((acc: any, rule: any) => {
      if (!acc[rule.size]) acc[rule.size] = [];
      acc[rule.size].push(rule);
      // 对阶梯数量进行排序
      acc[rule.size].sort((a: any, b: any) => a.quantity - b.quantity);
      return acc;
    }, {});

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
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#101828] outline-none font-medium text-slate-900 transition-all"
                />
                <datalist id="material-options">
                  <option value="牛皮单色250克" />
                  <option value="铜版纸4色250克" />
                  <option value="黑卡单色250克" />
                  <option value="普通纸单印120克" />
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">选择尺寸 (长宽高)</label>
                <input
                  type="text"
                  list="size-options"
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#101828] outline-none font-medium text-slate-900 transition-all"
                />
                <datalist id="size-options">
                  <option value="12.8cm*9.5cm*22cm" />
                  <option value="21cm*14cm*19cm" />
                  <option value="28cm*15cm*28cm" />
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
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-black text-slate-900">{viewProduct}</h3>
                  <p className="text-sm text-slate-500 mt-1">此商品下配置的所有尺寸与阶梯价</p>
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
                            <span className="font-bold text-slate-800 text-sm">{size}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {group.length} 个阶梯
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 mb-2 px-2">
                            <div>订购数量</div>
                            <div className="text-right">预估单价</div>
                            <div className="text-right">预估总价</div>
                            <div className="text-center">操作</div>
                          </div>
                          
                          <div className="space-y-1">
                            {group.map((rule: any) => (
                              <div key={rule.id} className="grid grid-cols-4 items-center py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors group/row">
                                <div className="font-bold text-slate-900 text-sm">
                                  {rule.quantity.toLocaleString()} 个
                                </div>
                                <div className="text-right font-bold text-blue-600 text-sm">
                                  {editingId === rule.id ? (
                                    <input
                                      type="number"
                                      step="0.001"
                                      autoFocus
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(e.target.value)}
                                      className="w-20 px-2 py-1 text-right border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    `$${rule.unitPrice.toFixed(3)}`
                                  )}
                                </div>
                                <div className="text-right font-medium text-slate-700 text-sm">
                                  {editingId === rule.id ? (
                                    <span className="text-slate-400">自动计算</span>
                                  ) : (
                                    `$${rule.totalPrice.toFixed(2)}`
                                  )}
                                </div>
                                <div className="text-center">
                                  {editingId === rule.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => handleSaveEdit(rule)}
                                        className="text-green-500 hover:text-green-600 bg-white shadow-sm border border-slate-100 p-1.5 rounded-md"
                                        title="保存"
                                      >
                                        <Save className="w-4 h-4 mx-auto" />
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="text-slate-400 hover:text-slate-600 text-xs px-2"
                                      >
                                        取消
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => {
                                          setEditingId(rule.id);
                                          setEditPrice(rule.unitPrice.toString());
                                        }}
                                        className="text-slate-400 hover:text-blue-500 bg-white shadow-sm border border-slate-100 p-1.5 rounded-md"
                                        title="编辑此阶梯"
                                      >
                                        <Edit2 className="w-4 h-4 mx-auto" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(rule.id)}
                                        className="text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-100 p-1.5 rounded-md"
                                        title="删除此阶梯"
                                      >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                      </button>
                                    </div>
                                  )}
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
