export default function FormField({ label, type = "text", value, onChange, required, placeholder, as = "input", options }) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}{required && <span className="text-rust"> *</span>}</label>
      {as === "select" ? (
        <select className="field-input" value={value} onChange={onChange} required={required}>
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea className="field-input" rows={3} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      ) : (
        <input className="field-input" type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      )}
    </div>
  );
}
