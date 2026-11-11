import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { ReachUs } from "@/pages/ReachUs";
import { WhenToCall } from "@/pages/WhenToCall";
import { WhatHappens } from "@/pages/WhatHappens";
import { FindYou } from "@/pages/FindYou";
import { CitizenResources } from "@/pages/CitizenResources";
import { Gallery } from "@/pages/Gallery";
import { Contact } from "@/pages/Contact";
import { Weather } from "@/pages/Weather";
import { Login } from "@/pages/Login";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { AdminGallery } from "@/pages/AdminGallery";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AuthProvider>
      {isLoading && (
        <LoadingScreen
          onComplete={() => {
            setIsLoading(false);
            navigate("/", { replace: true });
          }}
        />
      )}
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/reach-us" element={<PageTransition><ReachUs /></PageTransition>} />
            <Route path="/when-to-call" element={<PageTransition><WhenToCall /></PageTransition>} />
            <Route path="/what-happens" element={<PageTransition><WhatHappens /></PageTransition>} />
            <Route path="/find-you" element={<PageTransition><FindYou /></PageTransition>} />
            <Route path="/resources" element={<PageTransition><CitizenResources /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/weather" element={<PageTransition><Weather /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <PageTransition><AdminGallery /></PageTransition>
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
