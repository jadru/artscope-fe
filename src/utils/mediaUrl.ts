import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

/**
 * Normalizes a media URL by prepending the storage URL if needed
 * @param url - The media URL to normalize
 * @returns The normalized URL with the storage URL prepended if needed
 */
export function normalizeMediaUrl(url: string | undefined | null): string {
  if (!url) {
    return '';
  }

  // If URL already starts with http:// or https://, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, prepend the media storage URL
  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${NEXT_PUBLIC_MEDIA_STORAGE_URL}/${cleanUrl}`;
}

/**
 * Normalizes an array of media URLs
 * @param urls - Array of media URLs to normalize
 * @returns Array of normalized URLs
 */
export function normalizeMediaUrls(
  urls: string[] | undefined | null
): string[] {
  if (!urls || !Array.isArray(urls)) {
    return [];
  }

  return urls.map((url) => normalizeMediaUrl(url)).filter(Boolean);
}
