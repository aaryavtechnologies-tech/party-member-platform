import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "RAVP <info@yourdomain.com>";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || "https://party-member-platform.onrender.com",
  trustedOrigins: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://party-member-platform.onrender.com",
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.RENDER_EXTERNAL_URL || "",
  ].filter(Boolean),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[Auth Email] Attempting to send reset password email to: ${user.email}`);
      console.log(`\n========================================`);
      console.log(`🔑 Reset Password URL for ${user.email} is: ${url}`);
      console.log(`========================================\n`);
      
      try {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Reset your password – RAVP",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color:#FF9933;padding:24px;text-align:center;">
              <h2 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Rashtriya Annadata Vikas Party</h2>
              <h3 style="color:#ffffff;margin:8px 0 0 0;font-size:20px;font-weight:bold;">રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી</h3>
            </div>
            <div style="padding:24px;background-color:#ffffff;color:#333333;">
              <p style="font-size:16px;line-height:1.5;margin-top:0;">
                We received a request to reset your password. Click the link below to set a new password:
              </p>
              <p style="font-size:16px;line-height:1.5;margin-top:0;">
                અમને તમારો પાસવર્ડ રીસેટ કરવાની વિનંતી મળી છે. નવો પાસવર્ડ સેટ કરવા માટે નીચેની લિંક પર ક્લિક કરો:
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${url}" style="display:inline-block;background-color:#000080;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">
                  Reset Password / પાસવર્ડ રીસેટ કરો
                </a>
              </div>
              <p style="font-size:14px;color:#666666;line-height:1.5;">
                This link will expire in 24 hours. (આ લિંક 24 કલાકમાં સમાપ્ત થશે.)
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                If you did not request a password reset, please ignore this email. (જો તમે પાસવર્ડ રીસેટ કરવાની વિનંતી કરી નથી, તો કૃપા કરીને આ ઇમેઇલની અવગણના કરો.)
              </p>
            </div>
          </div>`,
        });
        if (error) {
          console.error(`[Auth Email] Resend API Error sending reset password email to ${user.email}:`, error);
        } else {
          console.log(`[Auth Email] Successfully sent reset password email to ${user.email}`, data);
        }
      } catch (err) {
        console.error(`[Auth Email] Exception sending reset password email to ${user.email}:`, err);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[Auth Email] Attempting to send verification email to: ${user.email}`);
      console.log(`\n========================================`);
      console.log(`🔑 Verification URL for ${user.email} is: ${url}`);
      console.log(`========================================\n`);

      try {
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Verify your email address – RAVP",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color:#FF9933;padding:24px;text-align:center;">
              <h2 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Rashtriya Annadata Vikas Party</h2>
              <h3 style="color:#ffffff;margin:8px 0 0 0;font-size:20px;font-weight:bold;">રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી</h3>
            </div>
            <div style="padding:24px;background-color:#ffffff;color:#333333;">
              <p style="font-size:16px;line-height:1.5;margin-top:0;">
                Click the link below to verify your email address:
              </p>
              <p style="font-size:16px;line-height:1.5;margin-top:0;">
                તમારું ઇમેઇલ સરનામું ચકાસવા માટે નીચેની લિંક પર ક્લિક કરો:
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${url}" style="display:inline-block;background-color:#000080;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">
                  Verify Email / ઇમેઇલ ચકાસો
                </a>
              </div>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                If you did not register on RAVP, please ignore this email. (જો તમે RAVP પર નોંધણી કરી નથી, તો કૃપા કરીને આ ઇમેઇલની અવગણના કરો.)
              </p>
            </div>
          </div>`,
        });
        if (error) {
          console.error(`[Auth Email] Resend API Error sending verification email to ${user.email}:`, error);
        } else {
          console.log(`[Auth Email] Successfully sent verification email to ${user.email}`, data);
        }
      } catch (err) {
        console.error(`[Auth Email] Exception sending verification email to ${user.email}:`, err);
      }
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[Auth Email] Attempting to send ${type} OTP to: ${email}`);
        console.log(`\n========================================`);
        console.log(`🔑 OTP for ${email} is: ${otp}`);
        console.log(`========================================\n`);

        try {
          const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: "Your OTP Verification Code – RAVP",
            html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background-color:#FF9933;padding:24px;text-align:center;">
                <h2 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Rashtriya Annadata Vikas Party</h2>
                <h3 style="color:#ffffff;margin:8px 0 0 0;font-size:20px;font-weight:bold;">રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી</h3>
              </div>
              <div style="padding:24px;background-color:#ffffff;color:#333333;">
                <p style="font-size:16px;line-height:1.5;margin-top:0;">
                  Your one-time password (OTP) for verification is:
                </p>
                <p style="font-size:16px;line-height:1.5;margin-top:0;">
                  ચકાસણી માટે તમારો વન-ટાઇમ પાસવર્ડ (OTP) છે:
                </p>
                <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#000080;background:#f3f4f6;padding:24px;border-radius:8px;text-align:center;margin:32px 0;border:2px dashed #000080;">
                  ${otp}
                </div>
                <p style="font-size:14px;color:#666666;line-height:1.5;text-align:center;">
                  This OTP will expire in <strong>5 minutes</strong>.<br />
                  (આ OTP <strong>5 મિનિટમાં</strong> સમાપ્ત થશે.)
                </p>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  If you did not request this, please ignore this email. (જો તમે આ વિનંતી કરી નથી, તો કૃપા કરીને આ ઇમેઇલની અવગણના કરો.)
                </p>
              </div>
            </div>`,
          });
          if (error) {
            console.error(`[Auth Email] Resend API Error sending ${type} OTP to ${email}:`, error);
          } else {
            console.log(`[Auth Email] Successfully sent ${type} OTP to ${email}`, data);
          }
        } catch (err) {
          console.error(`[Auth Email] Exception sending ${type} OTP to ${email}:`, err);
        }
      },
    }),
  ],
  advanced: {
    defaultCookieAttributes: {
      secure: true,
    },
    useSecureCookies: true,
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    }
  }
});

