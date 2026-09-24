import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, User, Sprout, Package, Warehouse,
  Tractor, Store, Wallet, Users, Boxes,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const NAV_BY_ROLE = {
  farmer: [
    { to: "/farmer/profile", label: "My Profile", icon: User },
    { to: "/farmer/crop-plans", label: "Crop Plans", icon: Sprout },
    { to: "/farmer/procurement", label: "Procurement", icon: Package },
    { to: "/farmer/inventory", label: "My Inventory", icon: Boxes },
    { to: "/equipment", label: "Equipment", icon: Tractor },
    { to: "/farmer/listings", label: "My Listings", icon: Store },
    { to: "/farmer/payments", label: "My Payments", icon: Wallet },
  ],
  supplier: [
    { to: "/supplier/catalog", label: "My Catalog", icon: Package },
    { to: "/supplier/orders", label: "Incoming Orders", icon: Boxes },
  ],
  buyer: [
    { to: "/marketplace", label: "Marketplace", icon: Store },
  ],
  equipment_owner: [
    { to: "/equipment", label: "Equipment", icon: Tractor },
  ],
  cooperative_manager: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/farmers", label: "Farmers", icon: Users },
    { to: "/admin/crops", label: "Crop Catalog", icon: Sprout },
    { to: "/admin/warehouses", label: "Warehouses", icon: Warehouse },
    { to: "/admin/procurement", label: "Procurement", icon: Package },
    { to: "/admin/payments", label: "Payments", icon: Wallet },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/farmers", label: "Farmers", icon: Users },
    { to: "/admin/crops", label: "Crop Catalog", icon: Sprout },
    { to: "/admin/warehouses", label: "Warehouses", icon: Warehouse },
    { to: "/admin/procurement", label: "Procurement", icon: Package },
    { to: "/admin/payments", label: "Payments", icon: Wallet },
  ],
};

export default function Sidebar() {
  const { user } = useAuthStore();
  const items = NAV_BY_ROLE[user?.role] || [];

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-forest text-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <span className="text-xl">🌾</span>
        <span className="font-display text-lg font-semibold">AgriSphere</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-gold text-forest font-medium" : "text-white/80 hover:bg-white/10"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 text-xs text-white/40 border-t border-white/10">
        Phase 1 · Core ERP
      </div>
    </aside>
  );
}
