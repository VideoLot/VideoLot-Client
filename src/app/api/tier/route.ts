import { AuthUser } from '@/app/types';
import { authOptions } from '@/utils/auth-options';
import { prisma } from '@/utils/db';
import { updateHeaders } from '@/utils/http';
import { SubscribtionTier, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

const SUCCESS_CODE = new Response(null, {status: 200});
const FORBIDDEN_CODE = new Response(null, {status: 403});

export async function POST (req: Request) {
    const session = await getServerSession(authOptions);
    console.log(session);
    const userExtended = session?.user as AuthUser;
    const headers = updateHeaders(req.headers);
    if (!userExtended || userExtended.role !== UserRole.Admin) {
        return new Response(null, {status: 403, headers});
    }

    const data = await req.json() as SubscribtionTier;
    const result = await prisma.subscribtionTier.create({data});
    
    return NextResponse.json(result, {headers});
}

export async function DELETE(req: Request) {
    const headers = updateHeaders(req.headers);
    const isPermit = await IsPermit();
    if (!isPermit) {
        return new Response(null, {status: 403, headers});
    }
    const data = await req.json();

    await prisma.subscribtionTier.delete({
        where: {id: data.id}
    })
    return new Response(null, {status: 200, headers});
}

const IsPermit = async (): Promise<boolean> => {
    const session = await getServerSession(authOptions);
    const userExtended = session?.user as AuthUser;
    if (!userExtended || userExtended.role !== UserRole.Admin) {
        return false
    }
    return true;
}


