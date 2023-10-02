import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const result = await prisma.category.findMany();
    return NextResponse.json(result);
}