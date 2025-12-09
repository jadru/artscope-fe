# ArtScope - Claude AI Instructions

이 문서는 Claude AI가 ArtScope 프로젝트에서 작업할 때 따라야 할 지침입니다.

## 프로젝트 컨텍스트

ArtScope는 **예술가 커뮤니티 플랫폼**입니다. 핵심 가치:
- 고급스러운 미니멀리즘 (Luxury Minimalism)
- 예술 작품 중심 디자인 (Art-Centric)
- 깔끔하고 정제된 사용자 경험

## 디자인 시스템 Quick Reference

### 색상 팔레트

| 용도 | Light Mode | Dark Mode |
|------|------------|-----------|
| 페이지 배경 | `#FAFAFA` | `#0A0A0A` |
| 섹션 배경 | `#F5F5F5` | `#141414` |
| 카드 배경 | `#FFFFFF` | `#1A1A1A` |
| 주요 텍스트 | `#1A1A1A` | `#FAFAFA` |
| 보조 텍스트 | `#666666` | `#999999` |
| 테두리 | `#E5E5E5` | `#2A2A2A` |
| 강조색 | `#1A1A1A` | `#FFFFFF` |
| 좋아요 | `#E74C3C` | `#E74C3C` |

### 타이포그래피

```
Hero:      text-4xl ~ text-5xl, font-bold
Section:   text-2xl ~ text-3xl, font-semibold
Card:      text-sm ~ text-base, font-medium
Body:      text-sm ~ text-base, font-normal
Caption:   text-xs ~ text-sm, font-normal
```

### 간격 시스템

```
Tight:   4px (space-1), 8px (space-2)
Normal:  12px (space-3), 16px (space-4)
Loose:   24px (space-6), 32px (space-8)
Section: 48px (space-12), 64px (space-16)
```

### Border Radius

```
Small:  4px (rounded-sm) - 태그, 뱃지
Medium: 8px (rounded-md) - 이미지
Large:  12px (rounded-lg) - 카드
Pill:   9999px (rounded-full) - 버튼
Circle: 50% (rounded-full) - 아바타
```

## 코드 작성 규칙

### 1. 컴포넌트 패턴

```tsx
// 올바른 패턴
export function ArtworkCard({ title, image, artist, likes }: ArtworkCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{artist}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Heart className="w-3.5 h-3.5" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. 레이아웃 패턴

```tsx
// 페이지 컨테이너
<main className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 py-12">
    {/* 콘텐츠 */}
  </div>
</main>

// 섹션 간격
<section className="py-16 space-y-8">
  <h2 className="text-2xl font-semibold text-center">섹션 타이틀</h2>
  {/* 섹션 콘텐츠 */}
</section>

// 그리드 레이아웃
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {/* 그리드 아이템 */}
</div>
```

### 3. 버튼 스타일

```tsx
// Primary (검정 배경, pill 형태)
<Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
  Primary Action
</Button>

// Secondary (outline, pill 형태)
<Button variant="outline" className="rounded-full px-6">
  Secondary Action
</Button>

// Ghost (투명 배경)
<Button variant="ghost" className="text-gray-600 hover:text-gray-900">
  Ghost Action
</Button>
```

### 4. 이미지 처리

```tsx
// 작품 이미지 (정사각형)
<div className="aspect-square relative rounded-lg overflow-hidden">
  <Image
    src={src}
    alt={alt}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
  />
</div>

// 히어로 이미지 (16:9)
<div className="aspect-video relative rounded-xl overflow-hidden">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>

// 아바타 (원형)
<div className="w-24 h-24 relative rounded-full overflow-hidden">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>
```

## 금지 사항

### UI/UX

- **과도한 색상** 사용 금지 - 회색 톤 + 단일 강조색만 사용
- **복잡한 그라데이션** 금지 - 단색 배경 선호
- **무거운 그림자** 금지 - shadow-md 이하 사용
- **과도한 애니메이션** 금지 - 미묘한 트랜지션만 사용
- **밀집된 UI** 금지 - 충분한 화이트 스페이스 확보
- **불필요한 장식 요소** 금지 - 미니멀리즘 유지

### 코드

- **인라인 스타일** 금지 - Tailwind 클래스 사용
- **하드코딩된 색상** 금지 - CSS 변수 또는 Tailwind 색상 사용
- **any 타입** 금지 - 적절한 TypeScript 타입 정의
- **console.log** 프로덕션 코드에 남기기 금지

## 페이지 구현 가이드

### 랜딩 페이지 (`/`)

```
[Navbar]
│
[Hero Section]
├─ 타이틀: "예술의 순간을 기록하고 나누세요"
├─ CTA 버튼 2개 (Primary + Secondary)
└─ 통계 텍스트
│
[Featured Artists Section]
├─ 섹션 타이틀: "이달의 주목받는 아티스트"
└─ 2x2 그리드 작품 카드
│
[CTA Section]
├─ 타이틀: "당신의 예술 세계를 시작하세요"
└─ 가입 버튼
│
[Footer]
```

### 아티스트 프로필 (`/artist/[id]`)

```
[Navbar]
│
[Profile Header]
├─ 원형 아바타 (120px)
├─ 이름 (한글 + 영문)
├─ 소개 텍스트
└─ 팔로우 버튼 (outline)
│
[Representative Works]
├─ 섹션 타이틀: "대표작품"
└─ 2x2 그리드
│
[Footer]
```

### 갤러리 (`/gallery`)

```
[Search Bar + Filters]
│
[Masonry Grid]
├─ 5열 (desktop)
├─ 3열 (tablet)
└─ 2열 (mobile)
│
[Pagination/Infinite Scroll]
```

### 작품 상세 (`/artwork/[id]`)

```
[Navbar]
│
[Hero Image]
│
[Artwork Info]
├─ 작품명 + 연도
└─ 상세 설명
│
[Supporting Works]
├─ 섹션 타이틀: "Supporting Images/Videos"
└─ 2열 그리드
│
[Footer]
```

## 자주 사용하는 컴포넌트

### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

### Section

```tsx
<section className="py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
      {title}
    </h2>
    {children}
  </div>
</section>
```

### Card Grid

```tsx
<div className="grid grid-cols-2 gap-4 md:gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## 체크리스트

코드 작성 후 확인:

- [ ] 디자인 토큰/CSS 변수 사용
- [ ] 반응형 디자인 (sm, md, lg breakpoints)
- [ ] 다크 모드 지원 (dark: prefix)
- [ ] 호버/포커스 상태 정의
- [ ] 접근성 (aria-label, alt)
- [ ] TypeScript 타입 정의
- [ ] 일관된 간격과 정렬

## 참고 파일

- `docs/adr/001-design-system-improvement.md` - 디자인 결정 기록
- `AGENT.md` - AI 에이전트 가이드라인
- `.cursorrules` - 개발 규칙
- `src/styles/globals.css` - 글로벌 CSS 변수
- `src/components/ui/` - 기본 UI 컴포넌트
