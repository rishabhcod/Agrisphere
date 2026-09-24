import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const ROLE_LABELS = {
  farmer: "Farmer",
  cooperative_manager: "Cooperative Manager",
  equipment_owner: "Equipment Owner",
  logistics_partner: "Logistics Partner",
  buyer: "Buyer",
  supplier: "Supplier",
  admin: "Admin",
};

export default function Topbar({ title }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-4">
      <h1 className="text-xl font-display font-semibold text-ink">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{user?.fullName}</p>
          <p className="text-xs text-muted">{ROLE_LABELS[user?.role] || user?.role}</p>
        </div>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="flex items-center gap-1.5 rounded border border-line px-3 py-1.5 text-sm text-muted hover:text-rust hover:border-rust/40 transition-colors"
        >
          <LogOut size={15} /> Log out
        </button>
      </div>
    </header>
  );
}
