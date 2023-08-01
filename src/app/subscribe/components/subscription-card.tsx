import { SubscribtionTier } from "@prisma/client";

interface SubscriptionCardProps {
    children: React.ReactNode
}

export default function SubscriptionCard(props: SubscriptionCardProps) {
    return (<div className='w-full min-h-30vh md:w-1/4 bg-slate-300 rounded-md hover:shadow-md'>{props.children}</div>);
}