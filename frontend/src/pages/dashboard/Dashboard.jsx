import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { dashboardApi } from "../../api/dashboardApi";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getSummary()
      .then(({ data }) => setSummary(data.summary))
      .catch((err) => setError(err.response?.data?.error || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={32} /></div>;
  }

  if (error) {
    return <div className="card border-rust/30 bg-rust/5 p-6 text-rust">{error}</div>;
  }

  const chartData = [
    { name: "Farmers", value: summary.totalFarmers },
    { name: "Listings", value: summary.activeMarketplaceListings },
    { name: "Pending Orders", value: summary.pendingProcurementOrders },
    { name: "Bookings", value: summary.activeEquipmentBookings },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Farmers" value={summary.totalFarmers} accent="forest" />
        <StatCard label="Active Listings" value={summary.activeMarketplaceListings} accent="leaf" />
        <StatCard label="Pending Procurement" value={summary.pendingProcurementOrders} accent="gold" />
        <StatCard label="Payments This Month" value={`₹${summary.paymentsThisMonth.toLocaleString()}`} accent="soil" />
        <StatCard label="Inventory In Storage" value={`${summary.totalInventoryInStorageKg.toLocaleString()} kg`} accent="leaf" />
        <StatCard label="Active Bookings" value={summary.activeEquipmentBookings} accent="rust" />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-medium text-muted uppercase tracking-wide">Overview</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DBDFD2" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7563" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7563" }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#B9832F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
