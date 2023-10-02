import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const tiers = await prisma.subscribtionTier.findMany();
    return NextResponse.json(tiers);
}