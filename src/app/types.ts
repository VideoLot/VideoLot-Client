import { SubscribtionTier, TrackInfo, UserRole, VideoData, VideoTrack } from '@prisma/client';

export interface VideoPreview {
    title: string
    preview: string
    alt: string
    views: number
    date: Date
}

export type PanelProps = {
    tags: [string],
    title: string
}

export type ViewProps = {
    view: string
}

export enum ArrowDirection {
    Up,
    Right,
    Down,
    Left
}

export interface PlayerData {
    id: string
    previewURL: string
    videoTrack: {
        trackInfo: {
            segmentsCount: number
            duration: number
            codec: string
            quality: string
        }
    }
    avaliableForTiers: [SubscribtionTier]
}

export interface SegmentRequestBody {
    video: string
    quality: string
    segment: number
    contentType: string
    track?: string
}

export interface LayoutBase {
    class: string[]
    childs: LayoutBase[]
}

export type VideoDataSequence = Array<ArrayBuffer>; 

export type AuthUser = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    role: UserRole;
}

export type VideoTrackExtended = VideoTrack & {
    trackInfo: TrackInfo
}

export type VideoDataExtended = VideoData & {
    avaliableForTiers: [SubscribtionTier],
    videoData?: VideoTrackExtended
};