# 좋아요 기능 구현 가이드

## 개요

ArtScope의 좋아요 기능은 낙관적 업데이트(Optimistic Updates)와 React Query를 활용한 전역 상태 동기화를 통해 빠르고 일관된 사용자 경험을 제공합니다.

## 핵심 기능

### ✅ 구현된 기능

1. **낙관적 UI 업데이트**
   - 클릭 즉시 UI 반영 (서버 응답 대기 없음)
   - 서버 요청 실패 시 자동 롤백
   - 서버 응답으로 최종 동기화

2. **내가 좋아요한 게시물 표시**
   - 백엔드 `isLiked` 필드 활용
   - 페이지 새로고침 후에도 상태 유지
   - 빨간 하트로 시각적 표시

3. **전역 상태 동기화**
   - React Query 캐시 무효화
   - 여러 컴포넌트 간 상태 동기화
   - 백그라운드 리페치 방지 (낙관적 업데이트 유지)

4. **로그인 체크**
   - 비로그인 사용자는 로그인 페이지로 리다이렉트
   - 중복 요청 방지 (isLoading 상태)

5. **접근성**
   - `aria-label`, `aria-pressed` 속성
   - 키보드 내비게이션 지원

## 아키텍처

### 1. 타입 정의

```typescript
// src/types/article.ts
export type articleItemType = {
  id: number;
  title: string;
  likes: number;
  isLiked: boolean;  // ⬅️ 백엔드에서 제공
  // ...
};
```

### 2. 커스텀 훅: `useLike`

**위치:** `src/hooks/useLike.ts`

**기능:**
- 낙관적 업데이트 로직
- API 호출 및 에러 처리
- React Query 캐시 무효화
- 로그인 체크

**사용법:**

```tsx
import { useLike } from "@/hooks/useLike";

function MyComponent({ article }) {
  const { isLiked, likes, toggleLike, isLoading } = useLike({
    articleId: article.id,
    initialLikes: article.likes,
    initialIsLiked: article.isLiked,
    onSuccess: (newLikes, isLiked) => {
      console.log("좋아요 성공!", newLikes, isLiked);
    },
    onError: (error) => {
      console.error("좋아요 실패", error);
    },
  });

  return (
    <button onClick={toggleLike} disabled={isLoading}>
      <Heart className={isLiked ? "fill-red-500" : ""} />
      <span>{likes}</span>
    </button>
  );
}
```

**파라미터:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| `articleId` | `number` | ✅ | 게시물 ID |
| `initialLikes` | `number` | ✅ | 초기 좋아요 수 |
| `initialIsLiked` | `boolean` | ✅ | 초기 좋아요 상태 |
| `onSuccess` | `(likes, isLiked) => void` | ❌ | 성공 콜백 |
| `onError` | `(error) => void` | ❌ | 에러 콜백 |

**반환값:**

| 반환값 | 타입 | 설명 |
|-------|------|------|
| `isLiked` | `boolean` | 현재 좋아요 상태 |
| `likes` | `number` | 현재 좋아요 수 |
| `toggleLike` | `(e?) => Promise<void>` | 좋아요 토글 함수 |
| `isLoading` | `boolean` | 로딩 상태 |

### 3. API 엔드포인트

**Like (좋아요):**
```
POST /api/server/magazines/{magazineId}/like
```

**Unlike (좋아요 취소):**
```
POST /api/server/magazines/{magazineId}/unlike
```

**응답 형식:**
```json
{
  "likes": 42,
  "isLiked": true
}
```

### 4. 사용 중인 컴포넌트

| 컴포넌트 | 위치 | 상태 |
|---------|------|------|
| `ArticleCardWithActions` | `src/components/Discovery/ArticleCardWithActions.tsx` | ✅ 완전 구현 |
| `GalleryCard` | `src/app/(main)/gallery/components/GalleryCard.tsx` | ✅ 완전 구현 |

## 동작 흐름

### 좋아요 클릭 시 시퀀스

```
1. 사용자 클릭
   ↓
2. 로그인 체크 (없으면 /user/login으로 리다이렉트)
   ↓
3. Optimistic Update
   - isLiked 토글
   - likes 카운트 +1 또는 -1
   - UI 즉시 반영
   ↓
4. API 호출
   - POST /api/server/magazines/{id}/like (또는 unlike)
   ↓
5-A. 성공 케이스
   - 서버 응답으로 likes, isLiked 동기화
   - React Query 캐시 무효화 (다른 컴포넌트 동기화)
   - onSuccess 콜백 호출
   ↓
5-B. 실패 케이스
   - 이전 상태로 롤백
   - onError 콜백 호출
   - 콘솔 에러 로그
```

## UX 고려사항

### 1. 낙관적 업데이트 이유
- **즉각적인 피드백**: 네트워크 지연 없이 사용자에게 즉시 반응
- **자연스러운 느낌**: 앱이 빠르게 느껴짐
- **에러는 드뭄**: 좋아요는 보통 성공하므로 낙관적 접근이 합리적

### 2. 에러 처리
- 네트워크 오류, 서버 오류 시 자동 롤백
- 사용자는 이전 상태로 돌아감
- 콘솔에 에러 로그 (필요시 토스트 알림 추가 가능)

### 3. 로그인 필수
- 좋아요는 인증된 사용자만 가능
- 비로그인 사용자는 로그인 페이지로 이동

### 4. 중복 요청 방지
- `isLoading` 상태로 중복 클릭 방지
- API 호출 중에는 버튼 비활성화 가능

## React Query 통합

### 캐시 무효화 전략

```typescript
// useLike.ts 내부
queryClient.invalidateQueries({
  queryKey: ["articles"],
  refetchType: "none",  // ⬅️ 중요!
});
```

**`refetchType: "none"` 이유:**
- 낙관적 업데이트를 유지
- 백그라운드 리페치로 UI가 다시 바뀌는 것 방지
- 다음 페이지 네비게이션 시 자동으로 최신 데이터 가져옴

## 디자인 가이드라인

### 좋아요 버튼 스타일

**Discovery Feed (`ArticleCardWithActions`):**
```tsx
<button className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100">
  <Heart className={isLiked ? "fill-red-500 text-red-500" : "text-gray-700"} />
</button>
```

**Gallery (`GalleryCard`):**
```tsx
<button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
  <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />
  <span className={isLiked ? "text-red-500" : ""}>{likes}</span>
</button>
```

### 색상

- **좋아요 상태**: `#E74C3C` (red-500)
- **기본 상태**: `#6B7280` (gray-500)
- **호버 상태**: `#111827` (gray-900)

## 테스트 시나리오

### 1. 정상 동작 테스트
- [ ] 좋아요 클릭 시 하트가 빨간색으로 변함
- [ ] 좋아요 수가 +1 증가
- [ ] 다시 클릭 시 하트가 빈 하트로 변함
- [ ] 좋아요 수가 -1 감소

### 2. 로그인 테스트
- [ ] 비로그인 상태에서 클릭 시 /user/login으로 리다이렉트

### 3. 에러 핸들링 테스트
- [ ] 네트워크 끊김 시 이전 상태로 롤백
- [ ] 서버 에러 시 이전 상태로 롤백

### 4. 동기화 테스트
- [ ] Discovery 피드에서 좋아요 → 같은 게시물 다른 카드에도 반영
- [ ] 페이지 새로고침 후에도 좋아요 상태 유지

### 5. 접근성 테스트
- [ ] 키보드 Tab으로 포커스 가능
- [ ] Enter 키로 좋아요 토글 가능
- [ ] 스크린 리더로 aria-label 읽힘

## 향후 개선 사항

### 1. Article 상세 페이지에 좋아요 추가
```tsx
// src/app/(main)/(viewer)/article/[id]/page.tsx
// TODO: 좋아요 버튼 추가
```

### 2. 좋아요 애니메이션
```tsx
// Heart 클릭 시 bounce 애니메이션
className="transition-transform hover:scale-110 active:scale-95"
```

### 3. 좋아요한 사용자 목록
```tsx
// 좋아요 수 클릭 시 좋아요한 사용자 목록 모달
<button onClick={showLikedUsers}>{likes} likes</button>
```

### 4. 에러 토스트 알림
```tsx
import { toast } from "sonner";

onError: () => {
  toast.error("좋아요에 실패했습니다. 다시 시도해주세요.");
}
```

### 5. 좋아요 통계
- 사용자별 좋아요한 게시물 목록
- 가장 많은 좋아요를 받은 게시물

## 문제 해결

### Q: 좋아요가 다른 컴포넌트에 반영되지 않아요
A: React Query의 `queryKey`가 일치하는지 확인하세요. 모든 article 관련 쿼리는 `["articles"]` 키를 사용해야 합니다.

### Q: 페이지 새로고침 후 좋아요 상태가 초기화돼요
A: 백엔드 API가 `isLiked` 필드를 응답에 포함하는지 확인하세요. 프론트엔드는 `article.isLiked`를 `initialIsLiked`로 전달합니다.

### Q: 좋아요 수가 서버와 맞지 않아요
A: API 응답의 `likes` 필드로 최종 동기화되므로, 일시적인 불일치는 정상입니다. 서버 응답 후 자동으로 수정됩니다.

### Q: 로그인 후 자동으로 좋아요되게 하고 싶어요
A: 로그인 후 이전 페이지로 돌아올 때 상태를 저장해야 합니다. `localStorage`나 URL 파라미터를 활용할 수 있습니다.

## 참고 자료

- [Optimistic Updates - TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [React Aria - Button](https://react-spectrum.adobe.com/react-aria/Button.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
