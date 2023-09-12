import { prisma } from '@/utils/db';
import { updateHeaders } from '@/utils/http';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const headers = updateHeaders(req.headers);
    const result = await prisma.category.findMany();
    return NextResponse.json(result, {headers});
}