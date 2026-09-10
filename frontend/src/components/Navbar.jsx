import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/tentang", label: "Tentang RNI" },
  { to: "/pendaftaran", label: "Pendaftaran" },
  { to: "/admin/login", label: "Administrator" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-rni-green text-rni-cream shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-serif font-bold text-lg text-rni-gold-light">
          <span className="text-xl">★</span>
          Republik Nusa Indah
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-rni-gold-light ${
                  isActive ? "text-rni-gold-light" : "text-rni-cream/90"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded hover:bg-rni-green-light"
          onClick={() => setOpen((o) => !o)}
          aria-label="Buka menu"
        >
          <span className="block w-6 h-0.5 bg-rni-cream mb-1"></span>
          <span className="block w-6 h-0.5 bg-rni-cream mb-1"></span>
          <span className="block w-6 h-0.5 bg-rni-cream"></span>
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-rni-green-light px-4 pb-4 flex flex-col gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-2 ${isActive ? "text-rni-gold-light" : "text-rni-cream/90"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
