import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Maps each route path to the title shown in the Topbar. Using a
// plain lookup keyed by pathname instead of React Router's
// useMatches/handle system, since useMatches only works with the
// newer "data router" (createBrowserRouter) setup - this app uses
// the classic <BrowserRouter>, where useMatches throws and crashes
// the page (that was the bug causing the blank screen after login).
const TITLES = {
  "/dashboard": "Dashboard",
  "/farmer/profile": "My Profile",
  "/farmer/crop-plans": "Crop Plans",
  "/farmer/procurement": "Procurement",
  "/farmer/inventory": "My Inventory",
  "/farmer/listings": "My Listings",
  "/farmer/payments": "My Payments",
  "/equipment": "Equipment",
  "/marketplace": "Marketplace",
  "/supplier/catalog": "My Catalog",
  "/supplier/orders": "Incoming Orders",
  "/admin/farmers": "Farmers",
  "/admin/crops": "Crop Catalog",
  "/admin/warehouses": "Warehouses",
  "/admin/procurement": "Procurement",
  "/admin/payments": "Payments",
};

export default function AppLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "AgriSphere";

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
