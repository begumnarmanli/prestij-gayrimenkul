import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import HomePage from "./pages/HomePage/HomePage";
import ListingsPage from "./pages/ListingsPage/ListingsPage";
import AgentsPage from "./pages/AgentsPage/AgentsPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ListingDetailPage from "./pages/ListingDetailPage/ListingDetailPage";
import Statistics from "./components/Statistics/Statistics";

if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

function App() {
  return (
    <BrowserRouter>
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
