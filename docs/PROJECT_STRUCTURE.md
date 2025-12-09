# ArtScope Project Structure

**Last Updated**: 2025-12-10

This document describes the organizational structure of the ArtScope frontend codebase.

---

## Directory Overview

```
src/
├── features/          # Feature-specific code (domain-driven)
├── components/        # Shared, reusable components
├── app/               # Next.js App Router pages
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── constant/          # Constants and configuration
├── states/            # Global state management (Zustand)
├── auth/              # Authentication logic
└── styles/            # Global styles
```

---

## 📁 Features Directory

Feature-specific components that belong to a particular business domain.

```
features/
├── discovery/
│   └── components/
│       ├── ArticleCardWithActions.tsx  # Article card with like/share actions
│       ├── CurationHero.tsx            # Featured curation header
│       ├── FeedTabs.tsx                # Explore/Following/Latest tabs
│       ├── FollowSuggestions.tsx       # Artist follow suggestions
│       └── index.ts                    # Barrel exports
├── article/
│   └── components/
│       ├── ArticleHeader.tsx           # Article title and metadata
│       ├── ArticleContent.tsx          # Main article content viewer
│       ├── SupportingWorks.tsx         # Supporting images/videos
│       ├── ArtistAuthorCard.tsx        # Author information card
│       └── index.ts
├── gallery/
│   └── components/
│       ├── GalleryGrid.tsx             # Masonry grid layout
│       ├── GalleryCard.tsx             # Individual gallery card
│       └── SearchHeader.tsx            # Search and filter UI
└── landing/
    └── components/
        ├── HeroSection.tsx             # Landing page hero
        ├── FeaturedArtists.tsx         # Featured artist showcase
        └── CTASection.tsx              # Call-to-action section
```

**When to use**: Components that are specific to a feature/domain and unlikely to be reused across the app.

**Imports**:
```typescript
import { ArticleCardWithActions } from "@/features/discovery/components";
import { GalleryGrid } from "@/features/gallery/components";
```

---

## 🧩 Components Directory

Shared and reusable components that are used across multiple features.

```
components/
├── shared/                  # Generic reusable components
│   ├── Title.tsx            # Page title component
│   ├── Profile.tsx          # User profile display
│   ├── MarkdownViewer.tsx   # Markdown content renderer
│   ├── FormCard.tsx         # Card wrapper for forms
│   ├── StandardLabel.tsx    # Standardized label formatter
│   ├── UserInfo.tsx         # User information display
│   ├── LoginNeeded.tsx      # Login required state
│   ├── ObservationComponent.tsx  # Intersection observer wrapper
│   ├── ResponsiveGrid.tsx   # Responsive grid layout
│   ├── RootLayout.tsx       # Root layout wrapper
│   └── ASNextImage.tsx      # Next.js Image wrapper
│
├── layout/                  # Layout components
│   ├── MainNavbar.tsx       # Main navigation bar
│   ├── MainFooter.tsx       # Main footer
│   └── index.ts
│
├── ui/                      # UI primitives (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── popover.tsx
│   ├── separator.tsx
│   └── ...
│
├── tiptap-ui/               # Tiptap editor UI components
│   ├── mark-button/
│   ├── heading-button/
│   ├── list-button/
│   └── ...
│
├── tiptap-ui-primitive/     # Tiptap UI primitives
├── tiptap-node/             # Tiptap custom nodes
├── tiptap-templates/        # Tiptap editor templates
├── tiptap-icons/            # Tiptap custom icons
├── Navbar/                  # Legacy navbar (to be refactored)
├── Bottombar/               # Bottom navigation bar
├── Stepper/                 # Stepper component
├── DateMultiplePicker/      # Date picker component
├── theme/                   # Theme components
└── Footer.tsx               # Legacy footer component
```

**When to use**:
- **shared/**: Generic components used in 3+ different features
- **layout/**: Navigation and layout components
- **ui/**: Low-level UI primitives

**Imports**:
```typescript
import Title from "@/components/shared/Title";
import { MainNavbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
```

---

## 🪝 Hooks Directory

Custom React hooks for reusable stateful logic.

```
hooks/
├── useLike.ts               # Like/unlike functionality with optimistic updates
├── useMobile.ts             # Mobile device detection
├── useLocation.ts           # Location data management
├── useMenuNavigation.ts     # Menu navigation state
├── useCursorVisibility.ts   # Cursor visibility tracking
├── useTiptapEditor.ts       # Tiptap editor configuration
├── useWindowSize.ts         # Window size tracking
├── useLeavePageConfirm.ts   # Page leave confirmation
└── useObserver.ts           # Intersection observer
```

**Naming Convention**: All hooks use camelCase with `use` prefix (e.g., `useSomething.ts`)

**Imports**:
```typescript
import { useLike } from "@/hooks/useLike";
import { useMobile } from "@/hooks/useMobile";
```

---

## 🔧 Utils Directory

Utility functions and helpers (previously split between `/lib` and `/utils`, now unified).

```
utils/
├── ui.ts                    # UI utilities (cn classname helper)
├── helper.ts                # General helper functions (openGraph, localStorage)
├── tiptap-utils.ts          # Tiptap-specific utilities
├── jxios.ts                 # Axios instance with interceptors
├── serverApi.ts             # Server-side API calls
├── locationApi.ts           # Location API utilities
├── stringConverter.ts       # String transformation utilities
├── timeCalculator.ts        # Time/date calculations
├── chunkArray.ts            # Array chunking utility
├── imageLoader.ts           # Image loading utilities
├── textInUrlSeperator.ts    # URL text separator
└── index.ts                 # Barrel exports
```

**Imports**:
```typescript
import { cn } from "@/utils";
import { handleImageUpload } from "@/utils/tiptap-utils";
import { openGraph } from "@/utils/helper";
import jxios from "@/utils/jxios";
```

---

## 📄 App Directory (Next.js Pages)

Next.js 14+ App Router pages and layouts.

```
app/
├── (main)/                  # Main app routes
│   ├── (list)/              # Landing page
│   ├── (viewer)/            # Article viewer
│   ├── gallery/             # Gallery page
│   ├── profile/             # User profiles
│   ├── team/                # Team pages
│   ├── location/            # Location pages
│   └── simple/              # Simple pages
├── user/                    # User authentication pages
│   ├── login/
│   ├── signup/
│   ├── find/
│   └── settings/
├── editor/                  # Content editor
│   ├── (dashboard)/         # Editor dashboard
│   └── (editor)/            # Editor interface
├── api/                     # API routes
│   ├── auth/
│   ├── server/
│   └── upload/
└── about/                   # About page
```

**Best Practice**: Page components should be thin wrappers that import from `/features` or `/components`.

---

## 📘 Types Directory

TypeScript type definitions.

```
types/
├── article.ts               # Article and portfolio types
├── auth.ts                  # Authentication types
├── comment.ts               # Comment types
├── default.ts               # Common/shared types
├── location.ts              # Location types
├── profile.ts               # Profile types
├── team.ts                  # Team types
├── tiptap.d.ts              # Tiptap type extensions
└── index.ts                 # Barrel exports
```

**Imports**:
```typescript
import type { articleItemType } from "@/types/article";
import type { AuthorType } from "@/types/article";
```

---

## 🎯 Best Practices

### Component Organization

1. **Feature-specific** → `/features/{feature}/components`
2. **Reusable (3+ places)** → `/components/shared`
3. **Layout** → `/components/layout`
4. **UI Primitives** → `/components/ui`

### File Naming

- **Components**: PascalCase (e.g., `ArticleCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLike.ts`)
- **Utils**: camelCase (e.g., `stringConverter.ts`)
- **Types**: camelCase (e.g., `article.ts`)

### Import Patterns

```typescript
// ✅ Good: Use barrel exports when available
import { ArticleCardWithActions } from "@/features/discovery/components";

// ✅ Good: Direct imports for specific files
import Title from "@/components/shared/Title";

// ❌ Bad: Relative imports for cross-directory
import Title from "../../../components/shared/Title";

// ❌ Bad: Importing from page components
import Something from "@/app/(main)/gallery/components/Something";
```

### Adding New Features

1. Create feature directory: `src/features/{feature-name}/components`
2. Add components to the feature directory
3. Create `index.ts` for barrel exports
4. Import from pages using `@/features/{feature-name}/components`

Example:
```bash
mkdir -p src/features/portfolio/components
touch src/features/portfolio/components/PortfolioGrid.tsx
touch src/features/portfolio/components/index.ts
```

```typescript
// src/features/portfolio/components/index.ts
export { default as PortfolioGrid } from './PortfolioGrid';

// src/app/(main)/portfolio/page.tsx
import { PortfolioGrid } from "@/features/portfolio/components";
```

---

## 📊 Migration Summary

This structure was implemented on 2025-12-10 as part of ADR 002.

**Key Changes**:
- ✅ Created `/features` directory for domain-driven organization
- ✅ Created `/components/shared` for truly reusable components
- ✅ Merged `/lib` into `/utils` (single source of utilities)
- ✅ Standardized hook naming (use camelCase)
- ✅ Moved page-level components to features
- ✅ Removed unused files (ErrorMessageInput, Loading, etc.)
- ✅ Updated 100+ import statements

**Build Status**: ✅ Passing
**Type Check**: ✅ Passing
**ESLint**: ⚠️ Warnings only (no errors)

---

## 📚 Related Documentation

- [ADR 002: Project Structure Refactoring](./adr/002-project-structure-refactoring.md)
- [ADR 001: Design System Improvement](./adr/001-design-system-improvement.md)
- [CLAUDE.md](../CLAUDE.md) - AI development guidelines

---

## 🔮 Future Improvements

- [ ] Move feature-specific hooks to `/features/{feature}/hooks`
- [ ] Consider feature-specific types in `/features/{feature}/types`
- [ ] Add Storybook for shared component documentation
- [ ] Create component usage analytics
- [ ] Refactor legacy Navbar to layout components
