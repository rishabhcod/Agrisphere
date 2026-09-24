import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import CropPlans from "./pages/farmer/CropPlans";
import FarmerProcurement from "./pages/farmer/FarmerProcurement";
import FarmerInventory from "./pages/farmer/FarmerInventory";
import FarmerListings from "./pages/farmer/FarmerListings";
import FarmerPayments from "./pages/farmer/FarmerPayments";
import EquipmentPage from "./pages/equipment/EquipmentPage";
import Marketplace from "./pages/marketplace/Marketplace";
import SupplierCatalog from "./pages/supplier/SupplierCatalog";
import SupplierOrders from "./pages/supplier/SupplierOrders";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminCrops from "./pages/admin/AdminCrops";
import AdminWarehouses from "./pages/admin/AdminWarehouses";
import AdminProcurement from "./pages/admin/AdminProcurement";
import AdminPayments from "./pages/admin/AdminPayments";
import NotFound from "./pages/NotFound";

// After login, send each role to the page that makes sense for them,
// instead of a generic landing page that might be blank for some roles.
function RoleHome() {
  const role = useAuthStore((s) => s.user?.role);
  const map = {
    farmer: "/farmer/profile",
    cooperative_manager: "/dashboard",
    admin: "/dashboard",
    supplier: "/supplier/catalog",
    buyer: "/marketplace",
    equipment_owner: "/equipment",
    logistics_partner: "/equipment",
  };
  return <Navigate to={map[role] || "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<RoleHome />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><Dashboard /></ProtectedRoute>
          } handle={{ title: "Dashboard" }} />

          <Route path="/farmer/profile" element={
            <ProtectedRoute roles={["farmer"]}><FarmerProfile /></ProtectedRoute>
          } handle={{ title: "My Profile" }} />
          <Route path="/farmer/crop-plans" element={
            <ProtectedRoute roles={["farmer"]}><CropPlans /></ProtectedRoute>
          } handle={{ title: "Crop Plans" }} />
          <Route path="/farmer/procurement" element={
            <ProtectedRoute roles={["farmer"]}><FarmerProcurement /></ProtectedRoute>
          } handle={{ title: "Procurement" }} />
          <Route path="/farmer/inventory" element={
            <ProtectedRoute roles={["farmer"]}><FarmerInventory /></ProtectedRoute>
          } handle={{ title: "My Inventory" }} />
          <Route path="/farmer/listings" element={
            <ProtectedRoute roles={["farmer"]}><FarmerListings /></ProtectedRoute>
          } handle={{ title: "My Listings" }} />
          <Route path="/farmer/payments" element={
            <ProtectedRoute roles={["farmer"]}><FarmerPayments /></ProtectedRoute>
          } handle={{ title: "My Payments" }} />

          <Route path="/equipment" element={
            <ProtectedRoute roles={["farmer", "equipment_owner"]}><EquipmentPage /></ProtectedRoute>
          } handle={{ title: "Equipment" }} />

          <Route path="/marketplace" element={
            <ProtectedRoute roles={["buyer", "farmer", "cooperative_manager", "admin"]}><Marketplace /></ProtectedRoute>
          } handle={{ title: "Marketplace" }} />

          <Route path="/supplier/catalog" element={
            <ProtectedRoute roles={["supplier"]}><SupplierCatalog /></ProtectedRoute>
          } handle={{ title: "My Catalog" }} />
          <Route path="/supplier/orders" element={
            <ProtectedRoute roles={["supplier"]}><SupplierOrders /></ProtectedRoute>
          } handle={{ title: "Incoming Orders" }} />

          <Route path="/admin/farmers" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><AdminFarmers /></ProtectedRoute>
          } handle={{ title: "Farmers" }} />
          <Route path="/admin/crops" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><AdminCrops /></ProtectedRoute>
          } handle={{ title: "Crop Catalog" }} />
          <Route path="/admin/warehouses" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><AdminWarehouses /></ProtectedRoute>
          } handle={{ title: "Warehouses" }} />
          <Route path="/admin/procurement" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><AdminProcurement /></ProtectedRoute>
          } handle={{ title: "Procurement" }} />
          <Route path="/admin/payments" element={
            <ProtectedRoute roles={["cooperative_manager", "admin"]}><AdminPayments /></ProtectedRoute>
          } handle={{ title: "Payments" }} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
