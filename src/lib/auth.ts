import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import { emailOTP } from "better-auth/plugins";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.EMAIL_FROM || "RAVP <noreply@playvia.in>";

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
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset your password – RAVP",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#166534">Rashtriya Annadata Vikas Party</h2>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <a href="${url}" style="display:inline-block;background:#166534;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0">Reset Password</a>
          <p>This link will expire in 24 hours.</p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">If you did not request a password reset, please ignore this email.</p>
        </div>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Verify your email address – RAVP",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#166534">Rashtriya Annadata Vikas Party</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${url}" style="display:inline-block;background:#166534;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Verify Email</a>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">If you did not register on RAVP, please ignore this email.</p>
        </div>`,
      });
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Your OTP Verification Code – RAVP",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#166534">Rashtriya Annadata Vikas Party</h2>
            <p>Your one-time password (OTP) for verification is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#166534;background:#f0fdf4;padding:20px;border-radius:8px;text-align:center;margin:16px 0">${otp}</div>
            <p>This OTP will expire in <strong>5 minutes</strong>.</p>
            <p style="color:#6b7280;font-size:12px;margin-top:24px">If you did not request this, please ignore this email.</p>
          </div>`,
        });
      },
    }),
  ],
});

