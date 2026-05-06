import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BOX_CATEGORY_LABELS } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return "badge-blue";
      case "REVIEWING": return "badge-orange";
      case "QUOTED": return "badge-gray";
      case "WON": return "badge-green";
      case "LOST": return "badge-red";
      default: return "badge-gray";
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>询价单列表</h1>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
              <th style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>单号 / 日期</th>
              <th style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>客户信息</th>
              <th style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>产品需求</th>
              <th style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>状态</th>
              <th style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{inq.inquiryNumber}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{inq.contactName}</div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    {inq.company || inq.country}
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontSize: 13 }}>
                    {inq.boxCategory ? BOX_CATEGORY_LABELS[inq.boxCategory] : "客制化需求"}
                  </div>
                  {inq.quantity && (
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      数量: {inq.quantity}
                    </div>
                  )}
                </td>
                <td style={{ padding: "16px" }}>
                  <span className={`badge ${getStatusBadge(inq.status)}`}>
                    {inq.status}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <Link href={`/admin/inquiries/${inq.id}`} className="btn btn-outline btn-sm">
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)" }}>
                  暂无询价记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
