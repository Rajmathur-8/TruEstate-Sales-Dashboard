import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";

export default function Pagination({ page, totalPages, setPage, pageSize, setPageSize }) {
  const btnBase =
    "px-4 py-2 rounded-xl font-medium transition-all shadow-sm flex items-center gap-1";
  const btnActive =
    btnBase + " bg-blue-600 text-white hover:bg-blue-700 active:scale-95";
  const btnDisabled =
    btnBase + " bg-slate-100 text-slate-400 cursor-not-allowed";

  const selectClasses =
    "px-3 py-2 border border-slate-300 rounded-xl shadow-sm bg-white text-slate-900 text-sm font-medium " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <button
          className={page === 0 ? btnDisabled : btnActive}
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          <FiChevronLeft className="text-lg" />
          Previous
        </button>

        {/* Page Indicator */}
        <span className="text-slate-700 font-semibold text-sm whitespace-nowrap">
          Page{" "}
          <span className="text-blue-600 text-lg font-bold">{page + 1}</span>{" "}
          of <span className="font-bold">{totalPages}</span>
        </span>

        {/* Next Button */}
        <button
          className={page + 1 >= totalPages ? btnDisabled : btnActive}
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
          <FiChevronRight className="text-lg" />
        </button>
      </div>

      {/* RIGHT SECTION: Page Size Selector */}
      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl shadow-inner">
        <MdFormatListNumbered className="text-blue-600 text-xl" />
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          Records:
        </label>

        <select
          className={selectClasses}
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setPage(0);
          }}
        >
          <option value={10}>10 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>
    </div>
  );
}
