import { useEffect, useState } from "react";
import { warehouseApi } from "../../api/warehouseApi";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function FarmerInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    warehouseApi.getMyInventory().then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Your produce currently held in cooperative warehouses.</p>
      <DataTable
        loading={loading}
        emptyMessage="No inventory recorded for you yet — a manager records stock after delivery."
        columns={[
          { key: "crop_name", label: "Crop" },
          { key: "warehouse_name", label: "Warehouse" },
          { key: "quantity_kg", label: "Quantity (kg)" },
          { key: "stored_date", label: "Stored On", render: (r) => new Date(r.stored_date).toLocaleDateString() },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
        ]}
        rows={items}
      />
    </div>
  );
}
