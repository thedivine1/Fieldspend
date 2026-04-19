import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "sonner";

// Lazy pages
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const UploadPage = lazy(() => import("@/pages/UploadPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

const queryClient = new QueryClient();

// ─── Root Layout Component ────────────────────────────────────────────────────

function RootComponent() {
  const { initStore, loadReceipts, loadProfile } = useAppStore();

  useEffect(() => {
    initStore();
    loadReceipts();
    loadProfile();
  }, [initStore, loadReceipts, loadProfile]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm animate-pulse">
            Loading…
          </div>
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const isOnboardingComplete =
      localStorage.getItem("sep_onboarding_complete") === "true";
    if (!isOnboardingComplete) {
      throw redirect({ to: "/onboarding" });
    }
    throw redirect({ to: "/gallery" });
  },
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => <OnboardingPage />,
});

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: () => (
    <LayoutWrapper>
      <GalleryPage />
    </LayoutWrapper>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: () => (
    <LayoutWrapper>
      <UploadPage />
    </LayoutWrapper>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <LayoutWrapper>
      <ReportsPage />
    </LayoutWrapper>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <LayoutWrapper>
      <SettingsPage />
    </LayoutWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  galleryRoute,
  uploadRoute,
  reportsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
