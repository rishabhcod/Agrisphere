import { useEffect, useState } from "react";
import { paymentApi } from "../../api/paymentApi";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function FarmerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentApi.getMine().then(({ data }) => setPayments(data.payments)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">All your payments — procurement and equipment rental — in one place.</p>
      <DataTable
        loading={loading}
        emptyMessage="No payments recorded yet."
        columns={[
          { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
          { key: "payment_method", label: "Method" },
          { key: "payment_date", label: "Date", render: (r) => new Date(r.payment_date).toLocaleDateString() },
          { key: "payment_status", label: "Status", render: (r) => <Badge status={r.payment_status} /> },
        ]}
        rows={payments}
      />
    </div>
  );
}
