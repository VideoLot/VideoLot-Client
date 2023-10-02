import { prisma } from '@/utils/db';
import { updateHeaders } from '@/utils/http';
import { SubscribtionTier, UserRole } from '@videolot/videolot-prisma';
import { NextResponse } from 'next/server';
import { minimalRole } from '../_lib/decorators';

class ViTierRoute {
    @minimalRole(UserRole.Admin)
    async POST (req: Request) {
        const data = await req.json() as SubscribtionTier;
        const result = await prisma.subscribtionTier.create({data});
        
        return NextResponse.json(result);
    }
    
    @minimalRole(UserRole.Admin)
    async DELETE(req: Request) {
        const data = await req.json();
    
        await prisma.subscribtionTier.delete({
            where: {id: data.id}
        })
        return new Response(null, {status: 200});
    }
}

const route = new ViTierRoute();

export const POST = route.POST;
export const DELETE = route.DELETE;


