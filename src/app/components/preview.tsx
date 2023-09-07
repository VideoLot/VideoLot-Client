import Image from 'next/image'
import { VideoData } from '@videolot/videolot-prisma';
import Link from 'next/link';

type VideoPreviewProps = {
    previewData: VideoData
}

export default function Preview(props: VideoPreviewProps) {
    return (
        <div className='flex flex-col flex-0 w-11/12 md:w-80 bg-slate-50 rounded-md p-2 hover:shadow-md'>
            <Link href={`/video/${props.previewData.id}`}>
                <div className='w-full aspect-video relative'>
                {/* width={720} height={320}  */}
                    <Image src={props.previewData.previewURL} alt={props.previewData.alt} fill className='object-contain'></Image>   
                </div>
                <div className='inline-block w-full'>
                    <div className='md:text-base text-sm'>
                        <p>{props.previewData.title}</p>
                    </div>
                    <div className='flex flex-0 flow-horizontal font-extralight text-xs md:text-sm'>
                        <p className='block'>{props.previewData.views.toString()} views</p>
                        <p> • </p>
                        <p>{props.previewData.uploadedDate.toLocaleDateString()}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}