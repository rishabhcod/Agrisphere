import { useEffect, useState } from "react";
import { farmerApi } from "../../api/farmerApi";
import DataTable from "../../components/ui/DataTable";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    farmerApi.getAllFarmers().then(({ data }) => setFarmers(data.farmers)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Every farmer registered in the cooperative.</p>
      <DataTable
        loading={loading}
        emptyMessage="No farmers registered yet."
        columns={[
          { key: "full_name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "created_at", label: "Joined", render: (r) => new Date(r.created_at).toLocaleDateString() },
        ]}
        rows={farmers}
      />
    </div>
  );
}
