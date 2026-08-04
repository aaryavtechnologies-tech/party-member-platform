"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { fullName, fatherName, dob, address, pincode, image } = data;

    // Update User
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: fullName,
        ...(image !== undefined && { image })
      }
    });

    // Update MemberProfile
    await prisma.memberProfile.update({
      where: { userId: session.user.id },
      data: {
        fatherName,
        dob: new Date(dob),
        fullAddress: address,
        pincode
      }
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
