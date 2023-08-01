import { prisma } from '@/utils/db';
import SubscriptionCard from './components/subscription-card';
import TierContent from './components/tier-content';
import AddSubscription from './components/add-subscribtion-content';
import { getServerSession } from 'next-auth';
import { AuthUser } from '../types';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/utils/auth-options';

export default async function Subscription() {
    const tiers = await prisma.subscribtionTier.findMany();
    const session = await getServerSession(authOptions);
    const authUser = session?.user as AuthUser;

    const isAdmin = authUser && authUser.role === UserRole.Admin;
    return (
        <div className='flex flex-row space-x-3 p-3'>
            {tiers?.map(t => <SubscriptionCard key={t.id}>
                                <TierContent tier={t}/>
                            </SubscriptionCard>)}
            {isAdmin? 
                <SubscriptionCard>
                    <AddSubscription></AddSubscription>
                </SubscriptionCard> 
            : null}
            
        </div>
    );
}