import { useEffect, useState } from "react";
import { procurementApi } from "../../api/procurementApi";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    procurementApi.getIncomingOrders().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    await procurementApi.updateOrderStatus(id, status);
    load();
  };

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Orders farmers have placed against your catalog.</p>
      <DataTable
        loading={loading}
        emptyMessage="No incoming orders yet."
        columns={[
          { key: "procurement_order_id", label: "Order #" },
          { key: "total_amount", label: "Total", render: (r) => `₹${r.total_amount}` },
          { key: "order_date", label: "Date", render: (r) => new Date(r.order_date).toLocaleDateString() },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
        ]}
        rows={orders}
        actions={(row) => (
          row.status === "pending" ? (
            <div className="flex justify-end gap-2">
              <button onClick={() => handleStatusChange(row.procurement_order_id, "approved")} className="text-xs text-leaf hover:underline">Approve</button>
              <button onClick={() => handleStatusChange(row.procurement_order_id, "cancelled")} className="text-xs text-rust hover:underline">Cancel</button>
            </div>
          ) : row.status === "approved" ? (
            <button onClick={() => handleStatusChange(row.procurement_order_id, "delivered")} className="text-xs text-gold hover:underline">Mark Delivered</button>
          ) : null
        )}
      />
    </div>
  );
}
