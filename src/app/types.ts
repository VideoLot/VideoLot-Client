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

export enum PanelFilterType {
    List,
    Categories
}

export interface CategoryFilter {
    id: string
    not: boolean
}

export interface PanelRequestVariant {
    categories: CategoryFilter[]
    isStrict: boolean
}

export interface PanelContentData {
    type: PanelFilterType
    filter: PanelRequestVariant[] | string[]
}

export interface NameValue {
    name: string
    value: string
}

export interface PageOfVideos {
    totalVideos: number
    videos: VideoData[]
}