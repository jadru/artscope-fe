# 예술가 포트폴리오 + 프로필 페이지 개선 완료

## 📋 구현 개요

Artscope의 작가 프로필 페이지를 "예술가 포트폴리오 + 프로필 페이지"로 완전히 재구성했습니다.

## 🎯 주요 개선사항

### 1. **Hero Section (Key Visual)**

- 대표작 이미지 슬라이더 (최대 3개)
- Parallax 스크롤 효과
- 작가명 대형 타이포그래피
- 태그라인 (한 줄 소개)
- SNS/Website 링크 버튼

### 2. **Featured Portfolio Grid**

- 최신 작품 6개 그리드 표시
- 프로젝트 카드:
  - 대표 이미지
  - 작품 제목 및 연도
  - 시리즈명, 매체, 크기
  - Hover 시 Zoom-in 애니메이션
  - 조회수/좋아요 통계

### 3. **About Section**

- 작가 소개 (introduction)
- 자동 추출된 키워드 태그
- 4단계 블록 구조

### 4. **History Timeline (단순 텍스트 기반)**

- 사용자 입력 그대로 시각화
- 섹션 헤더 자동 감지 (개인전, 단체전 등)
- 연도 자동 파싱 및 배지 표시
- 타임라인 형태 UI

### 5. **All Works Section**

- 전체 작품 그리드
- 페이지네이션
- 로딩/에러/빈 상태 처리

### 6. **External Links Section**

- Website 프리뷰 카드
- Instagram 프리뷰 카드

---

## 📁 생성된 컴포넌트

### `/src/app/(main)/profile/[id]/components/`

```
├── HeroArtist.tsx               # Hero 섹션 (Key Visual + Parallax)
├── ProjectCard.tsx              # 작품 카드
├── FeaturedPortfolioGrid.tsx    # Featured 작품 그리드
├── ArtistAboutSection.tsx       # About 섹션
├── ArtistKeywords.tsx           # 키워드 태그
├── ArtistLongBio.tsx            # 긴 소개 (접기/펼치기)
├── HistoryTimeline.tsx          # 이력 타임라인 (단순 텍스트 기반)
├── ExternalLinksSection.tsx     # 외부 링크 섹션
├── PreviewCard.tsx              # 링크 프리뷰 카드
└── AllWorksSection.tsx          # 전체 작품 섹션
```

---

## 🗂 타입 확장

### `/src/types/article.ts`

```typescript
export type PortfolioProjectType = articleItemType & {
  shortDescription?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  isFeatured?: boolean;
  series?: string;
};
```

### `/src/types/profile.ts`

- Exhibition 관련 복잡한 타입 제거
- 단순 텍스트 기반 history 사용

---

## 🎨 UI/UX 특징

### 디자인 시스템

- **색상**: 무채색 기반 + 작품 색채 강조
- **타이포그래피**: Pretendard 폰트, 큰 사이즈의 가벼운 웨이트
- **여백**: 넉넉한 화이트 스페이스
- **애니메이션**:
  - Subtle hover effects (zoom, fade)
  - Parallax scrolling
  - Smooth transitions

### 반응형 구조

- **모바일**: 단일 컬럼, 스택 레이아웃
- **태블릿**: 2컬럼 그리드
- **데스크톱**: 3컬럼 그리드, 넓은 여백

### 접근성

- 시맨틱 HTML 태그 사용
- ARIA 레이블 제공
- 키보드 네비게이션 지원
- 로딩/에러 상태 명확한 표시

---

## 📊 History 입력 형식

사용자는 다음과 같이 단순 텍스트로 이력을 입력합니다:

```
개인전
2023, <A small robot's journey>, 키노쇼 키카쿠 갤러리, 일본 도쿄
2021, <비와 풀의 이야기>, 아트스페이스 128, 한국 대전

단체전
2024, <Contemporary Art Now>, 국립현대미술관, 한국 서울
2022, <Asian Art Fair>, COEX, 한국 서울

수상
2023, Best Young Artist Award, 한국예술진흥원
```

### 자동 파싱 기능

- **섹션 헤더**: "개인전", "단체전", "레지던시", "수상" 등 자동 감지
- **연도**: 줄 앞의 4자리 숫자 (2023, 2021-2022 등)
- **나머지**: 전시명, 장소 등으로 표시

---

## 🔄 페이지 구조 (IA)

```
1. Hero Section
   └─ Key Visual (대표작 슬라이더)
   └─ 작가명 + 태그라인
   └─ SNS/Website 버튼

2. Featured Works (최신 6개)
   └─ 프로젝트 카드 그리드
   └─ "View All Works" 버튼

3. About
   └─ 작가 소개
   └─ 키워드 태그
   └─ 긴 소개 (선택적)

4. Exhibition & Career (History)
   └─ 타임라인 UI
   └─ 섹션별 그룹핑

5. All Works
   └─ 전체 작품 그리드
   └─ 페이지네이션

6. Connect
   └─ Website 프리뷰
   └─ Instagram 프리뷰
```

---

## 🚀 사용 방법

### 1. 기존 프로필 데이터와 호환

기존 `profileApiType`의 모든 필드를 그대로 사용합니다:

- `name`: 작가명
- `introduction`: 태그라인 및 짧은 소개
- `history`: 이력 (텍스트)
- `picture`: 프로필 이미지 (Hero 백업용)
- `snsUrl`, `websiteUrl`: 외부 링크

### 2. 작품 데이터

- API `/api/server/magazines/members/{username}`에서 자동으로 가져옴
- 최신 6개는 Featured Works로 표시
- 나머지는 All Works 섹션에서 페이지네이션

### 3. 키워드 자동 추출

`introduction` 텍스트에서 다음 키워드를 자동 감지:

- 설치, 영상, 사진, 회화, 조각, 미디어, 퍼포먼스, 드로잉

---

## 🎭 예시 화면 플로우

```
┌─────────────────────────────────────┐
│   Hero (Full Height)                │
│   [대표작 이미지 배경]              │
│   김예술                            │
│   침묵과 소음 사이의 예술           │
│   [Website] [Instagram]             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Featured Works                    │
│   ┌───┐ ┌───┐ ┌───┐                │
│   │ 1 │ │ 2 │ │ 3 │                │
│   └───┘ └───┘ └───┘                │
│   ┌───┐ ┌───┐ ┌───┐                │
│   │ 4 │ │ 5 │ │ 6 │                │
│   └───┘ └───┘ └───┘                │
│        [View All Works]             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   About                             │
│   소개: ...                         │
│   키워드: [설치] [영상] [사운드]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Exhibition & Career               │
│   ━━━ 개인전 ━━━━━━━━━━━━━━━━━     │
│   ● 2023 <전시명>, 갤러리, 장소    │
│   ● 2021 ...                        │
│   ━━━ 단체전 ━━━━━━━━━━━━━━━━━     │
│   ● 2024 ...                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   All Works                         │
│   [전체 작품 그리드 + 페이지네이션]│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Connect                           │
│   [Website 카드] [Instagram 카드]  │
└─────────────────────────────────────┘
```

---

## ✨ 특별 기능

### 1. Parallax Scroll

Hero 섹션의 이미지가 스크롤에 따라 느리게 움직이는 효과

### 2. Image Slider

Featured 이미지가 5초마다 자동 전환 (최대 3개)

### 3. Hover Effects

- 작품 카드: 이미지 zoom-in + 설명 fade-in
- 버튼: 색상 전환 애니메이션

### 4. Expandable Bio

긴 소개문이 있을 경우 "더 보기/접기" 기능

### 5. Responsive Timeline

모바일에서도 가독성 높은 타임라인 UI

---

## 📱 반응형 브레이크포인트

```css
/* 모바일 */
@media (max-width: 640px) {
  - 1컬럼 레이아웃
  - 작은 타이포그래피
  - 스택형 네비게이션
}

/* 태블릿 */
@media (min-width: 641px) and (max-width: 1024px) {
  - 2컬럼 그리드
  - 중간 타이포그래피
}

/* 데스크톱 */
@media (min-width: 1025px) {
  - 3컬럼 그리드
  - 큰 타이포그래피
  - 넓은 여백
}
```

---

## 🎨 Tailwind 스타일 패턴

### 색상

- 배경: `bg-white`, `bg-gray-50`
- 텍스트: `text-gray-900`, `text-gray-700`, `text-gray-600`
- 경계: `border-gray-200`, `border-gray-300`

### 타이포그래피

- Hero: `text-7xl` ~ `text-8xl`
- 제목: `text-4xl` ~ `text-5xl`
- 본문: `text-base` ~ `text-lg`
- 캡션: `text-sm` ~ `text-xs`
- 폰트 웨이트: `font-light` (대부분)

### 간격

- 섹션: `py-16 md:py-20 lg:py-24`
- 요소: `gap-6`, `gap-8`, `gap-12`
- 여백: `px-6 lg:px-8`

---

## 🔧 향후 확장 가능성

### 백엔드 추가 필드 (선택사항)

```typescript
{
  tagline: string;           // 한 줄 태그라인
  keywords: string[];        // 키워드 배열
  featuredWorkIds: number[]; // 대표작 ID
  longBio: string;           // 긴 소개
}
```

현재는 기존 필드로부터 자동 생성하지만, 향후 별도 필드로 관리 가능

---

## ✅ 완료된 작업

- [x] 타입 정의 확장
- [x] HeroArtist 컴포넌트
- [x] ProjectCard & FeaturedPortfolioGrid
- [x] ArtistAboutSection 관련 컴포넌트들
- [x] HistoryTimeline (단순 텍스트 기반)
- [x] ExternalLinksSection & PreviewCard
- [x] AllWorksSection
- [x] 메인 페이지 재구성
- [x] 반응형 구현
- [x] 접근성 최적화
- [x] 린터 에러 수정

---

## 🎉 결과

**예술가 중심의 고급스러운 포트폴리오 프로필 페이지**가 완성되었습니다!

- ✨ 작품이 돋보이는 비주얼 중심 디자인
- 🎨 갤러리 느낌의 세련된 레이아웃
- 📱 완벽한 반응형 구조
- ♿️ 접근성 준수
- 🚀 성능 최적화 (이미지 lazy loading, code splitting)
- 💡 직관적인 UX (hover effects, smooth scrolling)

모든 컴포넌트는 Artscope 디자인 시스템을 따르며, 기존 API와 완벽하게 호환됩니다.
