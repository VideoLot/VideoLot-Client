'use client'

import ClientGuard from '@/app/components/client-guard';
import TextEditor from '@/app/components/editors/text-editor';
import MultipartUpload from '@/app/components/multipart-upload';
import { UPLOAD_FILE_FOR_VIDEO, VIDEO } from '@/app/constants';
import { post } from '@/utils/fetch';
import { UserRole, VideoData } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

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

    const handlePreviewSelect = (e: any) => {
        const input = e.target as HTMLInputElement;
        if (!input || !input.files || input.files.length !== 1) {
            return;
        }

        previewRef.current = input.files.item(0);
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
            videoData.previewURL = '';
            const response = await post(VIDEO).withJsonBody(videoData).send();

            if (response.ok) {
                const newData = await response.json() as VideoData;
                setVideoData(newData);
            }
        }
        
        setVideoFile(video);
    }

    return (
    <div className='flex flex-col'>
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
    );
}