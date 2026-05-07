"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Loader2 } from "lucide-react";

export default function PricingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    material: "牛皮单色250克",
    size: "12.8cm*9.5cm*22cm",
    quantity: "500",
    unitPrice: "",
  });

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
    if (!formData.unitPrice) return alert("请输入单价");
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("添加成功！");
        setFormData(prev => ({ ...prev, unitPrice: "" }));
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
    if (!confirm("确定要删除这条报价规则吗？")) return;
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

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-5">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">阶梯报价库</h1>
          <p className="text-slate-500 mt-1">在这里配置你们的标准品价格矩阵，前台客户可以通过计算器查看粗略报价。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：添加表单 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" /> 新增阶梯价格
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">材质与规格</label>
              <input
                type="text"
                list="material-options"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                placeholder="例如：牛皮单色250克"
              />
              <datalist id="material-options">
                <option value="牛皮单色250克" />
                <option value="铜版纸4色250克" />
                <option value="黑卡单色250克" />
                <option value="普通纸单印120克" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">长宽高尺寸</label>
              <input
                type="text"
                list="size-options"
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                placeholder="例如：12.8cm*9.5cm*22cm"
              />
              <datalist id="size-options">
                <option value="12.8cm*9.5cm*22cm" />
                <option value="21cm*14cm*19cm" />
                <option value="28cm*15cm*28cm" />
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">起订量 (个)</label>
                <input
                  type="number"
                  list="qty-options"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  placeholder="例如：500"
                />
                <datalist id="qty-options">
                  <option value="500" />
                  <option value="2000" />
                  <option value="5000" />
                  <option value="10000" />
                  <option value="20000" />
                  <option value="30000" />
                </datalist>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">单价 ($)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  placeholder="例如：0.85"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "保存报价规则"}
              </button>
            </div>
          </form>
        </div>

        {/* 右侧：数据表格 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
            ) : rules.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Calculator className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p>目前还没有录入任何报价数据</p>
                <p className="text-sm mt-2">请在左侧表单中添加</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold">材质规格</th>
                      <th className="px-6 py-4 font-bold">尺寸</th>
                      <th className="px-6 py-4 font-bold text-right">数量阶梯</th>
                      <th className="px-6 py-4 font-bold text-right">单价</th>
                      <th className="px-6 py-4 font-bold text-right">总价</th>
                      <th className="px-6 py-4 font-bold text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{rule.material}</td>
                        <td className="px-6 py-4">{rule.size}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-700">
                            {rule.quantity.toLocaleString()} 个
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">
                          ${rule.unitPrice.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ${rule.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
