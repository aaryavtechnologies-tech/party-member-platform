import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("[sendEmail] RESEND_API_KEY environment variable is not set!");
    return {
      success: false,
      error: "RESEND_API_KEY environment variable is missing. Please set RESEND_API_KEY in Render environment variables.",
    };
  }

  const from = process.env.EMAIL_FROM || "RVSP <noreply@playvia.in>";

  try {
    console.log(`[sendEmail] Sending email via Resend to ${to} from ${from}...`);
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[sendEmail] Resend API error:", error);
      return {
        success: false,
        error: `Resend error: ${error.message}`,
      };
    }

    console.log(`[sendEmail] Resend email sent successfully:`, data);
    return { success: true };
  } catch (resendError: any) {
    console.error("[sendEmail] Resend delivery exception:", resendError);
    return {
      success: false,
      error: `Resend exception: ${resendError?.message || resendError}`,
    };
  }
}
