import { useEffect, useState } from "react";
import { cropApi } from "../../api/cropApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import { Plus } from "lucide-react";

const SEASON_OPTIONS = [
  { value: "kharif", label: "Kharif" },
  { value: "rabi", label: "Rabi" },
  { value: "zaid", label: "Zaid" },
];

export default function AdminCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", season: "", category: "" });

  const load = () => {
    setLoading(true);
    cropApi.getAll().then(({ data }) => setCrops(data.crops)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await cropApi.create(form);
      setModalOpen(false);
      setForm({ name: "", season: "", category: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add crop.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">The master list of crop types every farmer picks from.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
          <Plus size={14} /> Add Crop
        </button>
      </div>

      <DataTable
        loading={loading}
        emptyMessage="No crop types added yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "season", label: "Season" },
          { key: "category", label: "Category" },
        ]}
        rows={crops}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Crop Type">
        <form onSubmit={handleCreate}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Name" required placeholder="e.g. Wheat" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormField label="Season" as="select" options={SEASON_OPTIONS} value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
          <FormField label="Category" placeholder="e.g. cereal, cash crop" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <button className="btn-primary w-full">Add Crop</button>
        </form>
      </Modal>
    </div>
  );
}
