import { useEffect, useState } from "react";
import { paymentApi } from "../../api/paymentApi";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    paymentApi.getAll().then(({ data }) => setPayments(data.payments)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkCompleted = async (id) => {
    await paymentApi.updateStatus(id, "completed");
    load();
  };

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Every payment across marketplace orders, procurement, and equipment rentals.</p>
      <DataTable
        loading={loading}
        emptyMessage="No payments recorded yet."
        columns={[
          { key: "payment_id", label: "Payment #" },
          { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
          { key: "payment_method", label: "Method" },
          { key: "payment_date", label: "Date", render: (r) => new Date(r.payment_date).toLocaleDateString() },
          { key: "payment_status", label: "Status", render: (r) => <Badge status={r.payment_status} /> },
        ]}
        rows={payments}
        actions={(row) => (
          row.payment_status === "pending" ? (
            <button onClick={() => handleMarkCompleted(row.payment_id)} className="text-xs text-leaf hover:underline">
              Mark Completed
            </button>
          ) : null
        )}
      />
    </div>
  );
}
