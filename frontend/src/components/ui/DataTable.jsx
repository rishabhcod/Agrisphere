import Spinner from "./Spinner";
import EmptyState from "./EmptyState";

/**
 * columns: [{ key, label, render?: (row) => node }]
 * rows: array of objects
 */
export default function DataTable({ columns, rows, loading, emptyMessage = "Nothing here yet.", actions }) {
  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
            ))}
            {actions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-line last:border-0 hover:bg-canvas/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
