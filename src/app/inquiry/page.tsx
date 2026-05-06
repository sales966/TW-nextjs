"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRIES, BOX_CATEGORY_LABELS, MATERIAL_LABELS, PRINTING_LABELS, FINISH_LABELS } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * 询价表单页面
 * 对应用户截图中的 Product Inquiry 表单
 * 路由: /inquiry?product=xxx
 */

interface InquiryFormData {
  // 联系信息
  contactName: string;
  contactEmail: string;
  company: string;
  country: string;
  phone: string;
  whatsapp: string;
  lineId: string;
  wechatId: string;
  preferredChannel: string;
  // 询价类型
  inquiryType: string;
  // 产品配置
  boxCategory: string;
  length: string;
  width: string;
  height: string;
  material: string;
  printing: string;
  finishes: string[];
  quantity: string;
  timeline: string;
  notes: string;
}

const INITIAL_FORM: InquiryFormData = {
  contactName: "",
  contactEmail: "",
  company: "",
  country: "",
  phone: "",
  whatsapp: "",
  lineId: "",
  wechatId: "",
  preferredChannel: "EMAIL",
  inquiryType: "REQUEST_QUOTE",
  boxCategory: "",
  length: "",
  width: "",
  height: "",
  material: "",
  printing: "",
  finishes: [],
  quantity: "",
  timeline: "",
  notes: "",
};

export default function InquiryPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState<InquiryFormData>(INITIAL_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read params if coming from configure page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("boxCategory")) {
      setForm(prev => ({ ...prev, 
        boxCategory: params.get("boxCategory") || "",
        length: params.get("length") || "",
        width: params.get("width") || "",
        height: params.get("height") || "",
        material: params.get("material") || "",
        printing: params.get("printing") || "",
        quantity: params.get("quantity") || "",
        timeline: params.get("timeline") || ""
      }));
    }
  }, []);

  const updateField = (field: keyof InquiryFormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // 清除错误
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleFinish = (finish: string) => {
    setForm((prev) => ({
      ...prev,
      finishes: prev.finishes.includes(finish)
        ? prev.finishes.filter((f) => f !== finish)
        : [...prev.finishes, finish],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // 最多5个
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.contactName.trim()) errs.contactName = "Name is required";
    if (!form.contactEmail.trim()) errs.contactEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) errs.contactEmail = "Invalid email";
    if (!form.country) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          length: form.length ? parseFloat(form.length) : undefined,
          width: form.width ? parseFloat(form.width) : undefined,
          height: form.height ? parseFloat(form.height) : undefined,
          quantity: form.quantity ? parseInt(form.quantity) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setInquiryNumber(data.inquiryNumber);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── 提交成功页面 ──
  if (submitted) {
    return (
      <div className="success-page">
        <div className="success-card animate-fade-in-up">
          <div className="success-icon">✅</div>
          <h1>Thank You!</h1>
          <p className="success-msg">
            Your inquiry has been submitted successfully. Our team will review your request 
            and get back to you within <strong>24 hours</strong>.
          </p>
          <div className="inquiry-number-display">
            <span className="inquiry-label">Your Inquiry Number</span>
            <span className="inquiry-code">{inquiryNumber}</span>
          </div>
          <div className="success-next">
            <h3>What happens next?</h3>
            <div className="next-steps">
              <div className="next-step">
                <span className="next-step-num">1</span>
                <span>Our team reviews your requirements</span>
              </div>
              <div className="next-step">
                <span className="next-step-num">2</span>
                <span>We send you a detailed quote via email</span>
              </div>
              <div className="next-step">
                <span className="next-step-num">3</span>
                <span>We connect with you on WhatsApp/LINE/WeChat for further discussion</span>
              </div>
            </div>
          </div>
          <a href="/" className="btn btn-secondary">
            Back to Home
          </a>
        </div>

        <style jsx>{`
          .success-page {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: linear-gradient(135deg, #f0f9f4 0%, #e8f4f7 100%);
          }
          .success-card {
            background: white;
            border-radius: var(--radius-xl);
            padding: 48px;
            max-width: 560px;
            width: 100%;
            text-align: center;
            box-shadow: var(--shadow-xl);
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .success-card h1 {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
          }
          .success-msg {
            font-size: 16px;
            color: var(--color-text-secondary);
            line-height: 1.7;
            margin-bottom: 24px;
          }
          .inquiry-number-display {
            background: var(--color-primary-50);
            border-radius: var(--radius-md);
            padding: 16px;
            margin-bottom: 32px;
          }
          .inquiry-label {
            display: block;
            font-size: 13px;
            color: var(--color-text-muted);
            margin-bottom: 4px;
          }
          .inquiry-code {
            font-size: 22px;
            font-weight: 800;
            color: var(--color-primary);
            font-family: monospace;
            letter-spacing: 0.05em;
          }
          .success-next {
            text-align: left;
            margin-bottom: 32px;
          }
          .success-next h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .next-steps {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .next-step {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: var(--color-text-secondary);
          }
          .next-step-num {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--color-primary);
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
            flex-shrink: 0;
          }
        `}</style>
      </div>
    );
  }

  // ── 询价表单 ──
  return (
    <div className="inquiry-page">
      <div className="inquiry-container">
        {/* 表单头部 */}
        <div className="inquiry-header card">
          <div className="inquiry-header-icon">📦</div>
          <div>
            <h2 className="inquiry-header-title">{t.inquiry.title}</h2>
            <p className="inquiry-header-desc">
              {t.inquiry.desc}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="inquiry-form">
          {/* ── 联系信息区 ── */}
          <div className="form-section">
            <h3 className="form-section-title">{lang === "zh" ? "联系信息" : "Contact Information"}</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="label label-required">{t.inquiry.name}</label>
                <input
                  type="text"
                  className={`input ${errors.contactName ? "input-error" : ""}`}
                  placeholder={lang === "zh" ? "请输入您的全名" : "Your full name"}
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                />
                {errors.contactName && <span className="field-error">{errors.contactName}</span>}
              </div>
              <div className="form-group">
                <label className="label label-required">{t.inquiry.email}</label>
                <input
                  type="email"
                  className={`input ${errors.contactEmail ? "input-error" : ""}`}
                  placeholder="your@email.com"
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
                {errors.contactEmail && <span className="field-error">{errors.contactEmail}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">{t.inquiry.company}</label>
                <input
                  type="text"
                  className="input"
                  placeholder={lang === "zh" ? "您的公司名称" : "Company name (optional)"}
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="label label-required">Country / Region</label>
                <select
                  className={`select ${errors.country ? "input-error" : ""}`}
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                >
                  <option value="">Select Country/Region</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <span className="field-error">{errors.country}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Phone / WhatsApp / LINE</label>
              <input
                type="text"
                className="input"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            {/* 偏好沟通方式 */}
            <div className="form-group">
              <label className="label">Preferred Contact Method</label>
              <div className="channel-options">
                {["EMAIL", "WHATSAPP", "LINE", "WECHAT"].map((ch) => (
                  <label key={ch} className={`channel-option ${form.preferredChannel === ch ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="preferredChannel"
                      value={ch}
                      checked={form.preferredChannel === ch}
                      onChange={(e) => updateField("preferredChannel", e.target.value)}
                    />
                    <span className="channel-icon">
                      {ch === "EMAIL" && "📧"}
                      {ch === "WHATSAPP" && "💬"}
                      {ch === "LINE" && "📘"}
                      {ch === "WECHAT" && "🟢"}
                    </span>
                    <span className="channel-name">{ch.charAt(0) + ch.slice(1).toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 根据选择显示对应 ID 输入框 */}
            {form.preferredChannel === "WHATSAPP" && (
              <div className="form-group animate-fade-in">
                <label className="label">WhatsApp Number</label>
                <input
                  type="text" className="input" placeholder="+1 234 567 8900"
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                />
              </div>
            )}
            {form.preferredChannel === "LINE" && (
              <div className="form-group animate-fade-in">
                <label className="label">LINE ID</label>
                <input
                  type="text" className="input" placeholder="Your LINE ID"
                  value={form.lineId}
                  onChange={(e) => updateField("lineId", e.target.value)}
                />
              </div>
            )}
            {form.preferredChannel === "WECHAT" && (
              <div className="form-group animate-fade-in">
                <label className="label">WeChat ID</label>
                <input
                  type="text" className="input" placeholder="Your WeChat ID"
                  value={form.wechatId}
                  onChange={(e) => updateField("wechatId", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* ── 询价类型 ── */}
          <div className="form-section">
            <h3 className="form-section-title">Inquiry Details</h3>

            <div className="form-group">
              <label className="label label-required">Inquiry Type</label>
              <select
                className="select"
                value={form.inquiryType}
                onChange={(e) => updateField("inquiryType", e.target.value)}
              >
                <option value="REQUEST_QUOTE">Request Quote</option>
                <option value="SAMPLE_REQUEST">Sample Request</option>
                <option value="GENERAL_INQUIRY">General Inquiry</option>
              </select>
            </div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="label">Product Type</label>
                <select
                  className="select"
                  value={form.boxCategory}
                  onChange={(e) => updateField("boxCategory", e.target.value)}
                >
                  <option value="">Select type</option>
                  {Object.entries(BOX_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Quantity</label>
                <input
                  type="number" className="input" placeholder="e.g. 500"
                  value={form.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="label">Timeline</label>
                <select
                  className="select"
                  value={form.timeline}
                  onChange={(e) => updateField("timeline", e.target.value)}
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1-2 weeks">1-2 Weeks</option>
                  <option value="2-4 weeks">2-4 Weeks</option>
                  <option value="1-2 months">1-2 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* 尺寸 */}
            <div className="form-group">
              <label className="label">Dimensions (mm) — Length × Width × Height</label>
              <div className="dimension-inputs">
                <input
                  type="number" className="input" placeholder="Length"
                  value={form.length}
                  onChange={(e) => updateField("length", e.target.value)}
                />
                <span className="dimension-x">×</span>
                <input
                  type="number" className="input" placeholder="Width"
                  value={form.width}
                  onChange={(e) => updateField("width", e.target.value)}
                />
                <span className="dimension-x">×</span>
                <input
                  type="number" className="input" placeholder="Height"
                  value={form.height}
                  onChange={(e) => updateField("height", e.target.value)}
                />
              </div>
            </div>

            {/* 材质和印刷 */}
            <div className="form-row">
              <div className="form-group">
                <label className="label">Material</label>
                <select
                  className="select"
                  value={form.material}
                  onChange={(e) => updateField("material", e.target.value)}
                >
                  <option value="">Select material</option>
                  {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Printing</label>
                <select
                  className="select"
                  value={form.printing}
                  onChange={(e) => updateField("printing", e.target.value)}
                >
                  <option value="">Select printing</option>
                  {Object.entries(PRINTING_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 工艺 */}
            <div className="form-group">
              <label className="label">Finishing Options</label>
              <div className="finish-options">
                {Object.entries(FINISH_LABELS).map(([value, label]) => (
                  <label key={value} className={`finish-option ${form.finishes.includes(value) ? "active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={form.finishes.includes(value)}
                      onChange={() => toggleFinish(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── 附加说明 + 文件上传 ── */}
          <div className="form-section">
            <h3 className="form-section-title">Additional Details</h3>

            <div className="form-group">
              <label className="label">Notes / Special Requirements</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Describe any specific requirements, references, or questions you have..."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* 文件上传 */}
            <div className="form-group">
              <label className="label">Upload Files (Logo / Design / Dieline)</label>
              <div
                className="file-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove("drag-over"); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("drag-over");
                  if (e.dataTransfer.files) {
                    const newFiles = Array.from(e.dataTransfer.files);
                    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
                  }
                }}
              >
                <div className="file-drop-icon">📎</div>
                <p className="file-drop-text">
                  <strong>Drag & drop</strong> files here, or <strong>click to browse</strong>
                </p>
                <p className="file-drop-hint">
                  AI, PDF, EPS, PNG, JPG, SVG, PSD — Max 50MB per file, up to 5 files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".ai,.pdf,.eps,.png,.jpg,.jpeg,.svg,.psd"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {files.length > 0 && (
                <div className="file-list">
                  {files.map((file, i) => (
                    <div key={i} className="file-item">
                      <span className="file-item-name">📄 {file.name}</span>
                      <span className="file-item-size">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <button type="button" className="file-remove" onClick={() => removeFile(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 提交按钮 ── */}
          <button
            type="submit"
            className="btn btn-primary btn-lg submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                {lang === "zh" ? "提交中..." : "Submitting..."}
              </>
            ) : (
              <>
                {t.inquiry.submit}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .inquiry-page {
          min-height: 80vh;
          padding: 40px 24px 80px;
          background: var(--color-bg);
        }
        .inquiry-container {
          max-width: 720px;
          margin: 0 auto;
        }
        .inquiry-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          margin-bottom: 24px;
          background: linear-gradient(135deg, var(--color-primary-50), #eff6ff);
          border-color: var(--color-primary-100);
        }
        .inquiry-header-icon {
          font-size: 36px;
        }
        .inquiry-header-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 2px;
        }
        .inquiry-header-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        .inquiry-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-section {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }
        .form-section-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-border-light);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-row-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .field-error {
          display: block;
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }

        /* 沟通渠道选择 */
        .channel-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .channel-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 13px;
          font-weight: 500;
        }
        .channel-option input {
          display: none;
        }
        .channel-option.active {
          border-color: var(--color-primary);
          background: var(--color-primary-50);
          color: var(--color-primary);
        }
        .channel-option:hover {
          border-color: var(--color-primary-100);
        }
        .channel-icon {
          font-size: 16px;
        }

        /* 尺寸输入 */
        .dimension-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dimension-x {
          font-size: 18px;
          color: var(--color-text-muted);
          font-weight: 300;
        }

        /* 工艺选项 */
        .finish-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .finish-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: 100px;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 13px;
        }
        .finish-option input {
          display: none;
        }
        .finish-option.active {
          border-color: var(--color-primary);
          background: var(--color-primary-50);
          color: var(--color-primary);
          font-weight: 600;
        }
        .finish-option:hover {
          border-color: var(--color-primary-100);
        }

        /* 文件上传区 */
        .file-drop-zone {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .file-drop-zone:hover,
        .file-drop-zone.drag-over {
          border-color: var(--color-primary);
          background: var(--color-primary-50);
        }
        .file-drop-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .file-drop-text {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-bottom: 4px;
        }
        .file-drop-hint {
          font-size: 12px;
          color: var(--color-text-muted);
        }
        .file-list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          font-size: 13px;
        }
        .file-item-name {
          flex: 1;
          font-weight: 500;
        }
        .file-item-size {
          color: var(--color-text-muted);
          font-size: 12px;
        }
        .file-remove {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }
        .file-remove:hover {
          color: #ef4444;
        }

        /* 提交按钮 */
        .submit-btn {
          width: 100%;
          margin-top: 8px;
          font-size: 17px;
          padding: 18px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .form-row,
          .form-row-3 {
            grid-template-columns: 1fr;
          }
          .channel-options {
            grid-template-columns: 1fr 1fr;
          }
          .dimension-inputs {
            flex-direction: column;
          }
          .dimension-x {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
