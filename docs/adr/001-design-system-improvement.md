# ADR-001: ArtScope 디자인 시스템 개선

## 상태
승인됨 (Accepted)

## 날짜
2024-12-09

## 컨텍스트

ArtScope는 예술가 커뮤니티 플랫폼으로, 고급스럽고 미니멀한 디자인을 추구합니다. 최신 디자인 목업 분석 결과, 다음과 같은 디자인 특성을 일관되게 적용해야 합니다:

### 디자인 목업 분석 결과

**1. 랜딩 페이지**
- 깔끔한 히어로 섹션 ("예술의 순간을 기록하고 나누세요")
- 두 개의 CTA 버튼 (Primary: "무료로 포트폴리오 만들기", Secondary: "갤러리 둘러보기")
- 2x2 그리드로 "이달의 주목받는 아티스트" 섹션
- 부드러운 회색 배경 (약 #F5F5F5)

**2. 아티스트 프로필 페이지**
- 중앙 정렬된 원형 프로필 이미지
- 한글 이름 + 영문 이름 병기 (김서연 (Kim Seo-yeon))
- 아티스트 소개 텍스트
- "팔로우" 버튼 (outlined style)
- "대표작품" 섹션 - 2x2 그리드
- 작품명 + 연도 형식

**3. 작품 상세 페이지**
- 큰 히어로 이미지
- 작품명 + 연도 ("경계 (Boundary) - 2024")
- 작품 설명 텍스트
- "Supporting Images/Videos" 섹션
- 관련 작품 2열 그리드

**4. 갤러리/탐색 페이지**
- 상단 검색바 ("Search artworks, artists...")
- Filters 버튼
- 5열 Masonry 스타일 그리드
- 작품 카드: 이미지 + 제목 + 하트 아이콘 + 좋아요 수
- 아티스트 이름 서브타이틀

### 추출된 디자인 토큰

**색상 팔레트:**
- Background Primary: #FAFAFA (매우 밝은 회색)
- Background Secondary: #F5F5F5 (밝은 회색)
- Background Card: #FFFFFF (순백)
- Text Primary: #1A1A1A (거의 검정)
- Text Secondary: #666666 (중간 회색)
- Text Muted: #999999 (밝은 회색)
- Border: #E5E5E5 (매우 밝은 회색)
- Accent: #1A1A1A (버튼, 강조)
- Heart Active: #E74C3C (좋아요 활성)

**타이포그래피:**
- Hero Title: 36-48px, font-weight: 700
- Section Title: 24-28px, font-weight: 600
- Card Title: 14-16px, font-weight: 500
- Body Text: 14-16px, font-weight: 400
- Caption: 12-14px, font-weight: 400
- Line Height: 1.5-1.7

**간격 (Spacing):**
- Container Padding: 24-48px
- Section Gap: 48-64px
- Card Gap: 16-24px
- Component Padding: 12-16px

**Border Radius:**
- Card: 8-12px
- Button: 20-24px (pill shape)
- Avatar: 50% (원형)
- Image: 4-8px

**그림자:**
- Card Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover Shadow: 0 4px 16px rgba(0,0,0,0.12)

## 결정

### 1. 디자인 토큰 시스템 구조화

CSS 변수를 다음 계층으로 정의합니다:

```css
:root {
  /* Primitive Colors */
  --color-white: #FFFFFF;
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-400: #999999;
  --color-gray-500: #666666;
  --color-gray-900: #1A1A1A;
  --color-red-500: #E74C3C;

  /* Semantic Colors */
  --background-primary: var(--color-gray-50);
  --background-secondary: var(--color-gray-100);
  --background-card: var(--color-white);
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-500);
  --text-muted: var(--color-gray-400);
  --border-default: var(--color-gray-200);
  --accent-primary: var(--color-gray-900);
  --like-active: var(--color-red-500);

  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography Scale */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 28px;
  --text-4xl: 36px;
  --text-5xl: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;
  --radius-full: 50%;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-xl: 0 8px 24px rgba(0,0,0,0.16);
}
```

### 2. 컴포넌트 디자인 패턴

**버튼 스타일:**
- Primary: 검정 배경 (#1A1A1A), 흰색 텍스트, pill 모양
- Secondary: 흰색 배경, 검정 테두리, pill 모양
- Ghost: 투명 배경, 호버 시 회색 배경

**카드 스타일:**
- 배경: 순백 (#FFFFFF)
- 테두리: 없음 또는 매우 밝은 회색
- 그림자: 미묘한 shadow-md
- 호버: shadow-lg로 전환

**그리드 시스템:**
- 갤러리: 5열 (데스크톱), 3열 (태블릿), 2열 (모바일)
- 작품 섹션: 2열
- 간격: 16-24px

### 3. 페이지별 레이아웃 가이드

**랜딩 페이지:**
```
[Navigation Bar]
[Hero Section - 중앙 정렬, 큰 타이틀, 두 CTA 버튼]
[Featured Artists - 2x2 그리드]
[CTA Section - 가입 유도]
[Footer]
```

**프로필 페이지:**
```
[Navigation Bar]
[Profile Header - 원형 아바타, 이름, 소개, 팔로우 버튼]
[Representative Works - 2x2 그리드]
[Footer]
```

**갤러리 페이지:**
```
[Search Bar + Filters]
[Masonry Grid - 5열]
[Infinite Scroll or Pagination]
```

### 4. 다크 모드 지원

현재 디자인은 라이트 모드 중심이지만, 다크 모드도 지원:

```css
.dark {
  --background-primary: #0A0A0A;
  --background-secondary: #141414;
  --background-card: #1A1A1A;
  --text-primary: #FAFAFA;
  --text-secondary: #999999;
  --text-muted: #666666;
  --border-default: #2A2A2A;
  --accent-primary: #FFFFFF;
}
```

## 결과

### 긍정적 영향
1. **일관성**: 모든 페이지에서 동일한 시각적 언어 사용
2. **유지보수성**: CSS 변수로 쉬운 테마 변경
3. **확장성**: 새 컴포넌트 추가 시 기존 토큰 재사용
4. **접근성**: 충분한 색상 대비율 확보
5. **개발 속도**: 명확한 가이드라인으로 빠른 구현

### 구현 우선순위
1. CSS 변수 및 디자인 토큰 정의 (globals.css 업데이트)
2. Button, Card 컴포넌트 스타일 통일
3. 그리드 시스템 표준화
4. 페이지별 레이아웃 적용
5. 다크 모드 최적화

## 관련 문서
- `.cursorrules` - 개발 가이드라인
- `AGENT.md` - AI 에이전트 지침
- `CLAUDE.md` - Claude 특화 지침
- `src/styles/globals.css` - 글로벌 스타일
- `src/styles/_variables.scss` - SCSS 변수
