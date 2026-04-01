# Trekking Food — Business Logic

## 📋 Overview

A meal planning system for hiking trips. Allows creating a product catalog, building recipes, creating hiking plans, and distributing products across days and meal times.

---

## 🎯 Core Entities

### 1. Product

**Purpose:** A food unit with nutritional value and cost.

**Attributes:**
- `id` — unique identifier
- `name` — name (min. 3 characters)
- `kkal` — calories per 100g (≥ 0)
- `proteins` — proteins per 100g (≥ 0)
- `fats` — fats per 100g (≥ 0)
- `carbohydrates` — carbohydrates per 100g (≥ 0)
- `price` — price per 100g (≥ 0)
- `isVegetarian` — vegetarian product flag
- `productCategoryId` — reference to category
- `isCommon` — shared product flag (available to all users)
- `userId` — product owner (optional)

**Business Rules:**
- Product name must be unique within a user's products
- Product category is required on creation
- All nutritional values cannot be negative
- Product can be shared (`isCommon: true`) or personal (`isCommon: false`)

---

### 2. Product Category

**Purpose:** Grouping products by type.

**Attributes:**
- `id` — unique identifier
- `name` — category name
- `products` — list of products in the category

**Business Rules:**
- Category can contain products from different users
- Deleting a category does not delete associated products (they remain without a category)

---

### 3. Recipe

**Purpose:** A ready set of products with proportions for preparing a dish.

**Attributes:**
- `id` — unique identifier
- `name` — recipe name
- `description` — preparation description
- `categoryId` — recipe category
- `isCommon` — shared recipe flag
- `ingredients` — array of ingredients
- `userId` — recipe owner

**Recipe Ingredient:**
- `productId` — reference to product
- `quantity` — product amount in grams per 1 serving

**Business Rules:**
- Recipe must contain at least 1 ingredient
- Each ingredient quantity must be > 0
- Recipe category is required
- Recipe can be shared or personal

---

### 4. Hiking

**Purpose:** A meal plan for a specific hiking trip.

**Attributes:**
- `id` — unique identifier
- `name` — hiking name (min. 3 characters)
- `daysTotal` — total number of days (≥ 1)
- `membersTotal` — total number of members (≥ 1)
- `vegetariansTotal` — number of vegetarians (≥ 0, ≤ `membersTotal`)
- `userId` — hiking creator
- `admins` — list of administrators with editing rights
- `hiking_products` — list of products in the plan

**Business Rules:**
- Number of vegetarians cannot exceed total members
- Hiking must have at least 1 day
- Hiking must have at least 1 member
- Hiking creator automatically becomes an administrator
- Administrators can add/remove products from the plan

---

### 5. Hiking Product

**Purpose:** A specific product added to the meal plan for a specific day and meal time.

**Attributes:**
- `id` — unique identifier
- `hiking_id` — reference to hiking
- `day_number` — day number (1-based)
- `eating_time_id` — reference to meal time
- `eating_time_name` — meal time name
- `product_id` — reference to product
- `product_name` — product name
- `recipe_id` — reference to recipe (optional, null if product added separately)
- `recipe_name` — recipe name (optional)
- `personal_quantity` — amount per 1 person in grams
- `total_quantity` — total amount in grams (0 = not calculated)

**Business Rules:**
- `day_number` must be in range 1 to `daysTotal` of the hiking
- `personal_quantity` must be > 0
- `total_quantity` must be ≥ 0
- If `total_quantity > 0`, it must be > `personal_quantity`
- Product can be added from a recipe or independently
- When added from a recipe, quantity is calculated automatically

---

### 6. Eating Time

**Purpose:** Reference directory of meal times.

**Attributes:**
- `id` — unique identifier
- `name` — name (e.g., "Breakfast", "Lunch", "Dinner")

**Business Rules:**
- System directory, populated on deployment
- All hikings use the same meal times

---

### 7. Hiking Admin

**Purpose:** A user with rights to edit the hiking plan.

**Attributes:**
- `id` — unique identifier
- `name` — user name
- `email` — user email
- `image` — avatar (optional)

**Business Rules:**
- Hiking creator cannot be removed from administrators
- Administrator can add other administrators
- Administrator can edit the product plan

---

## 🔐 Role Model

### User Roles

| Role | Permissions |
|------|-------------|
| **Anonymous** | View public products, recipes, categories |
| **Authenticated** | Create personal products, recipes, hikings |
| **Owner** | Full control over own entities |
| **Hiking Admin** | Edit specific hiking plan |

### Entity Access Rights

| Entity | Read | Create | Edit | Delete |
|--------|------|--------|------|--------|
| **Product (personal)** | All | Authenticated | Owner | Owner |
| **Product (shared)** | All | Authenticated | System only | System only |
| **Recipe (personal)** | All | Authenticated | Owner | Owner |
| **Recipe (shared)** | All | Authenticated | System only | System only |
| **Hiking** | All + admins | Authenticated | Owner + admins | Owner |
| **Category** | All | System | System | System |

---

## 📊 Business Processes

### 1. Create Product

**Participants:** Authenticated user

**Steps:**
1. User fills in the product form
2. System validates data:
   - Name ≥ 3 characters
   - Category selected
   - All numeric values ≥ 0
3. System determines product type:
   - `isCommon: true` — shared product (available to all)
   - `isCommon: false` — personal product (visible to all, editable by owner)
4. Product is saved to database
5. Products list is refreshed

**Validation:**
```typescript
{
  name: string (min. 3 characters),
  kkal: number (≥ 0),
  proteins: number (≥ 0),
  fats: number (≥ 0),
  carbohydrates: number (≥ 0),
  price: number (≥ 0),
  isVegetarian: boolean,
  productCategoryId: string (non-empty),
  isCommon: boolean
}
```

---

### 2. Create Recipe

**Participants:** Authenticated user

**Steps:**
1. User fills in the recipe form
2. User adds ingredients (minimum 1):
   - Selects a product from the catalog
   - Specifies quantity in grams (> 0)
3. System validates data
4. Recipe is saved along with ingredients
5. Recipes list is refreshed

**Validation:**
```typescript
{
  name: string (non-empty),
  categoryId: string (non-empty),
  description: string (non-empty),
  ingredients: [
    { productId: string, quantity: number (> 0) }
  ] (minimum 1),
  isCommon: boolean
}
```

---

### 3. Create Hiking

**Participants:** Authenticated user

**Steps:**
1. User fills in the hiking form
2. System validates data:
   - Name ≥ 3 characters
   - Days ≥ 1
   - Members ≥ 1
   - Vegetarians ≥ 0 and ≤ members
3. Hiking is created with an empty product plan
4. User automatically becomes an administrator
5. Hikings list is refreshed

**Validation:**
```typescript
{
  name: string (min. 3 characters),
  daysTotal: number (≥ 1),
  membersTotal: number (≥ 1),
  vegetariansTotal: number (≥ 0, ≤ membersTotal)
}
```

**Cross-validation:**
```typescript
if (vegetariansTotal > membersTotal) {
  error: "Cannot exceed group size"
}
```

---

### 4. Add Product to Hiking Plan

**Participants:** Hiking owner or administrator

**Steps:**
1. User selects a day (1..daysTotal)
2. User selects a meal time
3. User selects a product from the catalog
4. User specifies:
   - `personalQuantity` — amount per 1 person (> 0)
   - `totalQuantity` — total amount (≥ 0, or 0 for auto-calculation)
5. System validates:
   - Product is selected
   - `personalQuantity > 0`
   - `totalQuantity === 0` OR `totalQuantity > personalQuantity`
6. Product is added to the plan
7. Hiking plan is refreshed

**Validation:**
```typescript
{
  product: { label: string, value: string } (not null),
  personalQuantity: number (> 0),
  totalQuantity: number (≥ 0)
}
```

**Cross-validation:**
```typescript
if (totalQuantity !== 0 && totalQuantity <= personalQuantity) {
  error: "Total quantity must be greater than personal quantity (or 0)"
}
```

---

### 5. Add Recipe to Hiking Plan

**Participants:** Hiking owner or administrator

**Steps:**
1. User selects a recipe
2. User selects a day (1..daysTotal)
3. User selects a meal time
4. System automatically calculates quantities:
   - For each recipe ingredient:
     - `personalQuantity` = quantity from recipe
     - `totalQuantity` = `personalQuantity × membersTotal`
5. All recipe products are added to the plan
6. Hiking plan is refreshed

**Parameters:**
```typescript
{
  recipeId: string,
  dayNumber: number (1..daysTotal),
  eatingTimeId: string
}
```

---

### 6. Edit Product Quantity in Plan

**Participants:** Hiking owner or administrator

**Steps:**
1. User changes `personalQuantity` and/or `totalQuantity`
2. System validates new values
3. Data is updated
4. Hiking plan is refreshed

**Parameters:**
```typescript
{
  hikingId: string,
  hikingProductId: string,
  payload: {
    personalQuantity?: number,
    totalQuantity?: number
  }
}
```

---

### 7. Add Hiking Administrator

**Participants:** Hiking owner or current administrator

**Steps:**
1. User selects a user to add
2. System checks current user's permissions
3. User is added to the administrators list
4. Hiking data is refreshed

**Parameters:**
```typescript
{
  hikingId: string,
  payload: {
    userId: string
  }
}
```

---

## 🧮 Calculation Formulas

### Total Product Quantity

If `totalQuantity === 0`, the system can calculate it automatically:

```
totalQuantity = personalQuantity × membersTotal
```

Where:
- `personalQuantity` — amount per 1 person (g)
- `membersTotal` — total number of hiking members

### Total Products per Hiking

For a report on all products in the hiking:

```
Total per product = Σ(totalQuantity) for all entries with this productId
```

---

## 📁 Data Structure

### Entity Hierarchy

```
User
├── Products (personal and shared)
├── Recipes (personal and shared)
│   └── Ingredients
│       └── Product (reference)
└── Hikings (created)
    ├── Admins (list of users)
    └── HikingProducts
        ├── Product (reference)
        ├── EatingTime (reference)
        └── Recipe (optional, reference)
```

### Table Relationships

| From | To | Relationship Type |
|------|-----|---------------------|
| Product | ProductCategory | Many-to-One |
| Product | User | Many-to-One (owner) |
| Recipe | RecipeCategory | Many-to-One |
| Recipe | User | Many-to-One (owner) |
| RecipeIngredient | Recipe | Many-to-One |
| RecipeIngredient | Product | Many-to-One |
| Hiking | User | Many-to-One (creator) |
| HikingAdmin | Hiking | Many-to-One |
| HikingAdmin | User | Many-to-One |
| HikingProduct | Hiking | Many-to-One |
| HikingProduct | Product | Many-to-One |
| HikingProduct | EatingTime | Many-to-One |
| HikingProduct | Recipe | Many-to-One (optional) |

---

## ⚙️ Technical Features

### Data Normalization

API returns data in `snake_case`, client works with `camelCase`:

```typescript
// API → Client
{
  is_vegetarian: true,      →  isVegetarian: true
  product_category_id: "…"  →  productCategoryId: "…"
}
```

### Data Caching

| Entity | Stale Time | Note |
|--------|------------|------|
| Products | 2 minutes | Invalidation after mutation |
| Hikings | 2 minutes | Invalidation after mutation |
| Recipes | 2 minutes | Invalidation after mutation |
| Categories | 5 minutes | Rarely change |
| EatingTimes | Infinite | System directory |

### Notifications

| Event | Type | Message |
|-------|------|---------|
| Successful creation | Success | "Product created" |
| Save error | Error | "Failed to save" |
| Profile update | Info | "Profile updated" |
| Warning | Warning | "Unsaved changes will be lost" |

---

## 🎯 Use Cases

### Use Case 1: Hiking Planning with Recipes

1. Create products (or use shared ones)
2. Create recipes from products
3. Create a hiking with group parameters
4. Add recipes to days and meal times
5. Add individual products if needed
6. Adjust quantities manually

### Use Case 2: Collaborative Planning

1. User A creates a hiking
2. User A adds User B as an administrator
3. User B gets access to edit the plan
4. Both users can add/modify products

### Use Case 3: Using Vegetarian Products

1. Specify the number of vegetarians when creating a hiking
2. Select vegetarian recipes when adding
3. System accounts for this in total quantity calculation

---

*Document created: April 1, 2026*
