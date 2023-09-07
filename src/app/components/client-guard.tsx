'use client'

import { UserRole } from '@videolot/videolot-prisma';
import { useSession } from 'next-auth/react';
import React from 'react';
import { AuthUser } from '../types';
import { checkRole } from '@/utils/auth-utils';

export interface GuardProps {
    minimalRole?: UserRole
    allowed: React.ReactNode
    restricted: React.ReactNode
}


export default function ClientGuard(props: GuardProps) {
    const {data} = useSession();
    const user = data?.user as AuthUser;

    const isAllowed = checkRole(props.minimalRole, user?.role);

    return (
    <>
        {isAllowed ? 
            props.allowed : 
            props.restricted}   
    </>);
}