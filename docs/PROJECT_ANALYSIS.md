# Trekking Food React v2 — Project Analysis

## 📋 Purpose
Application for planning meals on hiking trips.

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite (rolldown-vite) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| **Routing** | React Router v7 |
| **State** | TanStack Query v5 |
| **Forms** | React Hook Form + Zod |
| **Auth** | Better Auth |
| **Testing** | Vitest |

### Main Dependencies
```json
{
  "react": "^19.1.1",
  "react-router-dom": "^7.9.6",
  "@tanstack/react-query": "^5.90.11",
  "react-hook-form": "^7.71.2",
  "better-auth": "^1.5.5",
  "zod": "^4.3.6",
  "tailwindcss": "^4.1.16",
  "radix-ui": "^1.4.3"
}
```

## 🏗 Project Structure

```
src/
  api/         — API clients (products, hikings, recipes, categories, eatings)
  components/  — UI components (forms, dialogs, lists, layout)
  hooks/       — custom hooks (useProducts, useHikings, useAuth)
  lib/         — utilities (api-client, auth, toast)
  pages/       — application pages (7 pages)
  providers/   — providers (Auth, Theme)
  schemas/     — Zod validation schemas
  types/       — TypeScript types
```

### API Modules (`src/api/`)
- `products.ts` — products management
- `hikings.ts` — hikings management
- `recipes.ts` — recipes
- `categories.ts` — product categories
- `eatings.ts` — eating times

### Hooks (`src/hooks/`)
- `use-products.ts` — `useProducts()`, `useCreateProduct()`
- `use-hikings.ts` — `useHikings()`, `useHiking()`, `useCreateHiking()`, `useAddHikingProduct()`, `useUpdateHikingProduct()`, `useAddHikingAdmin()`
- `use-recipes.ts` — recipes management
- `use-categories.ts` — categories management
- `use-auth.ts` — authentication
- `use-theme.tsx` — theming

### Pages (`src/pages/`)
| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/products` | `ProductsPage` |
| `/categories` | `CategoriesPage` |
| `/recipes` | `RecipesPage` |
| `/recipes/:id` | `RecipeDetailPage` |
| `/hikings` | `HikingsPage` |
| `/hikings/:id` | `HikingDetailPage` |

### Components (`src/components/`)
- `common/` — common components
- `dialogs/` — dialog windows
- `forms/` — forms (CreateProductForm, etc.)
- `hiking-page/` — hiking page components
- `recipe-page/` — recipe page components
- `lists/` — lists
- `layout/` — layout (Layout)
- `ui/` — shadcn/ui components
- `rhf/` — React Hook Form integration

## 🔑 Key Features

### Authentication
- **Better Auth** with session management
- `useAuth()` hook provides: `user`, `isAuthenticated`, `login`, `logout`, `register`, `error`
- Token passed in API requests (Bearer)

### TanStack Query
- **Caching:** 2 minutes for products list (`staleTime: 2 * 60 * 1000`)
- **Query keys:**
  ```typescript
  // Products
  productQueryKeys.all        // ["products"]
  productQueryKeys.list()     // ["products", "list"]

  // Hikings
  hikingQueryKeys.all         // ["hikings"]
  hikingQueryKeys.list(opts)  // ["hikings", "list", opts]
  hikingQueryKeys.detail(id)  // ["hikings", "detail", id]
  ```
- **Invalidation:** data refreshes after mutations (create product, add to hiking)

### Forms & Validation
- **React Hook Form** — form management
- **Zod** — validation schemas in `src/schemas/`
- **@hookform/resolvers** — Zod integration with React Hook Form

### Theming
- **next-themes** — light/dark theme toggle
- **Tailwind CSS** — utility classes
- **CSS variables** — palette customization

### Notifications
```typescript
import { toastInfo, toastWarning, toastError, toastSuccess } from "@/lib/toast";

toastSuccess("Product created");
toastError("Failed to save");
toastInfo("Profile updated");
```

## 🌐 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List products |
| `POST` | `/products` | Create product (requires auth) |

### Hikings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/hikings` | List hikings |
| `GET` | `/hikings/:id` | Hiking details |
| `POST` | `/hikings` | Create hiking |
| `POST` | `/hikings/:id/hiking-products` | Add product to hiking |
| `POST` | `/hikings/:id/hiking-products/from-recipe` | Add products from recipe |
| `PATCH` | `/hikings/:hikingId/hiking-products/:id` | Update product quantity |
| `POST` | `/hikings/:id/admins` | Add hiking admin |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/recipes` | List recipes |
| `GET` | `/recipes/:id` | Recipe details |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | List categories |
| `POST` | `/categories` | Create category |

## 🚀 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | TypeScript + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run fix` | ESLint with auto-fix |
| `npm run tsc` | TypeScript type check |
| `npm run test` | Run tests (Vitest) |

## 🌐 Environment Configuration

### `.env.example`
```env
VITE_API_URL=/api
```

### Modes

**Local development (backend on port 4000, Vite proxy):**
```env
VITE_API_URL=http://localhost:4000
```

**Production (API on different host):**
```env
VITE_API_URL=https://trekking-food-api-v2.onrender.com
```

**Auth on separate server:**
```env
VITE_API_URL=https://api.example.com
VITE_AUTH_URL=https://auth.example.com
```

## 📊 Architectural Features

1. **API response normalization** — snake_case → camelCase conversion
2. **Single api-client** — centralized request management
3. **Request encapsulation** — all API calls through hooks
4. **Typing** — strict TypeScript types for all entities
5. **Component approach** — reusable UI components

---

## 📈 Project Evaluation

### ✅ Strengths

#### 1. Architecture — 9/10

**Pros:**
- Clear separation of concerns: API → Hooks → Components
- Single `apiFetch` with centralized error, token, and toast handling
- Data normalization (snake_case → camelCase) at API layer
- TanStack Query keys are typed and structured
- Automatic invalidation after mutations

**Cons:**
- ❗ No service layer — business logic spread between hooks and components
- ❗ No retry logic for network requests

---

#### 2. Technologies — 9.5/10

| Technology | Rating | Comment |
|------------|--------|---------|
| **React 19** | ✅ | Current version, future-ready |
| **TypeScript** | ✅ | Strict typing, project references |
| **TanStack Query v5** | ✅ | Perfect for server state |
| **React Hook Form + Zod** | ✅ | Best combination for forms |
| **Tailwind CSS 4** | ✅ | Modern styling approach |
| **Radix UI / shadcn** | ✅ | Accessible components |
| **Better Auth** | ✅ | Lightweight NextAuth alternative |
| **Vite (rolldown)** | ✅ | Fast build |

**Risks:**
- ⚠️ `rolldown-vite` — experimental (may be unstable)
- ⚠️ `zod@^4.3.6` — v4 not yet stable (v3 preferred)
- ⚠️ `babel-plugin-react-compiler` — React Compiler in beta

---

#### 3. Folder Structure — 8.5/10

**Pros:**
- Intuitive structure
- Barrel files (`index.ts`) for convenient imports
- Path alias `@/` for clean imports

**To Improve:**
- ❗ **`features/` or `modules/`** — for domain grouping (products, hikings, recipes)
- ❗ **`constants/`** — extract constants separately
- ❗ **`utils/`** instead of `lib/` — more conventional name

---

#### 4. Best Practices — 8/10

| Practice | Status | Comment |
|----------|--------|---------|
| **Typing** | ✅ | Strict types for API, forms, hooks |
| **DRY** | ✅ | Reusable hooks and components |
| **Single Responsibility** | ✅ | Each module handles its own concern |
| **Error Handling** | ✅ | Centralized handling in `apiFetch` |
| **Loading States** | ✅ | TanStack Query provides `isLoading` |
| **Code Style** | ✅ | ESLint + Prettier + Prettier plugin |
| **Git** | ✅ | `.gitignore`, `.env.example` |

**Gaps:**
- ❌ **Tests** — Vitest configured, but no/few tests
- ❌ **Storybook** — no component documentation
- ❌ **Error Boundary** — no global React error handling
- ❌ **Loading Skeleton** — component exists but not used everywhere
- ❌ **Accessibility** — no explicit ARIA attributes in custom components

---

### 🔧 Recommendations for Improvement

#### Critical (do first)
1. **Add tests** — at least for critical hooks (`useProducts`, `useAuth`)
2. **Error Boundary** — global error handler
3. **Retry logic** — in `apiFetch` for temporary network errors
4. **Zod v3** — downgrade to stable version

#### Important
5. **Feature-slices structure** — domain grouping
6. **Loading skeletons** — use on all pages
7. **Constants** — extract `HIKINGS_STALE_TIME_MS`, `DEFAULT_PAGE` to `constants/`

#### Optional
8. **Storybook** — for UI component documentation
9. **MSW (Mock Service Worker)** — for API mocks in tests
10. **Husky + lint-staged** — pre-commit hooks for linting

---

### 📈 Overall Evaluation

| Category | Rating |
|----------|--------|
| Architecture | 9/10 |
| Technologies | 9.5/10 |
| Structure | 8.5/10 |
| Best Practices | 8/10 |
| **Average** | **8.5/10** |

**Verdict:** Professional-level project with modern practices. Main risks are experimental dependencies (rolldown, Zod v4, React Compiler). Recommended to add tests and Error Boundary for production readiness.

---

*Analysis completed: March 29, 2026, 23:10*
*Analyst: Qwen Code*
