// components/recurring-date-picker/IntervalInput.jsx
export default function IntervalInput({ interval, frequency, onChange }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        Every
        <input
          type="number"
          min={1}
          value={interval}
          onChange={e => onChange(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1 mx-2"
        />
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
        {(interval || 1) > 1 ? "s" : ""}
      </label>
    </div>
  );
}
