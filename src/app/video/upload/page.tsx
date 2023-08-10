'use client'

import ClientGuard from '@/app/components/client-guard';
import TextEditor from '@/app/components/editors/text-editor';
import { UserRole, VideoData } from '@prisma/client';
import { useRef, useState } from 'react';

export default function VideoUpload() {

    return (<ClientGuard 
        minimalRole={UserRole.Admin}
        allowed={<Form/>}
        restricted={<Error/>}/>);
}

function Error() {
    return(<p>This page is available only for admin</p>);
}

function Form() {
    const createVideoUrl = new URL('api/video', process.env.NEXT_PUBLIC_API_URL);

    const videoInputRef = useRef<HTMLInputElement>(null);
    const previewInputRef = useRef<HTMLInputElement>(null);
    const [videoData, setVideoData] = useState<VideoData>();

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

    const handleUpload = async () => {
        if(!videoData) {
            return;
        }

        const videoInput = videoInputRef.current;
        if (!videoInput || !videoInput.value) {
            return;
        }

        const previewInput = previewInputRef.current;
        if (!previewInput || !previewInput.value) {
            return;
        }

        videoData.views = 0;
        videoData.uploadedDate = new Date();
        videoData.alt = videoData.alt || '';
        videoData.previewURL = '';

        const response = await fetch(createVideoUrl, {
            method: 'POST', 
            body: JSON.stringify(videoData)
        });

        if(response.ok) {
            const newData = await response.json() as VideoData;
            setVideoData(newData);
        }
    }

    return (
    <div className='flex flex-col'>
        <TextEditor placeholder='Enter video title' text={videoData?.title} apply={handleTitleApply}></TextEditor>
        <label>Select video file:</label>
        <input ref={videoInputRef} type='file' accept='.mp4,.mov,.avi,.webm'></input>
        <label>Select preview image</label>
        <input ref={previewInputRef} type='file' accept='.jpeg,.jpg,.png'></input>
        <TextEditor placeholder='Enter preview description' text={videoData?.alt} apply={handlePreviewDescApply}></TextEditor>        
        <button onClick={handleUpload} className='h-8 bg-blue-600 text-gray-200 rounded-md'>UPLOAD</button>
    </div>
    );
}