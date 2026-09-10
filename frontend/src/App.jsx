import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Beranda from "./pages/Beranda";
import TentangRNI from "./pages/TentangRNI";
import Pendaftaran from "./pages/Pendaftaran";
import KTP from "./pages/KTP";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Members from "./pages/admin/Members";
import MemberDetail from "./pages/admin/MemberDetail";
import MemberEdit from "./pages/admin/MemberEdit";

export default function App() {
  return (
    <Routes>
      {/* Halaman publik, pakai Navbar + Footer */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Beranda />
          </PublicLayout>
        }
      />
      <Route
        path="/tentang"
        element={
          <PublicLayout>
            <TentangRNI />
          </PublicLayout>
        }
      />
      <Route
        path="/pendaftaran"
        element={
          <PublicLayout>
            <Pendaftaran />
          </PublicLayout>
        }
      />
      <Route
        path="/ktp/:id"
        element={
          <PublicLayout>
            <KTP />
          </PublicLayout>
        }
      />

      {/* Halaman admin, tanpa Navbar/Footer publik */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members/:id"
        element={
          <ProtectedRoute>
            <MemberDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members/:id/edit"
        element={
          <ProtectedRoute>
            <MemberEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
