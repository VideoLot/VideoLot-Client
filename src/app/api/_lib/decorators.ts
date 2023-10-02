import { AuthUser } from '@/app/types';
import { authOptions } from '@/utils/auth-options';
import { checkRole } from '@/utils/auth-utils';
import { prisma } from '@/utils/db';
import { UserRole } from '@videolot/videolot-prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export function minimalRole(role: UserRole) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunc = descriptor.value as Function;
    if (!originalFunc) {
      throw new Error('Only Route Paths can be decorated by this');
    }

    descriptor.value = async (...args: []) => {
      if (args.length === 0) { 
        return; 
      }

      const session = await getServerSession(authOptions);
      const authUser = session?.user as AuthUser;
      if (!authUser || !checkRole(role, authUser.role)) {
        return new NextResponse(null, {status: 403});
      }

      return await originalFunc.apply(target, args);
    }
  };
}