import { useEffect, useState } from "react";
import { marketplaceApi } from "../../api/marketplaceApi";
import { cropApi } from "../../api/cropApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Badge from "../../components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";

export default function FarmerListings() {
  const [listings, setListings] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ cropId: "", quantityAvailableKg: "", pricePerKg: "" });

  const load = async () => {
    setLoading(true);
    const [listingsRes, cropsRes] = await Promise.all([marketplaceApi.getMyListings(), cropApi.getAll()]);
    setListings(listingsRes.data.listings);
    setCrops(cropsRes.data.crops);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await marketplaceApi.createListing(form);
      setModalOpen(false);
      setForm({ cropId: "", quantityAvailableKg: "", pricePerKg: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this listing?")) return;
    await marketplaceApi.deleteListing(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Produce you've put up for sale on the marketplace.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
          <Plus size={14} /> New Listing
        </button>
      </div>

      <DataTable
        loading={loading}
        emptyMessage="You haven't listed any produce yet."
        columns={[
          { key: "crop_name", label: "Crop" },
          { key: "quantity_available_kg", label: "Available (kg)" },
          { key: "price_per_kg", label: "Price/kg", render: (r) => `₹${r.price_per_kg}` },
          { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
        ]}
        rows={listings}
        actions={(row) => (
          <button onClick={() => handleDelete(row.listing_id)} className="text-muted hover:text-rust">
            <Trash2 size={16} />
          </button>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Marketplace Listing">
        <form onSubmit={handleCreate}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField
            label="Crop" as="select" required
            options={crops.map((c) => ({ value: c.crop_id, label: c.name }))}
            value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })}
          />
          <FormField label="Quantity available (kg)" type="number" required value={form.quantityAvailableKg} onChange={(e) => setForm({ ...form, quantityAvailableKg: e.target.value })} />
          <FormField label="Price per kg (₹)" type="number" required value={form.pricePerKg} onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })} />
          <button className="btn-primary w-full">Create Listing</button>
        </form>
      </Modal>
    </div>
  );
}
