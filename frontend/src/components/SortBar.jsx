import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import { MdOutlineSort } from "react-icons/md";

export default function SortBar({ sortBy, sortDir, setSortBy, setSortDir }) {
  const selectClasses =
    "px-4 py-2 rounded-xl bg-white border border-slate-300 shadow-sm text-slate-900 font-medium text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6">
      
      {/* SORT FIELD */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase flex items-center gap-1">
          <MdOutlineSort className="text-blue-600 text-lg" />
          Sort By
        </label>

        <select
          className={selectClasses}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="quantity">Quantity</option>
          <option value="customerName">Customer Name</option>
        </select>
      </div>

      {/* SORT DIRECTION */}
      <div className="flex flex-col w-full md:w-auto">
        <label className="text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase flex items-center gap-1">
          {sortDir === "asc" ? (
            <FiArrowUpCircle className="text-blue-600 text-lg" />
          ) : (
            <FiArrowDownCircle className="text-blue-600 text-lg" />
          )}
          Order
        </label>

        <select
          className={selectClasses}
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
