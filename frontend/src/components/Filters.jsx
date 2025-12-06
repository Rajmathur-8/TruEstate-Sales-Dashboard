import React from "react";
import { FiFilter } from "react-icons/fi";
import { BiCalendar } from "react-icons/bi";
import { HiOutlineTag } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";

export default function Filters({ filters, setFilters, resetPage }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    resetPage();
  };

  const inputClasses =
    "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "transition-all text-slate-900 placeholder-slate-400 text-sm";

  const titleClasses =
    "text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide";

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiFilter className="text-blue-600 text-xl" />
        <h3 className="text-lg font-bold text-slate-900">Advanced Filters</h3>
      </div>

      {/* MAIN INPUT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {/* Region */}
        <div>
          <label className={titleClasses}>Region</label>
          <input
            type="text"
            placeholder="North, South..."
            className={inputClasses}
            value={filters.region.join(",")}
            onChange={(e) =>
              handleChange(
                "region",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        {/* Gender */}
        <div>
          <label className={titleClasses}>Gender</label>
          <input
            type="text"
            placeholder="Male, Female"
            className={inputClasses}
            value={filters.gender.join(",")}
            onChange={(e) =>
              handleChange(
                "gender",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className={titleClasses}>
            <span className="inline-flex items-center gap-1">
              <MdOutlineCategory className="text-blue-500" /> Category
            </span>
          </label>
          <input
            type="text"
            placeholder="Electronics..."
            className={inputClasses}
            value={filters.category.join(",")}
            onChange={(e) =>
              handleChange(
                "category",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        {/* Tags */}
        <div>
          <label className={titleClasses}>
            <span className="inline-flex items-center gap-1">
              <HiOutlineTag className="text-blue-500" /> Tags
            </span>
          </label>
          <input
            type="text"
            placeholder="Premium, Offer..."
            className={inputClasses}
            value={filters.tags.join(",")}
            onChange={(e) =>
              handleChange(
                "tags",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        {/* Payment */}
        <div>
          <label className={titleClasses}>Payment Method</label>
          <input
            type="text"
            placeholder="Card, UPI..."
            className={inputClasses}
            value={filters.paymentMethod.join(",")}
            onChange={(e) =>
              handleChange(
                "paymentMethod",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>
      </div>

      {/* Divider Line */}
      <div className="my-6 border-t border-slate-200"></div>

      {/* RANGE FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {/* Age Min */}
        <div>
          <label className={titleClasses}>Age Min</label>
          <input
            type="number"
            placeholder="Min age"
            className={inputClasses}
            value={filters.ageMin}
            onChange={(e) => handleChange("ageMin", e.target.value)}
          />
        </div>

        {/* Age Max */}
        <div>
          <label className={titleClasses}>Age Max</label>
          <input
            type="number"
            placeholder="Max age"
            className={inputClasses}
            value={filters.ageMax}
            onChange={(e) => handleChange("ageMax", e.target.value)}
          />
        </div>

        {/* Date From */}
        <div>
          <label className={titleClasses}>Date From</label>
          <div className="relative">
            <BiCalendar className="absolute left-3 top-3 text-slate-400 text-lg" />
            <input
              type="date"
              className={`${inputClasses} pl-10`}
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className={titleClasses}>Date To</label>
          <div className="relative">
            <BiCalendar className="absolute left-3 top-3 text-slate-400 text-lg" />
            <input
              type="date"
              className={`${inputClasses} pl-10`}
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
