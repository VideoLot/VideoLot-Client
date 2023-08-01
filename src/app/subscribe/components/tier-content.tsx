import { SubscribtionTier } from "@prisma/client";
import ActivityButton from "./button";


export default function TierContent({tier}:{tier: SubscribtionTier}) {
    return (
        <div className='flex flex-col w-full h-full p-2 items-center justify-between'>
            <h1>{tier.name}</h1>
            <div>{tier.description}</div>
            <div>{tier.durationDays} days</div>
            <div>{tier.cost}</div>
            <ActivityButton objectId={tier.id}></ActivityButton>
        </div>
    );
}  