# Trekking Food React v2

React + TypeScript + Vite + Tailwind. Auth via [Better Auth](https://better-auth.com), data with TanStack Query, forms with React Hook Form + Zod.

## Setup

```bash
npm install
cp .env.example .env   # if you have one; otherwise create .env
npm run dev
```

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server (Vite)  |
| `npm run build`| TypeScript + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |
| `npm run fix`  | ESLint with auto-fix     |

## Environment variables

Create a `.env` in the project root. All client-side env vars must start with `VITE_`.

### Examples

**Local development (backend on port 4000, Vite proxy avoids CORS):**

```env
VITE_API_URL=http://localhost:4000
# Auth uses same origin in dev (proxy forwards /api to 4000). No VITE_AUTH_URL needed.
```

**Production (API on another host):**

```env
VITE_API_URL=https://trekking-food-api-v2.onrender.com
# Optional: use a different URL for auth
# VITE_AUTH_URL=https://your-auth-server.com
```

**Auth on a different server than the main API:**

```env
VITE_API_URL=https://api.example.com
VITE_AUTH_URL=https://auth.example.com
```

| Variable         | Description |
|------------------|-------------|
| `VITE_API_URL`   | Base URL for API (products, etc.). In dev can be `http://localhost:4000`; with proxy you can use same or leave for prod. |
| `VITE_AUTH_URL`  | Optional. Better Auth server URL. If unset, auth falls back to `VITE_API_URL`, then same origin. In dev, auth uses same origin so the Vite proxy is used. |

## Auth (Better Auth)

- Sign in / sign up in the header; session is used for API requests (Bearer token when the server sends `set-auth-token`).
- **Hooks:** `useAuth()` from `@/hooks` gives `user`, `isAuthenticated`, `login`, `logout`, `register`, `error`, etc.

**Example – show user and logout:**

```tsx
import { useAuth } from "@/hooks";

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return <p>Not signed in</p>;
  return (
    <div>
      <p>{user?.email}</p>
      <button onClick={() => logout()}>Sign out</button>
    </div>
  );
}
```

## API & TanStack Query

- **Products:** `GET /products`, `POST /products` (with auth token). List response shape: `{ data: Product[], meta: { total, page, limit, totalPages } }`. Plain arrays from older APIs are normalized to that shape in `getProducts`.
- **Hooks (TanStack Query):** `useProducts()` (`useQuery` → `GET /products`) and `useCreateProduct()` (`useMutation` → `POST /products`) from `@/hooks`.
- **Query keys:** `productQueryKeys.all` (`["products"]`), `productQueryKeys.list()` (`["products","list"]`). Legacy alias: `productsQueryKey` (same as `all`).

### Product list: when does it refetch?

TanStack Query decides refetches from **stale vs fresh** data and a few flags. Here is how this app behaves for products:

| Trigger | What happens |
|--------|----------------|
| **First visit** to a screen that uses `useProducts` | Fetches from the API (`GET /products`). |
| **Navigate away and back** | If cached data is still **fresh** (within `staleTime`), **no** network request—UI uses cache. If **stale**, refetches in the background (or on mount, depending on defaults). |
| **Window / tab regains focus** | Default `refetchOnWindowFocus: true`: if the list query is **stale**, it refetches. Fresh data is not refetched. |
| **After creating a product** | `useCreateProduct` calls `invalidateQueries({ queryKey: productQueryKeys.all })`, so the list is marked stale and **refetches** so new items appear. |
| **Manual** | `const { refetch } = useProducts();` then `refetch()` forces a new request. |

**Configured in code:** `src/hooks/use-products.ts` sets **`staleTime: 2 * 60 * 1000` (2 minutes)** so the list is not treated as stale immediately. Without that, React Query’s default `staleTime: 0` would refetch almost every time you open the Products page or focus the window.

**To change behavior:**

- Longer cache: increase `PRODUCTS_STALE_TIME_MS` in `use-products.ts`.
- Fewer refetches on tab focus: add `refetchOnWindowFocus: false` to the `useQuery` options in `useProducts`.
- Always refetch on mount: set `staleTime: 0` or `refetchOnMount: "always"` (use sparingly).

**Example – list products and create one:**

```tsx
import { useProducts, useCreateProduct } from "@/hooks";

function Products() {
  const { data, isLoading, error } = useProducts();
  const products = data?.data;
  const meta = data?.meta;
  const createProduct = useCreateProduct();

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {meta && (
        <p className="text-sm text-muted-foreground">
          {meta.total} products · page {meta.page}/{meta.totalPages}
        </p>
      )}
      <ul>
        {products?.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
      <button
        onClick={() =>
          createProduct.mutate({
            name: "Bread",
            kkal: 265,
            proteins: 9,
            fats: 3.2,
            carbohydrates: 49,
            price: 1.5,
            isVegetarian: true,
            productCategoryId: "some-uuid",
            isCommon: true,
          })
        }
        disabled={createProduct.isPending}
      >
        Add product
      </button>
    </div>
  );
}
```

### Hikings

- **API (`src/api/hikings.ts`):** `getHikings` / `getHiking` / `postHiking` — list and detail responses are normalized (camelCase vs snake_case). `postHikingProductsFromRecipe(hikingId, payload)` → `POST /hikings/:id/hiking-products/from-recipe`.
- **Hooks (`@/hooks`):** `useHikings`, `useHiking(id)`, `useCreateHiking`, `useAddHikingProductsFromRecipe`.
- **Query keys:** `hikingQueryKeys.all`, `hikingQueryKeys.list({ page, limit, search })`, `hikingQueryKeys.detail(id)`.

**Example – list hikings, open one, create a hiking, add products from a recipe:**

```tsx
import {
  useHikings,
  useHiking,
  useCreateHiking,
  useAddHikingProductsFromRecipe,
} from "@/hooks";

function HikingFlow({ hikingId }: { hikingId: string }) {
  const { data: listData } = useHikings();
  const { data: hiking } = useHiking(hikingId);
  const createHiking = useCreateHiking();
  const addFromRecipe = useAddHikingProductsFromRecipe();

  return (
    <div>
      <p>Hikings: {listData?.data?.length ?? 0}</p>
      {hiking && <p>Current: {hiking.name}</p>}

      <button
        type="button"
        onClick={() =>
          createHiking.mutate({
            name: "Dolomites 2026",
            daysTotal: 7,
            membersTotal: 4,
            vegetariansTotal: 1,
          })
        }
        disabled={createHiking.isPending}
      >
        Create hiking
      </button>

      <button
        type="button"
        onClick={() =>
          addFromRecipe.mutate({
            hikingId,
            payload: {
              recipeId: "r1b2c3d4-1111-4111-8111-111111111111",
              dayNumber: 1,
              eatingTimeId: "e5f6a7b8-5555-4555-8555-555555555555",
            },
          })
        }
        disabled={addFromRecipe.isPending}
      >
        Add from recipe
      </button>
    </div>
  );
}
```

After `useCreateHiking` or `useAddHikingProductsFromRecipe` succeeds, hiking list and detail queries are invalidated so the UI can refetch.

### Update hiking product quantities

`useUpdateHikingProduct` — `PATCH /hikings/:hikingId/hiking-products/:hikingProductId`. Invalidates the hiking detail on success.

```tsx
import { useUpdateHikingProduct } from "@/hooks";

function QuantityEditor({ hikingId, hikingProductId }: { hikingId: string; hikingProductId: string }) {
  const { mutate, isPending } = useUpdateHikingProduct();

  return (
    <button
      type="button"
      onClick={() =>
        mutate({
          hikingId,
          hikingProductId,
          payload: { personalQuantity: 85, totalQuantity: 340 },
        })
      }
      disabled={isPending}
    >
      {isPending ? "Saving…" : "Update quantities"}
    </button>
  );
}
```

### Add a product directly to a hiking plan

`useAddHikingProduct` — `POST /hikings/:id/hiking-products`. Invalidates the hiking detail on success. `recipeId` can be `null` when the product is not tied to a recipe.

```tsx
import { useAddHikingProduct } from "@/hooks";

function AddProductButton({ hikingId }: { hikingId: string }) {
  const { mutate, isPending } = useAddHikingProduct();

  return (
    <button
      type="button"
      onClick={() =>
        mutate({
          hikingId,
          payload: {
            dayNumber: 1,
            eatingTimeId: "e5f6a7b8-5555-4555-8555-555555555555",
            productId: "sugar-1111-4111-8111-111111111111",
            personalQuantity: 85,
            totalQuantity: 340,
            recipeId: null,
          },
        })
      }
      disabled={isPending}
    >
      {isPending ? "Adding…" : "Add product"}
    </button>
  );
}
```

### Grant admin access to a hiking plan

`useAddHikingAdmin` — `POST /hikings/:id/admins`. Invalidates the hiking detail on success.

```tsx
import { useAddHikingAdmin } from "@/hooks";

function AddAdminButton({ hikingId }: { hikingId: string }) {
  const { mutate, isPending } = useAddHikingAdmin();

  return (
    <button
      type="button"
      onClick={() =>
        mutate({
          hikingId,
          payload: { userId: "a1b2c3d4-e5f6-4789-a012-345678901234" },
        })
      }
      disabled={isPending}
    >
      {isPending ? "Adding…" : "Add admin"}
    </button>
  );
}
```

## Toast (React Toastify)

Use the shared helpers in components or any TS file. Import from `@/lib/toast`.

**Examples:**

```tsx
import { toastInfo, toastWarning, toastError, toastSuccess } from "@/lib/toast";

// Info
toastInfo("Profile updated");

// Warning
toastWarning("Unsaved changes will be lost");

// Error
toastError("Failed to save");

// Success
toastSuccess("Product created");
```

**With options:**

```tsx
toastError("Server error", { autoClose: 10000 });
toastSuccess("Saved", { position: "bottom-center" });
```

**Advanced (dismiss, update):**

```tsx
import { toast } from "@/lib/toast";

const id = toast.info("Loading…");
// later:
toast.dismiss(id);
// or toast.update(id, { render: "Done!" });
```

## Project structure (main parts)

```
src/
  api/           # API functions (products, recipes, hikings, …)
  components/    # UI and forms (CreateProductForm, ProductsList, layout)
  hooks/         # use-products.ts (useProducts + useCreateProduct), useAuth, useTheme
  lib/           # api-client, auth-client, auth-token, toast, utils
  pages/         # Route pages (HomePage, ProductsPage)
  providers/     # AuthProvider, ThemeProvider
  schemas/       # Zod schemas (e.g. createProductSchema)
  types/         # Shared types (auth, product)
```
