import { useEffect, useState } from "react";
import { cropApi } from "../../api/cropApi";
import { farmerApi } from "../../api/farmerApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Badge from "../../components/ui/Badge";
import { Plus } from "lucide-react";

export default function CropPlans() {
  const [plans, setPlans] = useState([]);
  const [crops, setCrops] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ landParcelId: "", cropId: "", seasonYear: new Date().getFullYear(), sowingDate: "", expectedYieldKg: "" });

  const load = async () => {
    setLoading(true);
    const [plansRes, cropsRes, parcelsRes] = await Promise.all([
      cropApi.getMyPlans(), cropApi.getAll(), farmerApi.getMyLandParcels(),
    ]);
    setPlans(plansRes.data.plans);
    setCrops(cropsRes.data.crops);
    setParcels(parcelsRes.data.parcels);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await cropApi.createPlan(form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create crop plan.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Season-wise sowing and yield records for your land.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
          <Plus size={14} /> New Crop Plan
        </button>
      </div>

      <DataTable
        loading={loading}
        emptyMessage="No crop plans yet — create one to start tracking a season."
        columns={[
          { key: "crop_name", label: "Crop" },
          { key: "season_year", label: "Season" },
          { key: "sowing_date", label: "Sowing Date" },
          { key: "expected_yield_kg", label: "Expected Yield (kg)" },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
        ]}
        rows={plans}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Crop Plan">
        <form onSubmit={handleCreate}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField
            label="Land parcel" as="select" required
            options={parcels.map((p) => ({ value: p.land_parcel_id, label: `${p.village_location || "Parcel"} (${p.land_size_acres} ac)` }))}
            value={form.landParcelId} onChange={(e) => setForm({ ...form, landParcelId: e.target.value })}
          />
          <FormField
            label="Crop" as="select" required
            options={crops.map((c) => ({ value: c.crop_id, label: c.name }))}
            value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })}
          />
          <FormField label="Season year" type="number" required value={form.seasonYear} onChange={(e) => setForm({ ...form, seasonYear: e.target.value })} />
          <FormField label="Sowing date" type="date" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} />
          <FormField label="Expected yield (kg)" type="number" value={form.expectedYieldKg} onChange={(e) => setForm({ ...form, expectedYieldKg: e.target.value })} />
          <button className="btn-primary w-full">Create Plan</button>
        </form>
      </Modal>
    </div>
  );
}
