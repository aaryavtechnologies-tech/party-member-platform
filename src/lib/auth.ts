import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import { emailOTP } from "better-auth/plugins";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link below to verify your email address:</p>
               <a href="${url}">Verify Email</a>`,
      });
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: "Party Platform <onboarding@resend.dev>",
          to: email,
          subject: "Your OTP Verification Code",
          html: `<p>Your one-time password is: <strong>${otp}</strong></p>
                 <p>It will expire in 5 minutes.</p>`,
        });
      },
    }),
  ],
});
