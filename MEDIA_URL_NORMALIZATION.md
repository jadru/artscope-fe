# Media URL 자동 정규화 기능

## 개요

Magazine 이미지 및 프로필 이미지 등에서 `mediaUrls`가 `http://` 또는 `https://`로 시작하지 않는 상대 경로일 경우, 자동으로 `NEXT_PUBLIC_MEDIA_STORAGE_URL` 환경 변수를 앞에 붙이도록 구현했습니다.

## 구현 내용

### 1. 새로운 유틸리티 함수 생성

**파일**: `src/utils/mediaUrl.ts`

두 가지 헬퍼 함수를 제공합니다:

- `normalizeMediaUrl(url: string)`: 단일 URL 정규화
- `normalizeMediaUrls(urls: string[])`: URL 배열 정규화

#### 동작 방식

```typescript
// 상대 경로 → 절대 경로로 변환
normalizeMediaUrl('images/photo.jpg')
// → 'https://media-storage-url/images/photo.jpg'

// 이미 http로 시작하는 URL은 그대로 유지
normalizeMediaUrl('https://external.com/image.jpg')
// → 'https://external.com/image.jpg'
```

### 2. Next.js Image Loader 개선

**파일**: `src/utils/imageLoader.ts`

기존 로직을 개선하여 더 명확한 조건 체크를 수행하도록 수정:

- `http://` 또는 `https://`로 시작하지 않는 경우에만 스토리지 URL 추가
- 앞에 `/`가 있는 경우 제거하여 이중 슬래시 방지

### 3. 메타데이터에서 URL 정규화

#### Article 페이지

**파일**: `src/app/(main)/article/[id]/page.tsx`

OpenGraph 이미지에 `normalizeMediaUrl()` 적용:

```typescript
openGraph: {
  images: [normalizeMediaUrl(article.mediaUrls[0]), ...previousImages],
  // ...
}
```

#### Profile 페이지

**파일**: `src/app/(main)/profile/[id]/page.tsx`

프로필 이미지에 `normalizeMediaUrl()` 적용:

```typescript
openGraph: {
  images: [normalizeMediaUrl(profile.picture), ...previousImages],
  // ...
}
```

## 사용 예시

### Image 컴포넌트 (자동 처리)

Next.js의 `<Image>` 컴포넌트는 `imageLoader`를 통해 자동으로 URL이 정규화됩니다:

```tsx
<Image
  src={article.mediaUrls[0]}  // 'images/photo.jpg'
  alt={article.title}
  fill
/>
// → 자동으로 'https://media-storage-url/images/photo.jpg'로 변환
```

### 메타데이터나 일반 URL (수동 사용)

메타데이터나 일반 URL 문자열이 필요한 경우 `normalizeMediaUrl()` 사용:

```typescript
import { normalizeMediaUrl } from '@/utils/mediaUrl';

const ogImage = normalizeMediaUrl(article.mediaUrls[0]);
```

## 테스트

**파일**: `src/utils/__tests__/mediaUrl.test.ts`

다양한 케이스를 커버하는 유닛 테스트 포함:

- 상대 경로 처리
- 절대 URL 유지
- null/undefined 처리
- 배열 처리
- 빈 문자열 필터링

## 영향받는 파일

### 수정된 파일
- `src/utils/imageLoader.ts` - Image loader 로직 개선
- `src/app/(main)/article/[id]/page.tsx` - 메타데이터 URL 정규화
- `src/app/(main)/profile/[id]/page.tsx` - 프로필 이미지 URL 정규화

### 새로 추가된 파일
- `src/utils/mediaUrl.ts` - URL 정규화 유틸리티
- `src/utils/__tests__/mediaUrl.test.ts` - 유닛 테스트

## 환경 변수

이 기능이 작동하려면 다음 환경 변수가 필요합니다:

```bash
NEXT_PUBLIC_MEDIA_STORAGE_URL=your-media-storage-domain.com
```

**참고**: `src/constant/env.ts`에서 자동으로 `https://`가 앞에 붙습니다.

## 주의사항

1. **외부 URL은 변경되지 않음**: `http://` 또는 `https://`로 시작하는 URL은 그대로 유지됩니다.
2. **슬래시 처리**: 앞에 `/`가 있든 없든 올바르게 처리됩니다.
3. **null 안전성**: null/undefined 값도 안전하게 처리됩니다.

## 향후 개선 사항

필요시 다음 기능을 추가할 수 있습니다:

- [ ] CDN URL 변환 지원
- [ ] 이미지 리사이징 파라미터 자동 추가
- [ ] WebP 포맷 자동 변환
- [ ] 썸네일 생성 지원
