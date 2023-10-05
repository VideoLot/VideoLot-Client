'use client'

import ClientGuard from '@/app/components/client-guard';
import TextEditor from '@/app/components/editors/text-editor';
import MultipartUpload from '@/app/components/multipart-upload';
import { THIS_PICK, UPLOAD_FILE_FOR_VIDEO, VIDEO } from '@/app/constants';
import { post } from '@/utils/fetch';
import { UserRole, VideoData } from '@videolot/videolot-prisma';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'

export default function VideoUpload() {

    return (<ClientGuard 
        minimalRole={UserRole.Admin}
        children={<Form/>}
        restricted={<Error/>}/>);
}

function Error() {
    return(<p>This page is available only for admin</p>);
}

function Form() {
    const createVideoUrl = new URL('api/video', process.env.NEXT_PUBLIC_API_URL);
    const [videoData, setVideoData] = useState<VideoData>();
    const videoRef = useRef<File | null>(null);
    const previewRef = useRef<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);


    const handleTitleApply = (value: string) => {
        const newVideoData = {...videoData} as VideoData;
        newVideoData.title = value;
        setVideoData(newVideoData);
    }

    const handlePreviewDescApply = (value: string) => {
        const newVideoData = {...videoData} as VideoData;
        newVideoData.alt = value;
        setVideoData(newVideoData);
    }

    const handleVideoSelect = (e: any) => {
        const input = e.target as HTMLInputElement;
        if (!input || !input.files || input.files.length !== 1) {
            return;
        }

        videoRef.current = input.files.item(0);
    }

    const handlePreviewSelect = async (e: any) => {
        const input = e.target as HTMLInputElement;
        if (!input || !input.files || input.files.length !== 1) {
            return;
        }

        const file = input.files.item(0);
        if (!file) {
            return;
        }

        previewRef.current = file;
        const formData = new FormData()
        formData.append('file', file);

        try {
            const response = await post(THIS_PICK(file.name)).withFormData(formData).send();
            if (response.ok) {
                const uploadInfo = await response.json();
                const newData = {...videoData} as VideoData;
                newData.previewURL = uploadInfo.address;
                setVideoData(newData);
            }
        } catch (e) {
            console.log('ZHOPA HAPPENS', e);
        }
        
    }

    const handleUpload = async () => {
        if(!videoData) {
            return;
        }

        const video = videoRef.current;
        if (!video) {
            return;
        }

        const preview = previewRef.current;
        if (!preview) {
            return;
        }

        if (!videoData.id) {
            videoData.views = 0;
            videoData.uploadedDate = new Date();
            videoData.alt = videoData.alt || '';
            const response = await post(VIDEO).withJsonBody(videoData).send();

            if (response.ok) {
                const newData = await response.json() as VideoData;
                setVideoData(newData);
            }
        }
        
        setVideoFile(video);
    }

    return (
    <div className='flex items-center flex-col'>
        <div className='relative flex flex-col w-full md:w-2/3'>
            <div className='relative flex w-full aspect-video'>
                <Image fill 
                    src={videoData? videoData.previewURL : '/placeholder.png'} 
                    alt={videoData ? videoData.alt : ''}></Image>
            </div>
            <TextEditor placeholder='Enter video title' text={videoData?.title} apply={handleTitleApply}></TextEditor>
            <label>Select video file:</label>
            <MultipartUpload uploadPath={UPLOAD_FILE_FOR_VIDEO(videoData?.id)} chunkSize={1024 * 1024 * 2} files={videoFile ? [videoFile]: undefined}>
                <input onChange={handleVideoSelect} type='file' accept='.mp4,.mov,.avi,.webm'></input>
            </MultipartUpload>
            
            <label>Select preview image</label>
            <input onChange={handlePreviewSelect} type='file' accept='.jpeg,.jpg,.png'></input>
            <TextEditor placeholder='Enter preview description' text={videoData?.alt} apply={handlePreviewDescApply}></TextEditor>        
            <button onClick={handleUpload} className='h-8 bg-blue-600 text-gray-200 rounded-md'>UPLOAD</button>
        </div>
    </div>
    );
}