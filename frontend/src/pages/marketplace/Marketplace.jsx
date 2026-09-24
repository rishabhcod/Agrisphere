import { useEffect, useState } from "react";
import { marketplaceApi } from "../../api/marketplaceApi";
import { useAuthStore } from "../../store/authStore";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Badge from "../../components/ui/Badge";
import { ShoppingBag } from "lucide-react";

export default function Marketplace() {
  const { user } = useAuthStore();
  const isBuyer = user?.role === "buyer";

  const [listings, setListings] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyModalItem, setBuyModalItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({ businessName: "", address: "" });

  const load = async () => {
    setLoading(true);
    const listingsRes = await marketplaceApi.getActiveListings();
    setListings(listingsRes.data.listings);

    if (isBuyer) {
      try {
        await marketplaceApi.getMyBuyerProfile();
        setNeedsProfile(false);
        const ordersRes = await marketplaceApi.getMyOrders();
        setMyOrders(ordersRes.data.orders);
      } catch {
        setNeedsProfile(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await marketplaceApi.createBuyerProfile(profileForm);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create buyer profile.");
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await marketplaceApi.buy({ listingId: buyModalItem.listing_id, quantityOrderedKg: Number(quantity) });
      setBuyModalItem(null);
      setQuantity(1);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order.");
    }
  };

  if (isBuyer && needsProfile) {
    return (
      <div className="mx-auto max-w-md">
        <h2 className="mb-1 font-display text-lg font-semibold">Set up your buyer profile</h2>
        <p className="mb-4 text-sm text-muted">Add a few details before you can purchase from the marketplace.</p>
        <form onSubmit={handleCreateProfile} className="card p-5">
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <FormField label="Business name" value={profileForm.businessName} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} />
          <FormField label="Address" as="textarea" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
          <button className="btn-primary w-full">Create Profile</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">Active Listings</h2>
        <DataTable
          loading={loading}
          emptyMessage="No produce currently listed for sale."
          columns={[
            { key: "crop_name", label: "Crop" },
            { key: "quantity_available_kg", label: "Available (kg)" },
            { key: "price_per_kg", label: "Price/kg", render: (r) => `₹${r.price_per_kg}` },
          ]}
          rows={listings}
          actions={isBuyer ? (row) => (
            <button onClick={() => setBuyModalItem(row)} className="btn-secondary text-xs py-1">
              <ShoppingBag size={13} /> Buy
            </button>
          ) : undefined}
        />
      </div>

      {isBuyer && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">My Orders</h2>
          <DataTable
            loading={loading}
            emptyMessage="You haven't purchased anything yet."
            columns={[
              { key: "quantity_ordered_kg", label: "Quantity (kg)" },
              { key: "total_amount", label: "Total", render: (r) => `₹${r.total_amount}` },
              { key: "order_date", label: "Date", render: (r) => new Date(r.order_date).toLocaleDateString() },
              { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
            ]}
            rows={myOrders}
          />
        </div>
      )}

      <Modal open={!!buyModalItem} onClose={() => setBuyModalItem(null)} title={`Buy: ${buyModalItem?.crop_name || ""}`}>
        <form onSubmit={handleBuy}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <p className="mb-3 text-sm text-muted">₹{buyModalItem?.price_per_kg} per kg · {buyModalItem?.quantity_available_kg} kg available</p>
          <FormField label="Quantity (kg)" type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <p className="mb-4 text-sm font-medium">Estimated total: ₹{(buyModalItem?.price_per_kg * quantity || 0).toFixed(2)}</p>
          <button className="btn-primary w-full">Confirm Purchase</button>
        </form>
      </Modal>
    </div>
  );
}
