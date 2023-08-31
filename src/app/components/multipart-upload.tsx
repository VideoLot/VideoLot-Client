'use client'

import { useEffect, useState } from "react"
import { UPLOAD_FILE_FOR_VIDEO } from "../constants"
import { post } from "@/utils/fetch"

export interface IMultipartUploadProps {
    children: React.ReactNode
    uploadPath: string
    chunkSize: number
    files?: File[]
}

export default function MultipartUpload( {children, uploadPath, chunkSize, files}: IMultipartUploadProps) {
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
    const [currentChunk, setCurrentChunk] = useState<number | null>(null);

    useEffect(() => {
        if (!files) {
            setCurrentFileIndex(null);
        } else {
            setCurrentFileIndex(0);
        }
    }, [files]);

    useEffect(() => {
        if (!files || currentFileIndex === null) {
            setCurrentChunk(null);
            return;
        }

        setCurrentChunk(0);
    }, [currentFileIndex]);

    useEffect(() => {
        if (currentChunk === null || !files || currentFileIndex === null) {
            return;
        }

        readAndUploadCurrentChunk();
    }, [currentChunk]);

    async function readAndUploadCurrentChunk() {
        if (!files || currentFileIndex === null || currentChunk === null) {
            return;
        }

        const reader = new FileReader();
        const file = files[currentFileIndex];
        if (!file) {
          return;
        }
        const from = currentChunk * chunkSize;
        const to = from + chunkSize;
        const blob = file.slice(from, to);
        reader.onload = e => uploadChunk(e);
        reader.readAsDataURL(blob);
      }
    
    async function uploadChunk(readerEvent: ProgressEvent<FileReader>) {
        if (!files || 
            currentFileIndex === null || 
            currentChunk === null || 
            !readerEvent.target) {
            return;
        }

        const file = files[currentFileIndex];
        const data = readerEvent.target.result;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const response = await post(uploadPath)
            .withOctetBody(data as string | ArrayBuffer)
            .withParams(
                { name: 'name', value: file.name},
                { name: 'size', value: file.size.toString()},
                { name: 'currentChunkIndex', value: currentChunk.toString()},
                { name: 'totalChunks', value: totalChunks.toString()},
            )
            .withHeader('Content-Type', 'application/octet-stream')
            .send();
        if (response.ok) {
            const lastChunkIndex = totalChunks - 1;
            if (currentChunk === lastChunkIndex) {
                const newFileIndex = currentFileIndex + 1;
                if (newFileIndex < files.length) {
                    setCurrentFileIndex(newFileIndex);
                } else {
                    setCurrentFileIndex(null);
                }
                
                setCurrentChunk(null);
            } else {
                setCurrentChunk(currentChunk + 1);
            }
        } else {
            console.warn('FILE UPLOAD FAILED: ', file.name, currentChunk, 'of', totalChunks);
            setCurrentFileIndex(null);
            
        }
      }

    return <>
        {children}
    </>
}