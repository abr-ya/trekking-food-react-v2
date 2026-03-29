import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  CategoriesPage,
  HikingDetailPage,
  HikingsPage,
  HomePage,
  ProductsPage,
  RecipeDetailPage,
  RecipesPage,
} from "./pages";
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
