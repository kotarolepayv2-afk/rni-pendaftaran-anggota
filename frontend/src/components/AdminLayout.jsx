import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../api/client";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/members", label: "Anggota" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-rni-cream">
      <div className="bg-rni-green text-rni-cream">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/admin" className="font-serif font-bold text-rni-gold-light">
            RNI Administrator
          </Link>
          <nav className="flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-rni-gold-light" : "text-rni-cream/80"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="text-sm font-medium text-rni-cream/80 hover:text-rni-gold-light">
              Logout
            </button>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10">{children}</div>
    </div>
  );
}
