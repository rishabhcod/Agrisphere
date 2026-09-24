export default function EmptyState({ message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-muted">{message}</p>
      {action}
    </div>
  );
}
