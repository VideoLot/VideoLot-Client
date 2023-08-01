import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { AuthOptions, TokenSet } from 'next-auth';
import { prisma } from '@/utils/db';
import { User } from '@prisma/client';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            profile: profile
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST as string,
                port: process.env.EMAIL_SERVER_PORT as string,
                auth: {
                  user: process.env.EMAIL_SERVER_USER as string,
                  pass: process.env.EMAIL_SERVER_PASSWORD as string,
                },
            },
            from: process.env.EMAIL_FROM as string,
        })
    ],
    callbacks: {
        session({session, user}) {
            if (session && session.user) {
                const adoptedUser = user as any;
                const updatedUser = session.user as any; 
                updatedUser.role = adoptedUser.role;
            }         
            return session;
        }
    }
} as AuthOptions;


async function profile(profile: any, tokens: TokenSet): Promise<User> {
    return {role: profile.role ?? 'user', ...profile};
}