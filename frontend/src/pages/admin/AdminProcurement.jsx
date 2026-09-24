import { useEffect, useState } from "react";
import { procurementApi } from "../../api/procurementApi";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function AdminProcurement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    procurementApi.getAllOrders().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Every procurement order across the cooperative.</p>
      <DataTable
        loading={loading}
        emptyMessage="No procurement orders yet."
        columns={[
          { key: "procurement_order_id", label: "Order #" },
          { key: "company_name", label: "Supplier" },
          { key: "total_amount", label: "Total", render: (r) => `₹${r.total_amount}` },
          { key: "order_date", label: "Date", render: (r) => new Date(r.order_date).toLocaleDateString() },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
        ]}
        rows={orders}
      />
    </div>
  );
}
