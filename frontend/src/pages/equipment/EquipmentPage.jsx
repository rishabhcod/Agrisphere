import { useEffect, useState } from "react";
import { equipmentApi } from "../../api/equipmentApi";
import { useAuthStore } from "../../store/authStore";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Badge from "../../components/ui/Badge";
import { Plus, CalendarPlus } from "lucide-react";

export default function EquipmentPage() {
  const { user } = useAuthStore();
  const isOwner = user?.role === "equipment_owner";
  const isFarmer = user?.role === "farmer";

  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bookModalItem, setBookModalItem] = useState(null);
  const [error, setError] = useState("");
  const [addForm, setAddForm] = useState({ equipmentType: "", dailyRate: "" });
  const [bookForm, setBookForm] = useState({ startDate: "", endDate: "" });

  const load = async () => {
    setLoading(true);
    const eqRes = await (isOwner ? equipmentApi.getMine() : equipmentApi.getAvailable());
    setEquipment(eqRes.data.equipment);
    if (isFarmer) {
      const bookingsRes = await equipmentApi.getMyBookings();
      setBookings(bookingsRes.data.bookings);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await equipmentApi.create(addForm);
      setAddModalOpen(false);
      setAddForm({ equipmentType: "", dailyRate: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add equipment.");
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await equipmentApi.book(bookModalItem.equipment_id, bookForm);
      setBookModalItem(null);
      setBookForm({ startDate: "", endDate: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not book equipment.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide">
            {isOwner ? "My Equipment" : "Available Equipment"}
          </h2>
          {isOwner && (
            <button onClick={() => setAddModalOpen(true)} className="btn-primary text-xs py-1.5">
              <Plus size={14} /> List Equipment
            </button>
          )}
        </div>
        <DataTable
          loading={loading}
          emptyMessage={isOwner ? "You haven't listed any equipment yet." : "No equipment currently available."}
          columns={[
            { key: "equipment_type", label: "Type" },
            { key: "daily_rate", label: "Daily Rate", render: (r) => `₹${r.daily_rate}` },
            { key: "availability_status", label: "Status", render: (r) => <Badge status={r.availability_status} /> },
          ]}
          rows={equipment}
          actions={isFarmer ? (row) => (
            <button onClick={() => setBookModalItem(row)} className="btn-secondary text-xs py-1">
              <CalendarPlus size={13} /> Book
            </button>
          ) : undefined}
        />
      </div>

      {isFarmer && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">My Bookings</h2>
          <DataTable
            loading={loading}
            emptyMessage="You haven't booked any equipment yet."
            columns={[
              { key: "equipment_type", label: "Equipment" },
              { key: "start_date", label: "From", render: (r) => new Date(r.start_date).toLocaleDateString() },
              { key: "end_date", label: "To", render: (r) => new Date(r.end_date).toLocaleDateString() },
              { key: "total_cost", label: "Cost", render: (r) => `₹${r.total_cost}` },
              { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
            ]}
            rows={bookings}
          />
        </div>
      )}

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="List Equipment">
        <form onSubmit={handleAdd}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Equipment type" required placeholder="e.g. Tractor" value={addForm.equipmentType} onChange={(e) => setAddForm({ ...addForm, equipmentType: e.target.value })} />
          <FormField label="Daily rate (₹)" type="number" required value={addForm.dailyRate} onChange={(e) => setAddForm({ ...addForm, dailyRate: e.target.value })} />
          <button className="btn-primary w-full">List Equipment</button>
        </form>
      </Modal>

      <Modal open={!!bookModalItem} onClose={() => setBookModalItem(null)} title={`Book: ${bookModalItem?.equipment_type || ""}`}>
        <form onSubmit={handleBook}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Start date" type="date" required value={bookForm.startDate} onChange={(e) => setBookForm({ ...bookForm, startDate: e.target.value })} />
          <FormField label="End date" type="date" required value={bookForm.endDate} onChange={(e) => setBookForm({ ...bookForm, endDate: e.target.value })} />
          <button className="btn-primary w-full">Request Booking</button>
        </form>
      </Modal>
    </div>
  );
}
