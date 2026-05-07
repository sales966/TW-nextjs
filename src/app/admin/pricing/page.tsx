"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Loader2, Layers, Box, CheckCircle2 } from "lucide-react";

export default function PricingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    material: "牛皮单色250克",
    size: "12.8cm*9.5cm*22cm",
  });

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

  // 按照 材质+尺寸 分组数据
  const groupedRules = rules.reduce((acc: any, rule: any) => {
    const key = `${rule.material}|${rule.size}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rule);
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
          ) : Object.keys(groupedRules).length === 0 ? (
            <div className="p-24 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">暂无报价数据</p>
              <p className="text-sm">请使用上方的工作台批量录入</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {Object.entries(groupedRules).map(([key, group]: [string, any]) => {
                const [material, size] = key.split('|');
                return (
                  <div key={key} className="flex flex-col lg:flex-row hover:bg-slate-50/30 transition-colors">
                    {/* 左侧大类信息 */}
                    <div className="lg:w-1/3 p-6 lg:p-8 bg-slate-50/50 lg:bg-transparent border-b lg:border-b-0 lg:border-r border-slate-100">
                      <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-md mb-3">
                        产品组合
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-1">{material}</h3>
                      <p className="text-slate-500 font-medium text-sm flex items-center">
                        <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                        {size}
                      </p>
                    </div>
                    
                    {/* 右侧阶梯明细 */}
                    <div className="lg:w-2/3 p-6 lg:p-8">
                      <div className="grid grid-cols-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-3">
                        <div>订购数量</div>
                        <div className="text-right">预估单价</div>
                        <div className="text-right">预估总价</div>
                        <div className="text-center">操作</div>
                      </div>
                      
                      <div className="space-y-2">
                        {group.map((rule: any) => (
                          <div key={rule.id} className="grid grid-cols-4 items-center py-2 px-3 -mx-3 rounded-lg hover:bg-slate-100 transition-colors group/row">
                            <div className="font-bold text-slate-900 text-sm">
                              {rule.quantity.toLocaleString()} 个
                            </div>
                            <div className="text-right font-bold text-blue-600 text-sm">
                              ${rule.unitPrice.toFixed(3)}
                            </div>
                            <div className="text-right font-medium text-slate-700 text-sm">
                              ${rule.totalPrice.toFixed(2)}
                            </div>
                            <div className="text-center">
                              <button
                                onClick={() => handleDelete(rule.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/row:opacity-100"
                                title="删除此阶梯"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
