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

export type ViewParams = {
    view: string
}

export enum ArrowDirection {
    Up,
    Right,
    Down,
    Left
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