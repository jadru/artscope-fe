import { normalizeMediaUrl, normalizeMediaUrls } from '../mediaUrl';

// Mock the environment variable
jest.mock('@/constant/env', () => ({
  NEXT_PUBLIC_MEDIA_STORAGE_URL: 'https://media.example.com',
}));

describe('mediaUrl utilities', () => {
  describe('normalizeMediaUrl', () => {
    it('should prepend storage URL to relative paths', () => {
      expect(normalizeMediaUrl('images/photo.jpg')).toBe(
        'https://media.example.com/images/photo.jpg'
      );
    });

    it('should prepend storage URL and remove leading slash', () => {
      expect(normalizeMediaUrl('/images/photo.jpg')).toBe(
        'https://media.example.com/images/photo.jpg'
      );
    });

    it('should not modify URLs starting with http://', () => {
      const url = 'http://external.com/image.jpg';
      expect(normalizeMediaUrl(url)).toBe(url);
    });

    it('should not modify URLs starting with https://', () => {
      const url = 'https://external.com/image.jpg';
      expect(normalizeMediaUrl(url)).toBe(url);
    });

    it('should handle null or undefined', () => {
      expect(normalizeMediaUrl(null)).toBe('');
      expect(normalizeMediaUrl(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(normalizeMediaUrl('')).toBe('');
    });
  });

  describe('normalizeMediaUrls', () => {
    it('should normalize an array of URLs', () => {
      const urls = [
        'images/photo1.jpg',
        'https://external.com/photo2.jpg',
        '/images/photo3.jpg',
      ];

      const expected = [
        'https://media.example.com/images/photo1.jpg',
        'https://external.com/photo2.jpg',
        'https://media.example.com/images/photo3.jpg',
      ];

      expect(normalizeMediaUrls(urls)).toEqual(expected);
    });

    it('should handle null or undefined', () => {
      expect(normalizeMediaUrls(null)).toEqual([]);
      expect(normalizeMediaUrls(undefined)).toEqual([]);
    });

    it('should handle empty array', () => {
      expect(normalizeMediaUrls([])).toEqual([]);
    });

    it('should filter out empty strings', () => {
      const urls = ['images/photo1.jpg', '', 'images/photo2.jpg'];
      const result = normalizeMediaUrls(urls);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        'https://media.example.com/images/photo1.jpg',
        'https://media.example.com/images/photo2.jpg',
      ]);
    });
  });
});
