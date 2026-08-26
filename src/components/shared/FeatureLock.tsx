"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard } from "lucide-react";
import "@/styles/designTokens.css";

interface FeatureLockProps {
  isPaidOrInGracePeriod: boolean;
  requiredTier?: string;
  children: React.ReactNode;
}

export function FeatureLock({ isPaidOrInGracePeriod, requiredTier, children }: FeatureLockProps) {
  // As requested, the plan requirement is now optional, so all members can access locked features.
  return <>{children}</>;
}
