import { AuthUser } from "@/app/types";
import { checkRole } from "@/utils/auth-utils";
import { authOptions } from '@/utils/auth-options';
import { prisma } from "@/utils/db";
import { UserRole, VideoData } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const user = session?.user as AuthUser;

    if (!checkRole(UserRole.Admin, user?.role)) {
        return new Response(null, {status: 403});
    }

    const reqData = await req.json() as VideoData;
    const result = await prisma.videoData.create({data: reqData});
    return NextResponse.json(result);
}