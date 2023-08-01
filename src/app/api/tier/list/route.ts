import { prisma } from '@/utils/db'
import { updateHeaders } from '@/utils/http';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const tiers = await prisma.subscribtionTier.findMany();
    const headers = updateHeaders(req.headers);
    return NextResponse.json(tiers, {headers});
}