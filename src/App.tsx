import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminIndexRedirect, AdminLayout } from "@/components/admin/layout";
import {
  AboutPage,
  CategoriesPage,
  HikingDetailPage,
  HikingsPage,
  HomePage,
  ProductsPage,
  RecipeDetailPage,
  RecipesPage,
} from "./pages";
import { FeatureCreatePage, FeatureDetailPage, FeatureEditPage, FeaturesPage } from "@/pages/admin";
import { routes } from "@/config/nav";
import { Layout } from "./components/";
import { AuthProvider } from "./providers/auth-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark">
            <Layout>
              <Routes>
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.products} element={<ProductsPage />} />
                <Route path={routes.categories} element={<CategoriesPage />} />
                <Route path={routes.recipeDetail} element={<RecipeDetailPage />} />
                <Route path={routes.recipes} element={<RecipesPage />} />
                <Route path={routes.hikingDetail} element={<HikingDetailPage />} />
                <Route path={routes.hikings} element={<HikingsPage />} />
                <Route path={routes.about} element={<AboutPage />} />
                <Route path={routes.admin} element={<AdminLayout />}>
                  <Route index element={<AdminIndexRedirect />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="features/new" element={<FeatureCreatePage />} />
                  <Route path="features/:id" element={<FeatureDetailPage />} />
                  <Route path="features/:id/edit" element={<FeatureEditPage />} />
                </Route>
              </Routes>
            </Layout>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer theme="dark" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
