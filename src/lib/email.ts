import { Resend } from "resend";

// 如果没有配置 RESEND_API_KEY，则仅打印日志，不抛出异常，保证本地开发不报错
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendInquiryNotification(inquiry: any) {
  if (!resend) {
    console.log("ℹ️ [EMAIL] 跳过发送邮件 (未配置 RESEND_API_KEY): 通知销售团队");
    return;
  }

  try {
    await resend.emails.send({
      from: "PackCustom <hello@packcustom.com>", // 注意：在 Resend 需要验证域名
      to: ["sales@packcustom.com"], // 替换成真实的销售团队邮箱
      subject: `🚨 New Inquiry: ${inquiry.inquiryNumber} - ${inquiry.contactName}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Inquiry Number:</strong> ${inquiry.inquiryNumber}</p>
        <p><strong>Name:</strong> ${inquiry.contactName}</p>
        <p><strong>Email:</strong> ${inquiry.contactEmail}</p>
        <p><strong>Company:</strong> ${inquiry.company || "N/A"}</p>
        <p><strong>Country:</strong> ${inquiry.country}</p>
        <hr />
        <h3>Product Details</h3>
        <p><strong>Category:</strong> ${inquiry.boxCategory || "N/A"}</p>
        <p><strong>Size:</strong> ${inquiry.length}x${inquiry.width}x${inquiry.height} mm</p>
        <p><strong>Material:</strong> ${inquiry.material || "N/A"}</p>
        <p><strong>Quantity:</strong> ${inquiry.quantity || "N/A"}</p>
        <p><strong>Timeline:</strong> ${inquiry.timeline || "N/A"}</p>
        <br />
        <p>Please log in to the admin dashboard to review and quote.</p>
      `,
    });
    console.log(`✅ [EMAIL] 销售团队通知单发送成功: ${inquiry.inquiryNumber}`);
  } catch (error) {
    console.error("❌ [EMAIL] 发送通知失败:", error);
  }
}

export async function sendCustomerConfirmation(inquiry: any) {
  if (!resend) {
    console.log("ℹ️ [EMAIL] 跳过发送邮件 (未配置 RESEND_API_KEY): 发送客户确认信");
    return;
  }

  try {
    await resend.emails.send({
      from: "PackCustom <hello@packcustom.com>", // 注意：在 Resend 需要验证域名
      to: [inquiry.contactEmail],
      subject: `We've received your inquiry! (${inquiry.inquiryNumber})`,
      html: `
        <h2>Thank you for reaching out, ${inquiry.contactName}!</h2>
        <p>We have successfully received your inquiry for custom packaging.</p>
        <p><strong>Your Inquiry Reference:</strong> ${inquiry.inquiryNumber}</p>
        <p>Our packaging experts are reviewing your requirements and will get back to you with a custom quote within 24 hours.</p>
        <hr />
        <p>If you have any immediate questions, feel free to reply to this email.</p>
        <br />
        <p>Best Regards,</p>
        <p>The PackCustom Team</p>
      `,
    });
    console.log(`✅ [EMAIL] 客户确认信发送成功: ${inquiry.contactEmail}`);
  } catch (error) {
    console.error("❌ [EMAIL] 客户确认信发送失败:", error);
  }
}
