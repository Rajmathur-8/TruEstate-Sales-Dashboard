import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">
        Search
      </label>

      <div className="relative group">
        {/* Icon */}
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all text-lg"
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search by customer name or phone number..."
          className="
            w-full pl-12 pr-4 py-3 
            rounded-xl border border-slate-300 
            bg-white/90 backdrop-blur-sm shadow-sm
            text-slate-900 placeholder-slate-400 text-sm
            transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:border-blue-400
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
