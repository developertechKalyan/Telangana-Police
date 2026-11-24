import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";

// Home is loaded up front (it is the landing page); every other page is downloaded only when visited.
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));
const Services = lazy(() => import("@/pages/Services").then((m) => ({ default: m.Services })));
const ReachUs = lazy(() => import("@/pages/ReachUs").then((m) => ({ default: m.ReachUs })));
const WhenToCall = lazy(() => import("@/pages/WhenToCall").then((m) => ({ default: m.WhenToCall })));
const WhatHappens = lazy(() => import("@/pages/WhatHappens").then((m) => ({ default: m.WhatHappens })));
const FindYou = lazy(() => import("@/pages/FindYou").then((m) => ({ default: m.FindYou })));
const CitizenResources = lazy(() => import("@/pages/CitizenResources").then((m) => ({ default: m.CitizenResources })));
const Gallery = lazy(() => import("@/pages/Gallery").then((m) => ({ default: m.Gallery })));
const Contact = lazy(() => import("@/pages/Contact").then((m) => ({ default: m.Contact })));
const Weather = lazy(() => import("@/pages/Weather").then((m) => ({ default: m.Weather })));
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword").then((m) => ({ default: m.ForgotPassword })));
const AdminGallery = lazy(() => import("@/pages/AdminGallery").then((m) => ({ default: m.AdminGallery })));

function PageFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

function page(content: ReactNode) {
  return (
    <Suspense fallback={<PageFallback />}>
      <PageTransition>{content}</PageTransition>
    </Suspense>
  );
}

const INTRO_SEEN_KEY = "dial112-intro-seen";

/**
 * The dialling intro plays once per browser visit. Reloads and links opened later in the same
 * visit go straight to the page, and visitors who ask for reduced motion skip it entirely.
 */
function shouldPlayIntro(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(shouldPlayIntro);

  // Stable callback so the intro's timers aren't restarted when App re-renders.
  // It deliberately does NOT navigate: the visitor stays on whatever page they opened.
  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // storage unavailable (private mode): the intro may simply play again next time
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AuthProvider>
      {isLoading && (
        <LoadingScreen onComplete={finishIntro} />
      )}
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={page(<Home />)} />
            <Route path="/about" element={page(<About />)} />
            <Route path="/services" element={page(<Services />)} />
            <Route path="/reach-us" element={page(<ReachUs />)} />
            <Route path="/when-to-call" element={page(<WhenToCall />)} />
            <Route path="/what-happens" element={page(<WhatHappens />)} />
            <Route path="/find-you" element={page(<FindYou />)} />
            <Route path="/resources" element={page(<CitizenResources />)} />
            <Route path="/gallery" element={page(<Gallery />)} />
            <Route path="/contact" element={page(<Contact />)} />
            <Route path="/weather" element={page(<Weather />)} />
            <Route path="/login" element={page(<Login />)} />
            <Route path="/forgot-password" element={page(<ForgotPassword />)} />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  {page(<AdminGallery />)}
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </AuthProvider>
  );
}

export default App;
