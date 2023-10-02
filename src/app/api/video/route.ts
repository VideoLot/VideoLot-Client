import { prisma } from "@/utils/db";
import { UserRole, VideoData } from "@videolot/videolot-prisma";
import { NextResponse } from "next/server";
import { minimalRole } from '../_lib/decorators';

class ViVideoRoute {
    @minimalRole(UserRole.Admin)
    async POST(req: Request) {
        const reqData = await req.json() as VideoData;
        const result = await prisma.videoData.create({
            data: reqData
        });
        return NextResponse.json(result);
    }
}

const route = new ViVideoRoute();
export const POST = route.POST;