import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const ListingsPage = lazy(() => import("./pages/ListingsPage/ListingsPage"));
const AgentsPage = lazy(() => import("./pages/AgentsPage/AgentsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const ListingDetailPage = lazy(() => import("./pages/ListingDetailPage/ListingDetailPage"));
const Statistics = lazy(() => import("./components/Statistics/Statistics"));

if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "14px",
          borderRadius: "16px",
          background: "#0f1c3a",
          color: "var(--color-white)",
        }}
        progressStyle={{
          background: "var(--color-primary)",
        }}
      />
    </BrowserRouter>
  );
}

export default App;