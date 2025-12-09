# ArtScope AI Agent Guidelines

이 문서는 ArtScope 프로젝트에서 작업하는 AI 에이전트를 위한 가이드라인입니다.

## 프로젝트 개요

ArtScope는 예술가 커뮤니티 플랫폼으로, **고급스럽고 미니멀한 디자인**을 핵심 가치로 합니다. 모든 코드 변경은 이 디자인 철학을 반영해야 합니다.

## 디자인 시스템 핵심 원칙

### 1. 색상 사용 원칙

```
배경색:
- 페이지 배경: --background-primary (#FAFAFA)
- 섹션 배경: --background-secondary (#F5F5F5)
- 카드/컴포넌트: --background-card (#FFFFFF)

텍스트색:
- 제목/중요 텍스트: --text-primary (#1A1A1A)
- 본문: --text-secondary (#666666)
- 보조 텍스트: --text-muted (#999999)

강조:
- 버튼/강조: --accent-primary (#1A1A1A)
- 좋아요 활성: --like-active (#E74C3C)
```

**금지 사항:**
- 과도한 색상 사용 금지
- 네온/형광 색상 사용 금지
- 그라데이션 최소화 (필요시 미묘한 회색 그라데이션만)

### 2. 타이포그래피 규칙

```
크기 체계:
- Hero Title: text-4xl ~ text-5xl (36-48px)
- Section Title: text-2xl ~ text-3xl (24-28px)
- Card Title: text-sm ~ text-base (14-16px)
- Body: text-sm ~ text-base (14-16px)
- Caption: text-xs ~ text-sm (12-14px)

폰트 웨이트:
- 제목: font-semibold (600) 또는 font-bold (700)
- 본문: font-normal (400) 또는 font-medium (500)
- 캡션: font-normal (400)
```

**사용 폰트:**
- 본문: Pretendard
- 로고: Source Code Pro

### 3. 간격 (Spacing) 규칙

```
컴포넌트 내부:
- 작은 패딩: space-2 ~ space-3 (8-12px)
- 중간 패딩: space-4 ~ space-6 (16-24px)
- 큰 패딩: space-8 ~ space-12 (32-48px)

컴포넌트 간 간격:
- 요소 간격: space-4 (16px)
- 섹션 간격: space-12 ~ space-16 (48-64px)
- 그리드 갭: space-4 ~ space-6 (16-24px)
```

### 4. Border Radius 규칙

```
- 작은 요소 (태그, 뱃지): radius-sm (4px)
- 카드/이미지: radius-md ~ radius-lg (8-12px)
- 버튼: radius-pill (9999px) - pill 형태
- 아바타: radius-full (50%) - 원형
```

### 5. 그림자 사용

```
- 기본 상태: shadow-sm 또는 shadow-md
- 호버 상태: shadow-lg
- 모달/오버레이: shadow-xl
```

## 컴포넌트 작성 가이드

### Button 컴포넌트

```tsx
// Primary Button
<Button variant="default" className="rounded-full">
  무료로 포트폴리오 만들기
</Button>

// Secondary/Outline Button
<Button variant="outline" className="rounded-full">
  갤러리 둘러보기
</Button>

// Ghost Button (텍스트 버튼)
<Button variant="ghost">
  더 보기
</Button>
```

### Card 컴포넌트

```tsx
// 작품 카드
<div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
  <div className="aspect-square relative">
    <Image src={artwork.image} alt={artwork.title} fill className="object-cover" />
  </div>
  <div className="p-4">
    <h3 className="text-sm font-medium text-gray-900">{artwork.title}</h3>
    <p className="text-xs text-gray-500">{artwork.artist}</p>
  </div>
</div>
```

### Grid 레이아웃

```tsx
// 갤러리 그리드 (5열)
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {artworks.map(artwork => <ArtworkCard key={artwork.id} {...artwork} />)}
</div>

// 작품 섹션 그리드 (2열)
<div className="grid grid-cols-2 gap-4 md:gap-6">
  {featuredWorks.map(work => <WorkCard key={work.id} {...work} />)}
</div>
```

## 페이지별 구조

### 랜딩 페이지

```
구조:
1. Hero Section
   - 중앙 정렬 타이틀 (text-4xl font-bold)
   - 두 개의 CTA 버튼 (Primary + Secondary)
   - 통계 텍스트

2. Featured Artists Section
   - 섹션 타이틀 ("이달의 주목받는 아티스트")
   - 2x2 그리드의 작품 카드
   - 각 카드에 이미지, 제목, 설명

3. CTA Section
   - "당신의 예술 세계를 시작하세요"
   - 가입 버튼
```

### 프로필 페이지

```
구조:
1. Profile Header
   - 원형 아바타 (120-150px)
   - 이름 (한글 + 영문)
   - 소개 텍스트 (2-3줄)
   - 팔로우 버튼 (outline style)

2. Representative Works
   - 섹션 타이틀 ("대표작품")
   - 2x2 그리드
   - 작품명 + 연도 캡션
```

### 작품 상세 페이지

```
구조:
1. Hero Image
   - 전체 너비 또는 최대 너비 제한
   - aspect-ratio: 16/9 또는 4/3

2. Artwork Info
   - 작품명 (text-3xl font-bold)
   - 연도
   - 상세 설명

3. Supporting Works
   - 섹션 타이틀
   - 2열 그리드
```

### 갤러리 페이지

```
구조:
1. Search Bar
   - 넓은 검색 입력창
   - 필터 버튼

2. Masonry Grid
   - 5열 (데스크톱)
   - 3열 (태블릿)
   - 2열 (모바일)

3. Card Info
   - 작품 제목
   - 아티스트 이름
   - 좋아요 아이콘 + 카운트
```

## 금지 사항

### 절대 하지 말 것

1. **과도한 애니메이션**: 부드럽고 미묘한 트랜지션만 사용
2. **복잡한 그라데이션**: 단색 또는 미묘한 그레이 그라데이션만
3. **무거운 그림자**: shadow-xl 이상 사용 자제
4. **과도한 테두리**: 필요한 경우에만 밝은 회색 테두리
5. **밀집된 레이아웃**: 충분한 화이트 스페이스 확보
6. **불필요한 장식**: 아이콘, 뱃지 등 최소화

### 코드 작성 시 주의사항

1. **Tailwind 클래스 순서**: 레이아웃 → 박스 모델 → 타이포그래피 → 비주얼
2. **반응형 우선**: 모바일 퍼스트로 작성
3. **시맨틱 HTML**: 적절한 HTML 태그 사용
4. **접근성**: aria-label, alt 속성 필수

## 파일 구조

```
src/
├── components/
│   ├── ui/              # 기본 UI (Button, Card, Input 등)
│   ├── layout/          # 레이아웃 (Header, Footer, Container)
│   ├── artwork/         # 작품 관련 (ArtworkCard, ArtworkGrid)
│   ├── artist/          # 아티스트 관련 (ArtistCard, ArtistProfile)
│   └── gallery/         # 갤러리 관련 (GalleryGrid, SearchBar)
├── styles/
│   ├── globals.css      # 글로벌 스타일, CSS 변수
│   └── _variables.scss  # SCSS 디자인 토큰
└── app/
    ├── page.tsx         # 랜딩 페이지
    ├── gallery/         # 갤러리 페이지
    ├── artist/          # 아티스트 프로필
    └── artwork/         # 작품 상세
```

## 테스트 체크리스트

새 컴포넌트 작성 후 확인:

- [ ] 디자인 토큰 사용 여부
- [ ] 반응형 동작 확인 (모바일, 태블릿, 데스크톱)
- [ ] 다크 모드 지원
- [ ] 호버/포커스 상태
- [ ] 접근성 (키보드 네비게이션, 스크린 리더)
- [ ] 일관된 간격과 정렬

## 참고 문서

- `docs/adr/001-design-system-improvement.md` - 디자인 시스템 ADR
- `.cursorrules` - 전체 개발 가이드라인
- `CLAUDE.md` - Claude AI 특화 지침
