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

    const { fullName, fatherName, dob, address, pincode, image, voterId, aadhaar, mobile, gender, state, district, taluka, village, occupation } = data;

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
        pincode,
        mobile,
        ...(voterId !== undefined && { voterId }),
        ...(aadhaar !== undefined && { aadhaar }),
        ...(image !== undefined && { profilePic: image }),
        ...(gender !== undefined && { gender }),
        ...(state !== undefined && { state }),
        ...(district !== undefined && { district }),
        ...(taluka !== undefined && { taluka }),
        ...(village !== undefined && { village }),
        ...(occupation !== undefined && { occupation })
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
