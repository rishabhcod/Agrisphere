import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import FormField from "../../components/ui/FormField";

const ROLE_OPTIONS = [
  { value: "farmer", label: "Farmer" },
  { value: "cooperative_manager", label: "Cooperative Manager" },
  { value: "equipment_owner", label: "Equipment Owner" },
  { value: "logistics_partner", label: "Logistics Partner" },
  { value: "buyer", label: "Buyer" },
  { value: "supplier", label: "Supplier" },
  { value: "admin", label: "Admin" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", role: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong registering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-3xl">🌾</div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="text-sm text-muted">Join the AgriSphere platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6">
          {error && (
            <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded border border-leaf/30 bg-leaf/10 px-3 py-2 text-sm text-leaf">
              Account created! Redirecting to login...
            </div>
          )}

          <FormField label="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <FormField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <FormField
            label="Role" as="select" required options={ROLE_OPTIONS}
            value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          />

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-gold font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
