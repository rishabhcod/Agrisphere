import { useEffect, useState } from "react";
import { procurementApi } from "../../api/procurementApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "seed", label: "Seed" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "pesticide", label: "Pesticide" },
  { value: "other", label: "Other" },
];

export default function SupplierCatalog() {
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({ companyName: "", contactInfo: "" });
  const [itemForm, setItemForm] = useState({ name: "", category: "", unit: "", unitPrice: "" });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await procurementApi.getMySupplierProfile();
      setProfile(data.supplier);
      const itemsRes = await procurementApi.getMyInputItems();
      setItems(itemsRes.data.items);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await procurementApi.createSupplierProfile(profileForm);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create supplier profile.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await procurementApi.addInputItem(itemForm);
      setModalOpen(false);
      setItemForm({ name: "", category: "", unit: "", unitPrice: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add item.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this item from your catalog?")) return;
    await procurementApi.deleteInputItem(id);
    load();
  };

  if (loading) return null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="mb-1 font-display text-lg font-semibold">Set up your supplier profile</h2>
        <p className="mb-4 text-sm text-muted">Add your business details before listing products.</p>
        <form onSubmit={handleCreateProfile} className="card p-5">
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Company name" required value={profileForm.companyName} onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })} />
          <FormField label="Contact info" value={profileForm.contactInfo} onChange={(e) => setProfileForm({ ...profileForm, contactInfo: e.target.value })} />
          <button className="btn-primary w-full">Create Profile</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Products you sell to farmers and cooperatives.</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
          <Plus size={14} /> Add Item
        </button>
      </div>

      <DataTable
        emptyMessage="You haven't added any products yet."
        columns={[
          { key: "name", label: "Item" },
          { key: "category", label: "Category" },
          { key: "unit", label: "Unit" },
          { key: "unit_price", label: "Price", render: (r) => `₹${r.unit_price}` },
        ]}
        rows={items}
        actions={(row) => (
          <button onClick={() => handleDelete(row.input_item_id)} className="text-muted hover:text-rust">
            <Trash2 size={16} />
          </button>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Product">
        <form onSubmit={handleAddItem}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Item name" required value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
          <FormField label="Category" as="select" options={CATEGORY_OPTIONS} value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })} />
          <FormField label="Unit" required placeholder="e.g. kg, bag, litre" value={itemForm.unit} onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })} />
          <FormField label="Unit price (₹)" type="number" required value={itemForm.unitPrice} onChange={(e) => setItemForm({ ...itemForm, unitPrice: e.target.value })} />
          <button className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
