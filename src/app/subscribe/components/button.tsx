'use client'

import { AuthUser } from '@/app/types';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';

interface ButtonProp {
    objectId: string
}

export default function ActivityButton(props: ButtonProp) {
    const removeUrl = new URL('/api/tier', process.env.NEXT_PUBLIC_API_URL);
    const session = useSession();
    const router = useRouter();

    let state: string | null;
    const user = session?.data?.user as AuthUser;
    if(!user) {
        state = 'Subscribe';
    } else {
        switch (user.role) {
            case UserRole.Admin:
                state = 'Delete';
                break;
            case UserRole.Moderator:
                state = null;
                break;
            case UserRole.User:
                state = 'Subscribe';
                break;
        }
    }

    const handleClick = async () => {
        if (!user) {
            router.push('/api/auth/signin');
        }
        if (user.role === 'Admin') {
            try {
                const response = await fetch(removeUrl, {
                    cache: 'no-store',
                    method: 'DELETE',
                    body: JSON.stringify({
                        id: props.objectId
                    })
                });
                if (response.ok) {
                    router.refresh();
                }
            } catch (e) {
                //TODO: Write error handler
            }
        }
    }
    
    return (
            state ? <button onClick={handleClick} className='w-4/5 bg-blue-400 rounded-lg'>{state}</button> : null     
    );
}