import { useEffect, useState } from "react";
import { procurementApi } from "../../api/procurementApi";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import Badge from "../../components/ui/Badge";
import { ShoppingCart } from "lucide-react";

export default function FarmerProcurement() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const [itemsRes, ordersRes] = await Promise.all([procurementApi.getInputItems(), procurementApi.getMyOrders()]);
    setItems(itemsRes.data.items);
    setOrders(ordersRes.data.orders);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await procurementApi.createOrder({
        supplierId: modalItem.supplier_id,
        items: [{ inputItemId: modalItem.input_item_id, quantity: Number(quantity) }],
      });
      setModalItem(null);
      setQuantity(1);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">Supply Catalog</h2>
        <DataTable
          loading={loading}
          emptyMessage="No input items available from suppliers yet."
          columns={[
            { key: "name", label: "Item" },
            { key: "company_name", label: "Supplier" },
            { key: "category", label: "Category" },
            { key: "unit", label: "Unit" },
            { key: "unit_price", label: "Price", render: (r) => `₹${r.unit_price}` },
          ]}
          rows={items}
          actions={(row) => (
            <button onClick={() => setModalItem(row)} className="btn-secondary text-xs py-1">
              <ShoppingCart size={13} /> Order
            </button>
          )}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wide">My Orders</h2>
        <DataTable
          loading={loading}
          emptyMessage="You haven't placed any procurement orders yet."
          columns={[
            { key: "company_name", label: "Supplier" },
            { key: "total_amount", label: "Total", render: (r) => `₹${r.total_amount}` },
            { key: "order_date", label: "Date", render: (r) => new Date(r.order_date).toLocaleDateString() },
            { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
          ]}
          rows={orders}
        />
      </div>

      <Modal open={!!modalItem} onClose={() => setModalItem(null)} title={`Order: ${modalItem?.name || ""}`}>
        <form onSubmit={handleOrder}>
          {error && <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>}
          <p className="mb-3 text-sm text-muted">₹{modalItem?.unit_price} per {modalItem?.unit}</p>
          <FormField label={`Quantity (${modalItem?.unit})`} type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <p className="mb-4 text-sm font-medium">Estimated total: ₹{(modalItem?.unit_price * quantity || 0).toFixed(2)}</p>
          <button className="btn-primary w-full">Place Order</button>
        </form>
      </Modal>
    </div>
  );
}
