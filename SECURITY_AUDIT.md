# SECURITY AUDIT — Rashtriya Annadata Vikas Party (RAVP) Platform

**Date:** 2026-08-20
**Status:** PHASE 0 COMPLETE — Remediation in progress phase by phase.

---

## Architecture Overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 |
| Language | TypeScript 5 |
| Authentication | Better Auth 1.6.23 (email+password + emailOTP) |
| ORM | Prisma 7.8.0 (pg adapter) |
| Database | Neon PostgreSQL |
| Payments | Razorpay 2.9.6 |
| Email | Resend 6.17.2 + SMTP (Nodemailer) |
| File Storage | Local filesystem /public/uploads |
| Middleware | Custom proxy.ts |

---

## CRITICAL Findings

### [CRITICAL-001] Weak Hardcoded Admin JWT Fallback Secret
**File:** src/lib/admin-auth.ts line 6
`process.env.ADMIN_JWT_SECRET || "fallback-super-secret-key-12345"`
ADMIN_JWT_SECRET is not in .env — fallback is ACTIVELY USED in production.
An attacker who discovers the fallback can forge admin JWT tokens for any role.
**Impact:** Full admin takeover including SUPER_ADMIN.
**Status:** REMEDIATED in Phase 1

### [CRITICAL-002] ADMIN_JWT_SECRET Missing from .env
**File:** .env
Variable not defined. Fallback secret is in use. See CRITICAL-001.
**Status:** REMEDIATED in Phase 1

### [CRITICAL-003] Real Production Secrets Present (Rotation Required)
**File:** .env
- Live Razorpay keys (rzp_live_*)
- Real Resend API key (re_7esaeV2Z_*)
- Real Neon DB connection string with password
- Real SMTP password (Man@2225099)
- Placeholder Better Auth secret
**Action:** All secrets must be rotated. .env must never be committed to Git.
**Status:** .env.example created in Phase 1. Secret rotation is operator responsibility.

### [CRITICAL-004] Unauthenticated File Upload Endpoint
**File:** src/app/api/upload/route.ts
No authentication. Any anonymous user can upload files to public/uploads.
No MIME type validation.
**Status:** REMEDIATED in Phase 1

### [CRITICAL-005] Admin Login Has No Per-Endpoint Brute-Force Protection
**File:** src/app/api/admin/auth/login/route.ts
60 req/min limit is too permissive for a login endpoint.
**Status:** REMEDIATED in Phase 1

---

## HIGH Findings

### [HIGH-001] deleteMemberAction Has No Authorization
**File:** src/actions/membership-actions.ts line 357
No requireAdminAuth() call. Anyone can invoke this Server Action.
**Status:** REMEDIATED in Phase 1

### [HIGH-002] Payment Verify Route — No Ownership Verification
**File:** src/app/api/payments/verify/route.ts
Does not check that order belongs to authenticated user.
**Status:** REMEDIATED in Phase 1

### [HIGH-003] In-Memory Rate Limiting Not Effective in Multi-Instance
**File:** src/proxy.ts
Map-based rate limiting per-process. Ineffective on multi-instance deployments.
**Status:** ACKNOWLEDGED — distributed rate limiting (Redis/Upstash) recommended for Phase 8

### [HIGH-004] Admin Cookie SameSite=Lax (Should Be Strict)
**File:** src/lib/admin-auth.ts
**Status:** REMEDIATED in Phase 2

### [HIGH-005] No Content-Security-Policy or Frame Protection
**File:** next.config.ts
**Status:** REMEDIATED in Phase 2

### [HIGH-006] Health Endpoint Leaks NODE_ENV
**File:** src/app/api/health/route.ts
**Status:** REMEDIATED in Phase 1

### [HIGH-007] OTPs Logged to Console in Production
**File:** src/lib/auth.ts, src/actions/membership-actions.ts
**Status:** REMEDIATED in Phase 1

### [HIGH-008] Password Reset URLs Logged to Console
**File:** src/lib/auth.ts
**Status:** REMEDIATED in Phase 1

### [HIGH-009] Better Auth Secret is Placeholder
**File:** .env
**Status:** Must be set by operator — documented in Phase 1

### [HIGH-010] createMemberByAdmin Uses data: any (Mass Assignment Risk)
**File:** src/actions/admin/members.ts
**Status:** ACKNOWLEDGED — Phase 7

### [HIGH-011] Next.js Image Remote Patterns Allow All Hosts (**) — SSRF Risk
**File:** next.config.ts
**Status:** ACKNOWLEDGED — Phase 25

---

## MEDIUM Findings

### [MEDIUM-001] No Rate Limiting on OTP Sending
### [MEDIUM-002] Email Enumeration on Registration
### [MEDIUM-003] No Pagination on getAdminMembers
### [MEDIUM-004] Admin Login Specific Error Messages (Username Enumeration)
### [MEDIUM-005] Contact Form No Rate Limiting
### [MEDIUM-006] No CORS Configuration
### [MEDIUM-007] requireAdminAuth Uses redirect() in Server Actions
### [MEDIUM-008] Admin JWT No Revocation (24h window)
### [MEDIUM-009] No DATABASE_URL Validation at Startup
### [MEDIUM-010] deleteMemberAction Leaks Internal Error Messages

---

## LOW Findings

### [LOW-001] No X-Frame-Options Fallback
### [LOW-002] Console.log Throughout Production Code
### [LOW-003] No Explicit Request Body Size Limit
### [LOW-004] OTPs Stored Plaintext in Verification Table
### [LOW-005] Referral Code Uses Math.random (Not Cryptographically Secure)
### [LOW-006] No Precise Retry-After Header

---

## INFORMATIONAL

### [INFO-001] Nodemailer/SMTP Unused but Credentials Exposed
### [INFO-002] Prisma Query Logging Disabled in Production (OK)
### [INFO-003] xlsx Package — Check for Known CVEs
### [INFO-004] html2canvas + jspdf in Client Bundle — XSS surface

---

## Threat Model

| Attacker | Primary Risk |
|---|---|
| Unauthenticated | File upload, contact spam, OTP bombing, admin brute-force |
| Authenticated malicious user | IDOR, deleteMember without auth |
| Compromised admin account | JWT valid 24h, no revocation |
| Bot/spammer | OTP spam, contact form spam |
| Malicious API client | Admin JWT forgery via hardcoded fallback |
| Payment manipulation | Verify endpoint ownership confusion |
| File upload abuse | No auth, no MIME check |
