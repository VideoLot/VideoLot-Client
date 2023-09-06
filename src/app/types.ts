import { SubscribtionTier, TrackInfo, UserRole, VideoData, VideoTrack } from '@videolot/videolot-prisma';

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

export type PlayerData = VideoData & {
    videoTrack: {
        trackInfo: TrackInfo
    }
    audioTracks: [{trackInfo: TrackInfo}]
    avaliableForTiers: SubscribtionTier[]
}

export interface SegmentRequestBody {
    trackId: string
    segment: number
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

export enum PanelContentType {
    List,
    Request
}

export interface PanelRequestVariant {
    include: string[]
    exclude: string[]
    isStrict: boolean
}

export interface PanelContentData {
    type: PanelContentType
    content: PanelRequestVariant[] | string[]
}