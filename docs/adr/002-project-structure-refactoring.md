# ADR 002: Project Structure Refactoring

**Date**: 2025-12-10
**Status**: Accepted
**Deciders**: Development Team
**Tags**: architecture, structure, maintainability, refactoring

---

## Context

The ArtScope project had grown organically with components, utilities, and features scattered across multiple directories without clear organization principles. This led to several maintenance issues:

1. **Inconsistent component organization**: Components existed in `/components`, `/app/(main)/*/components`, creating confusion about where to place new components
2. **Mixed concerns**: Generic components were mixed with feature-specific, editor-specific, and UI primitive components
3. **Duplicate utilities**: Both `/lib` and `/utils` directories existed with overlapping purposes
4. **Inconsistent naming**: Hooks used mixed naming conventions (`use-mobile.ts` vs `useLike.ts`)
5. **Unclear dependencies**: Hard to understand which components belong to which features
6. **Poor discoverability**: Developers had difficulty finding existing components to reuse

### Previous Structure

```
src/
├── components/
│   ├── Discovery/           # Feature components mixed with generic
│   ├── Navbar/
│   ├── ui/                  # UI primitives
│   ├── tiptap-*/            # Editor-specific components
│   ├── ASNextImage.tsx      # Generic shared components
│   ├── Title.tsx
│   ├── Profile.tsx
│   └── ErrorMessageInput.tsx  # Unused components
├── app/
│   └── (main)/
│       ├── (list)/
│       │   └── components/  # Page-specific components
│       ├── gallery/
│       │   └── components/  # Page-specific components
│       └── (viewer)/
│           └── article/
│               └── components/  # Page-specific components
├── lib/                     # Utilities (duplicate of utils)
│   ├── utils.ts
│   ├── helper.ts
│   └── tiptap-utils.ts
├── utils/                   # Utilities (duplicate of lib)
│   ├── jxios.ts
│   ├── serverApi.ts
│   └── ...
└── hooks/
    ├── use-mobile.ts        # Inconsistent naming
    ├── useLike.ts
    └── ...
```

### Problems

1. **Feature Locality**: Components related to a feature (discovery, gallery, articles) were separated from their pages
2. **Code Reuse**: Difficult to identify which components are shared vs feature-specific
3. **Import Paths**: Long, inconsistent import paths (`../../../components/Discovery/...`)
4. **Maintenance**: Hard to refactor features when components are scattered
5. **Onboarding**: New developers struggled to understand the organization

---

## Decision

We will reorganize the project structure following the **Feature-Based Architecture** pattern with clear separation of concerns:

### New Structure

```
src/
├── features/                # Feature-specific code (new)
│   ├── discovery/
│   │   └── components/
│   │       ├── ArticleCardWithActions.tsx
│   │       ├── CurationHero.tsx
│   │       ├── FeedTabs.tsx
│   │       ├── FollowSuggestions.tsx
│   │       └── index.ts
│   ├── article/
│   │   └── components/
│   │       ├── ArticleHeader.tsx
│   │       ├── ArticleContent.tsx
│   │       ├── SupportingWorks.tsx
│   │       ├── ArtistAuthorCard.tsx
│   │       └── index.ts
│   ├── gallery/
│   │   └── components/
│   │       ├── GalleryGrid.tsx
│   │       ├── GalleryCard.tsx
│   │       └── SearchHeader.tsx
│   └── landing/
│       └── components/
│           ├── HeroSection.tsx
│           ├── FeaturedArtists.tsx
│           └── CTASection.tsx
│
├── components/              # Shared/reusable components only
│   ├── shared/              # Generic shared components (new)
│   │   ├── Title.tsx
│   │   ├── Profile.tsx
│   │   ├── MarkdownViewer.tsx
│   │   ├── FormCard.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── MainNavbar.tsx
│   │   ├── MainFooter.tsx
│   │   └── index.ts
│   ├── ui/                  # UI primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── tiptap-ui/           # Tiptap editor UI components
│   ├── tiptap-ui-primitive/ # Tiptap primitives
│   ├── tiptap-node/         # Tiptap custom nodes
│   ├── Navbar/              # Main navigation
│   ├── Bottombar/
│   ├── Stepper/
│   └── Footer.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useLike.ts           # Standardized naming
│   ├── useMobile.ts
│   ├── useLocation.ts
│   ├── useMenuNavigation.ts
│   ├── useCursorVisibility.ts
│   ├── useTiptapEditor.ts
│   ├── useWindowSize.ts
│   ├── useLeavePageConfirm.ts
│   └── useObserver.ts
│
├── utils/                   # Utilities (merged from lib)
│   ├── ui.ts                # UI utilities (cn, etc.)
│   ├── helper.ts            # Helper functions
│   ├── tiptap-utils.ts      # Tiptap-specific utilities
│   ├── jxios.ts             # Axios instance
│   ├── serverApi.ts         # Server API calls
│   ├── locationApi.ts
│   ├── stringConverter.ts
│   ├── timeCalculator.ts
│   ├── chunkArray.ts
│   ├── imageLoader.ts
│   └── textInUrlSeperator.ts
│
├── types/                   # TypeScript type definitions
├── constant/                # Constants
├── states/                  # Global state (Zustand stores)
└── app/                     # Next.js app router pages
    └── (main)/
        ├── (list)/
        │   └── components/  # Removed (moved to features)
        ├── gallery/
        │   └── components/  # Removed (moved to features)
        └── (viewer)/
            └── article/
                └── components/  # Removed (moved to features)
```

### Key Changes

1. **Created `/features` directory**: Feature-specific components now live with their domain
2. **Created `/components/shared`**: Generic reusable components separated from feature-specific
3. **Merged `/lib` into `/utils`**: Single source for utility functions
4. **Standardized hook naming**: All hooks use camelCase convention (`useSomething.ts`)
5. **Removed page-level component folders**: Components moved to `/features` for better reusability
6. **Added index.ts exports**: Each feature exports its components for cleaner imports
7. **Removed unused files**: Cleaned up `ErrorMessageInput.tsx`, `Loading.tsx`, and other unused components

### Import Path Conventions

```typescript
// Feature components
import { ArticleCardWithActions } from "@/features/discovery/components";

// Shared components
import Title from "@/components/shared/Title";

// Layout components
import { MainNavbar } from "@/components/layout";

// UI primitives
import { Button } from "@/components/ui/button";

// Hooks
import { useLike } from "@/hooks/useLike";

// Utils (unified)
import { cn } from "@/utils";
import { handleImageUpload } from "@/utils/tiptap-utils";
import { openGraph } from "@/utils/helper";
```

---

## Rationale

### Feature-Based Architecture Benefits

1. **Locality of Behavior**: Related code lives together, making it easier to understand and modify features
2. **Reduced Coupling**: Features are self-contained and don't depend on deep component hierarchies
3. **Better Scalability**: Easy to add new features without cluttering shared directories
4. **Improved Discoverability**: Clear separation between feature-specific and shared code
5. **Easier Refactoring**: Can modify/delete features without affecting others

### Single Utils Directory

- **Clarity**: One place to look for utility functions
- **No Duplication**: Eliminates confusion about where to put/find utilities
- **Consistency**: All utilities follow the same organization pattern

### Standardized Naming

- **Predictability**: Developers know exactly how to name new hooks/files
- **Autocomplete**: IDEs can better suggest file names
- **Professional**: Follows React and TypeScript community conventions

### Shared Components Separation

- **Reusability**: Easy to identify truly reusable components
- **Prevents Over-Engineering**: Clear signal when a component should be generic vs feature-specific
- **Documentation**: Shared components can have stricter documentation requirements

---

## Consequences

### Positive

1. **Better Maintainability**: Clear structure makes the codebase easier to navigate and modify
2. **Faster Development**: Developers spend less time searching for components
3. **Improved Onboarding**: New team members can understand the structure quickly
4. **Easier Testing**: Feature-based organization makes it easier to test features in isolation
5. **Reduced Cognitive Load**: Clear boundaries between features, shared code, and UI primitives
6. **Better Code Reuse**: Easy to identify candidates for extraction to shared components

### Negative

1. **Migration Effort**: Required updating ~50+ import statements across the codebase
2. **Breaking Changes**: Existing PRs/branches may have merge conflicts
3. **Learning Curve**: Team needs to learn new organizational conventions
4. **Temporary Confusion**: Developers familiar with old structure need to adapt

### Neutral

1. **File Moves**: Many files were moved, creating a large git diff
2. **Import Path Changes**: All imports from moved files needed updating
3. **Build Configuration**: Path aliases remain unchanged, no build config updates needed

---

## Implementation Notes

### Migration Steps Taken

1. ✅ Created new directory structure (`/features`, `/components/shared`)
2. ✅ Moved feature-specific components to `/features/{feature}/components`
3. ✅ Moved shared components to `/components/shared`
4. ✅ Merged `/lib` into `/utils`
5. ✅ Renamed hooks to consistent naming convention
6. ✅ Updated all import paths using automated find-replace
7. ✅ Removed unused components and utilities
8. ✅ Created index.ts files for feature exports
9. ✅ Tested build to ensure no broken imports

### Automated Import Updates

Used find-replace across the codebase:
- `@/lib/utils` → `@/utils`
- `@/lib/tiptap-utils` → `@/utils/tiptap-utils`
- `@/lib/helper` → `@/utils/helper`
- `@/hooks/use-*` → `@/hooks/use*` (camelCase)
- `@/components/Discovery/*` → `@/features/discovery/components/*`
- Page-local imports → Feature imports

### Files Removed

**Unused Components (2 files)**:
- `src/components/ErrorMessageInput.tsx`
- `src/components/Loading.tsx`

**Merged Directories**:
- `src/lib/` → merged into `src/utils/`

**Relocated Components (13+ files)**:
- Discovery components → `/features/discovery/components`
- Article viewer components → `/features/article/components`
- Gallery components → `/features/gallery/components`
- Landing components → `/features/landing/components`

---

## Compliance

This refactoring aligns with:

- **Clean Architecture**: Separation of concerns with clear boundaries
- **Feature-Driven Development**: Organizing code by business features
- **Screaming Architecture**: Structure reveals intent and business domains
- **Next.js Best Practices**: Colocation of related code
- **React Community Standards**: Conventional hook naming (useSomething)

---

## Future Considerations

### Potential Next Steps

1. **Feature Hooks**: Move feature-specific hooks into `/features/{feature}/hooks`
2. **Feature Types**: Consider moving feature-specific types to `/features/{feature}/types`
3. **Feature Utils**: Extract feature-specific utilities to `/features/{feature}/utils`
4. **API Layer**: Consider organizing API calls by feature in `/features/{feature}/api`
5. **Barrel Exports**: Add more index.ts files for cleaner imports
6. **Storybook Integration**: Document shared components with Storybook
7. **Component Guidelines**: Create documentation for when to use features vs shared

### Monitoring

- Track developer feedback on new structure
- Monitor time to find components (developer experience metric)
- Review PR comments for structural confusion
- Survey team after 1 month on structure satisfaction

---

## References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Screaming Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Next.js Project Structure Best Practices](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [React Hooks Naming Convention](https://react.dev/reference/react)
- [ADR 001: Design System Improvement](./001-design-system-improvement.md)

---

## Related Decisions

- ADR 001: Design System Improvement (design patterns and component standards)
- Future: Component Documentation Strategy
- Future: Testing Strategy for Feature Components
