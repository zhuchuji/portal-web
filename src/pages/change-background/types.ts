export interface ImageInfo {
  mimeType: string;
  data: string;
}

export interface ExtractApiResponseData {
  blended_images: string[];
  masks: string[];
  images: string[];
}