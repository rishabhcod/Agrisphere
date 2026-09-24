const STATUS_STYLES = {
  // positive / done states
  completed: "bg-leaf/10 text-leaf border-leaf/30",
  delivered: "bg-leaf/10 text-leaf border-leaf/30",
  confirmed: "bg-leaf/10 text-leaf border-leaf/30",
  approved: "bg-leaf/10 text-leaf border-leaf/30",
  active: "bg-leaf/10 text-leaf border-leaf/30",
  in_storage: "bg-leaf/10 text-leaf border-leaf/30",

  // in-progress / neutral states
  pending: "bg-gold/10 text-gold-light border-gold/30",
  requested: "bg-gold/10 text-gold-light border-gold/30",
  planned: "bg-gold/10 text-gold-light border-gold/30",

  // negative states
  cancelled: "bg-rust/10 text-rust border-rust/30",
  failed: "bg-rust/10 text-rust border-rust/30",
  spoiled: "bg-rust/10 text-rust border-rust/30",

  // closed / dispatched
  sold_out: "bg-soil/10 text-soil border-soil/30",
  dispatched: "bg-soil/10 text-soil border-soil/30",
  sold: "bg-soil/10 text-soil border-soil/30",
  closed: "bg-muted/10 text-muted border-muted/30",
};

export default function Badge({ status }) {
  const style = STATUS_STYLES[status] || "bg-muted/10 text-muted border-muted/30";
  const label = String(status || "unknown").replaceAll("_", " ");
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
