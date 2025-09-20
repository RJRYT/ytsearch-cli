export interface GlobalOptions {
  limit?: number;
  sort?: 'relevance' | 'upload_date' | 'view_count' | 'rating';
  json?: boolean;
}

export interface SearchCommandOptions extends GlobalOptions {
  type?: 'video' | 'channel' | 'playlist';
}

export interface VideoResult {
  type: 'video';
  id: string;
  title: string;
  image: string;
  thumbnail: { url: string; width: number; height: number };
  viewCount: number;
  shortViewCount: string;
  duration: string;
  seconds: number;
  author: {
    name: string;
    url: string;
    verified?: boolean;
  } | null;
  watchUrl: string;
  publishedAt: string;
}

export interface ChannelResult {
  type: 'channel';
  id: string;
  title: string;
  image: string;
  thumbnail: { url: string; width: number; height: number };
  description: string;
  subscriberCount: string;
  url: string;
  verified: boolean;
  isArtist: boolean;
}

export interface PlaylistResult {
  type: 'playlist';
  contentType: string;
  id: string;
  title: string;
  image: string;
  thumbnail: { url: string; width: number; height: number };
  videoCount: number;
  author: {
    name: string;
    url: string;
    verified?: boolean;
    isArtist?: boolean;
  } | null;
  url: string;
}

export type SearchResult = VideoResult | ChannelResult | PlaylistResult;