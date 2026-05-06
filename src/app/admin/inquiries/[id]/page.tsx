import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BOX_CATEGORY_LABELS, MATERIAL_LABELS, PRINTING_LABELS } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";

async function updateStatus(id: string, newStatus: any) {
  "use server";
  await prisma.inquiry.update({
    where: { id },
    data: { status: newStatus },
  });
  revalidatePath(`/admin/inquiries/${id}`);
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!inquiry) {
    notFound();
  }

  const getWaLink = () => {
    if (!inquiry.whatsapp) return null;
    const cleanPhone = inquiry.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}`;
  };

  const getLineLink = () => {
    if (!inquiry.lineId) return null;
    return `https://line.me/R/ti/p/~${inquiry.lineId}`;
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/inquiries" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-text-secondary)", fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} />
          返回询价列表
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{inquiry.inquiryNumber}</h1>
            <span className={`badge ${inquiry.status === "NEW" ? "badge-blue" : "badge-gray"}`}>{inquiry.status}</span>
          </div>
          <div style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
            提交时间 {new Date(inquiry.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Status Update Form */}
        <form action={async (formData) => {
          "use server";
          const status = formData.get("status");
          if (status) await updateStatus(id, status);
        }} style={{ display: "flex", gap: 8 }}>
          <select name="status" defaultValue={inquiry.status} className="input" style={{ width: "auto", padding: "8px 12px" }}>
            <option value="NEW">新请求 (NEW)</option>
            <option value="REVIEWING">审核中 (REVIEWING)</option>
            <option value="QUOTED">已报价 (QUOTED)</option>
            <option value="FOLLOWING_UP">跟进中 (FOLLOWING_UP)</option>
            <option value="WON">已成交 (WON)</option>
            <option value="LOST">已流失 (LOST)</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>更新状态</button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Customer Info */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>客户详情</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DetailItem label="姓名" value={inquiry.contactName} />
            <DetailItem label="公司" value={inquiry.company} />
            <DetailItem label="国家" value={inquiry.country} />
            
            <div style={{ height: 1, background: "var(--color-border-light)", margin: "8px 0" }} />
            
            <DetailItem 
              label="邮箱" 
              value={
                <a href={`mailto:${inquiry.contactEmail}`} style={{ color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={14} /> {inquiry.contactEmail}
                </a>
              } 
            />
            {inquiry.whatsapp && (
              <DetailItem 
                label="WhatsApp" 
                value={
                  <a href={getWaLink()!} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageCircle size={14} /> {inquiry.whatsapp} <ExternalLink size={12} />
                  </a>
                } 
              />
            )}
            {inquiry.lineId && (
              <DetailItem 
                label="LINE ID" 
                value={
                  <a href={getLineLink()!} target="_blank" rel="noopener noreferrer" style={{ color: "#00B900", display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageCircle size={14} /> {inquiry.lineId} <ExternalLink size={12} />
                  </a>
                } 
              />
            )}
            {inquiry.wechatId && (
              <DetailItem label="WeChat ID" value={inquiry.wechatId} />
            )}
            <DetailItem label="首选渠道" value={<span className="badge badge-gray">{inquiry.preferredChannel}</span>} />
          </div>
        </div>

        {/* Product Requirements */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>产品配置</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DetailItem label="盒型" value={inquiry.boxCategory ? BOX_CATEGORY_LABELS[inquiry.boxCategory] : "客制化需求"} />
            <DetailItem 
              label="尺寸" 
              value={inquiry.length ? `${inquiry.length} × ${inquiry.width} × ${inquiry.height} mm` : "未指定"} 
            />
            <DetailItem label="材质" value={inquiry.material ? MATERIAL_LABELS[inquiry.material] || inquiry.material : "未指定"} />
            <DetailItem label="印刷" value={inquiry.printing ? PRINTING_LABELS[inquiry.printing] || inquiry.printing : "未指定"} />
            <DetailItem 
              label="表面处理" 
              value={inquiry.finishes.length > 0 ? inquiry.finishes.join(", ") : "无"} 
            />
            
            <div style={{ height: 1, background: "var(--color-border-light)", margin: "8px 0" }} />
            
            <DetailItem label="需求数量" value={inquiry.quantity ? `${inquiry.quantity.toLocaleString()} 件` : "未指定"} />
            <DetailItem label="交期要求" value={inquiry.timeline || "无特别要求"} />
          </div>
        </div>
      </div>

      {inquiry.notes && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>补充说明</h2>
          <p style={{ whiteSpace: "pre-wrap", color: "var(--color-text-secondary)", fontSize: 14 }}>{inquiry.notes}</p>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16, fontSize: 14 }}>
      <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</span>
      <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}
