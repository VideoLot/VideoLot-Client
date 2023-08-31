export const SEGMENTS = 'api/segments';
export const TIER = 'api/tier';
export const TIER_LIST = 'api/tier/list';
export const VIDEO = 'api/video';
export const THIS_VIDEO = (videoId: string) => `api/video/${videoId}`;
export const VIDEOS = 'api/videos';
export const UPLOAD_FILE_FOR_VIDEO = (videoId: string | undefined) => `api/video/upload/${videoId || ''}`;
 