import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.EMAIL_FROM || "RAVP <noreply@playvia.in>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@rashtriyaannadatavikasparty.org";

export interface ContactInquiryEmailPayload {
  inquiryId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  state: string;
  district: string;
  taluka: string;
  subject: string;
  message: string;
  createdAt: string;
}

export async function sendUserInquiryConfirmationEmail(data: ContactInquiryEmailPayload) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Inquiry Confirmation [${data.inquiryId}] – Rashtriya Annadata Vikas Party`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.02em;">Rashtriya Annadata Vikas Party (RAVP)</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your Contact, Our Trust – Always With You For Public Service</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 32px 24px; color: #1e293b;">
            <h2 style="color: #166534; font-size: 20px; margin-top: 0;">Thank You, ${data.fullName}!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">
              We have received your message and created an official inquiry ticket. Our public relations and administration team will review your request and reach out as soon as possible.
            </p>
            
            <!-- Ticket Info Card -->
            <div style="background-color: #f8fafc; border-left: 4px solid #166534; padding: 20px; border-radius: 6px; margin: 24px 0;">
              <div style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">Inquiry Reference Number</div>
              <div style="font-size: 22px; font-weight: 800; color: #166534;">${data.inquiryId}</div>
            </div>

            <!-- Details Summary Table -->
            <h3 style="font-size: 16px; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Submitted Information</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 35%;">Full Name:</td>
                <td style="padding: 8px 0; color: #0f172a;">${data.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Mobile Number:</td>
                <td style="padding: 8px 0; color: #0f172a;">${data.mobileNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Location:</td>
                <td style="padding: 8px 0; color: #0f172a;">${data.taluka}, ${data.district}, ${data.state}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${data.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0; color: #0f172a; line-height: 1.5;">${data.message}</td>
              </tr>
            </table>

            <div style="margin-top: 32px; padding: 16px; background-color: #f0fdf4; border-radius: 8px; font-size: 13px; color: #166534; line-height: 1.5;">
              ⏱ <strong>Expected Response Time:</strong> Within 24 to 48 business hours.<br/>
              If you require immediate assistance, please call our Central Helpline at <strong>9016641851</strong>.
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;">Rashtriya Annadata Vikas Party (RAVP) Headquarters</p>
            <p style="margin: 0 0 4px 0;">336 Royal Complex, Bhutkhana Chowk, Dhebar Road, Rajkot – 360001, Gujarat, India</p>
            <p style="margin: 0;">Website: <a href="https://www.rashtriyaannadatavikasparty.org" style="color: #166534; text-decoration: none;">www.rashtriyaannadatavikasparty.org</a></p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send user contact confirmation email:", error);
  }
}

export async function sendAdminInquiryNotificationEmail(data: ContactInquiryEmailPayload) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 New Contact Inquiry [${data.inquiryId}]: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px;">New Public Inquiry Received</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Inquiry ID: ${data.inquiryId}</p>
          </div>
          
          <div style="padding: 24px; color: #1e293b;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Name:</td><td>${data.fullName}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Mobile:</td><td><a href="tel:${data.mobileNumber}">${data.mobileNumber}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Location:</td><td>${data.taluka}, ${data.district}, ${data.state}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td><td style="font-weight: 700; color: #166534;">${data.subject}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td><td style="line-height: 1.5;">${data.message}</td></tr>
            </table>

            <div style="margin-top: 24px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/en/admin/contact" style="display: inline-block; background-color: #166534; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none;">View Inquiry in Admin Panel</a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin contact notification email:", error);
  }
}
