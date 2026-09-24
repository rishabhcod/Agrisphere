import { useEffect, useState } from "react";
import { warehouseApi } from "../../api/warehouseApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import { Plus } from "lucide-react";

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", location: "", totalCapacityKg: "" });

  const load = () => {
    setLoading(true);
    warehouseApi.getAll().then(({ data }) => setWarehouses(data.warehouses)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await warehouseApi.create(form);
      setModalOpen(false);
      setForm({ name: "", location: "", totalCapacityKg: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add warehouse.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Physical storage locations for cooperative produce.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
          <Plus size={14} /> Add Warehouse
        </button>
      </div>

      <DataTable
        loading={loading}
        emptyMessage="No warehouses added yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "location", label: "Location" },
          { key: "total_capacity_kg", label: "Capacity (kg)" },
        ]}
        rows={warehouses}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Warehouse">
        <form onSubmit={handleCreate}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <FormField label="Total capacity (kg)" type="number" required value={form.totalCapacityKg} onChange={(e) => setForm({ ...form, totalCapacityKg: e.target.value })} />
          <button className="btn-primary w-full">Add Warehouse</button>
        </form>
      </Modal>
    </div>
  );
}
