import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="text-4xl">🌾</div>
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted">Or you don't have access to this section.</p>
      <Link to="/" className="btn-primary mt-2">Go back</Link>
    </div>
  );
}
