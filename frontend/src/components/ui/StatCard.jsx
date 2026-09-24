const ACCENTS = {
  gold: "border-l-gold",
  leaf: "border-l-leaf",
  soil: "border-l-soil",
  rust: "border-l-rust",
  forest: "border-l-forest",
};

export default function StatCard({ label, value, accent = "gold" }) {
  return (
    <div className={`card border-l-4 ${ACCENTS[accent]} px-5 py-4`}>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-display font-semibold text-ink">{value}</p>
    </div>
  );
}
