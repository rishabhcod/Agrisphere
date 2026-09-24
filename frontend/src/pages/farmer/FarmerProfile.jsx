import { useEffect, useState } from "react";
import { farmerApi } from "../../api/farmerApi";
import FormField from "../../components/ui/FormField";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { Plus, Trash2 } from "lucide-react";

export default function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ idProofNumber: "", address: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [parcelForm, setParcelForm] = useState({ landSizeAcres: "", villageLocation: "", soilType: "" });
  const [error, setError] = useState("");

  const loadEverything = async () => {
    setLoading(true);
    try {
      const { data } = await farmerApi.getMyProfile();
      setProfile(data.farmer);
      const parcelsRes = await farmerApi.getMyLandParcels();
      setParcels(parcelsRes.data.parcels);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEverything(); }, []);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await farmerApi.createProfile(profileForm);
      loadEverything();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create profile.");
    }
  };

  const handleAddParcel = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await farmerApi.addLandParcel(parcelForm);
      setModalOpen(false);
      setParcelForm({ landSizeAcres: "", villageLocation: "", soilType: "" });
      loadEverything();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add land parcel.");
    }
  };

  const handleDeleteParcel = async (id) => {
    if (!confirm("Delete this land parcel?")) return;
    await farmerApi.deleteLandParcel(id);
    loadEverything();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  if (!profile) {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="mb-1 font-display text-lg font-semibold">Set up your farmer profile</h2>
        <p className="mb-4 text-sm text-muted">Add a few details before you can plan crops, order supplies, or list produce.</p>
        <form onSubmit={handleCreateProfile} className="card p-5">
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="ID proof number" value={profileForm.idProofNumber} onChange={(e) => setProfileForm({ ...profileForm, idProofNumber: e.target.value })} />
          <FormField label="Address" as="textarea" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
          <button className="btn-primary w-full">Create profile</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div><p className="text-muted">Name</p><p className="font-medium">{profile.full_name}</p></div>
          <div><p className="text-muted">Email</p><p className="font-medium">{profile.email}</p></div>
          <div><p className="text-muted">ID Proof</p><p className="font-medium">{profile.id_proof_number || "—"}</p></div>
          <div><p className="text-muted">Address</p><p className="font-medium">{profile.address || "—"}</p></div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide">Land Parcels</h2>
          <button onClick={() => setModalOpen(true)} className="btn-primary text-xs py-1.5">
            <Plus size={14} /> Add Parcel
          </button>
        </div>
        <DataTable
          emptyMessage="No land parcels added yet."
          columns={[
            { key: "land_size_acres", label: "Size (acres)" },
            { key: "village_location", label: "Location" },
            { key: "soil_type", label: "Soil Type" },
          ]}
          rows={parcels}
          actions={(row) => (
            <button onClick={() => handleDeleteParcel(row.land_parcel_id)} className="text-muted hover:text-rust">
              <Trash2 size={16} />
            </button>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Land Parcel">
        <form onSubmit={handleAddParcel}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Land size (acres)" type="number" required value={parcelForm.landSizeAcres} onChange={(e) => setParcelForm({ ...parcelForm, landSizeAcres: e.target.value })} />
          <FormField label="Village / location" value={parcelForm.villageLocation} onChange={(e) => setParcelForm({ ...parcelForm, villageLocation: e.target.value })} />
          <FormField label="Soil type" value={parcelForm.soilType} onChange={(e) => setParcelForm({ ...parcelForm, soilType: e.target.value })} />
          <button className="btn-primary w-full">Add Parcel</button>
        </form>
      </Modal>
    </div>
  );
}
