import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import FormField from "../../components/ui/FormField";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-3xl">🌾</div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">AgriSphere</h1>
          <p className="text-sm text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6">
          {error && (
            <div className="mb-4 rounded border border-rust/30 bg-rust/10 px-3 py-2 text-sm text-rust">
              {error}
            </div>
          )}
          <FormField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-gold font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
