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

- **Products:** `GET /products`, `POST /products` (with auth token).
- **Hooks:** `useProducts()`, `useCreateProduct()` from `@/hooks`. Creating a product invalidates the products list automatically.

**Example – list products and create one:**

```tsx
import { useProducts, useCreateProduct } from "@/hooks";

function Products() {
  const { data: products, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
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
  api/           # API functions (getProducts, postProduct)
  components/    # UI and forms (CreateProductForm, ProductsList, layout)
  hooks/         # useAuth, useProducts, useCreateProduct, useTheme
  lib/           # api-client, auth-client, auth-token, toast, utils
  pages/         # Route pages (HomePage, ProductsPage)
  providers/     # AuthProvider, ThemeProvider
  schemas/       # Zod schemas (e.g. createProductSchema)
  types/         # Shared types (auth, product)
```
