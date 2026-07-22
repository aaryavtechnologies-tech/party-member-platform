import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://party-member-platform.onrender.com"),
    plugins: [emailOTPClient()]
});

export const { useSession, signIn, signUp, signOut } = authClient;
