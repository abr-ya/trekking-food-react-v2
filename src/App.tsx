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
                <Route path="/" element={<HomePage />} />
                <Route path="/products/" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/hikings/:id" element={<HikingDetailPage />} />
                <Route path="/hikings" element={<HikingsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminLayout />}>
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
