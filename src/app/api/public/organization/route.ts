// src/app/api/public/organization/route.ts

import { NextResponse } from "next/server";
import { getAdminsByRole, countMembersByLocation, getMembers } from "@/actions/public/organization";
import { AdminRole } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type"); // "admins" or "members" or "count"
  const role = url.searchParams.get("role") as AdminRole | null;
  const state = url.searchParams.get("state") ?? undefined;
  const district = url.searchParams.get("district") ?? undefined;
  const taluka = url.searchParams.get("taluka") ?? undefined;
  const village = url.searchParams.get("village") ?? undefined;

  try {
    if (type === "admins" && role) {
      const admins = await getAdminsByRole(role, { state, district, taluka, village });
      return NextResponse.json({ admins });
    }
    if (type === "members") {
      const members = await getMembers({ state, district, taluka, village });
      return NextResponse.json({ members });
    }
    if (type === "count") {
      const count = await countMembersByLocation({ state, district, taluka, village });
      return NextResponse.json({ count });
    }
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
