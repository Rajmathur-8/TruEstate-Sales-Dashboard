export default function SalesTable({ sales }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 border border-slate-200 text-center">
        <p className="text-slate-500 text-lg font-medium">
          No sales data available. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEADER */}
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">

              {/* NEW: SERIAL NUMBER COLUMN */}
              <th className="px-4 py-3 text-left font-semibold text-white whitespace-nowrap">
                #
              </th>

              {[
                "Customer", "Phone", "Age", "Region", "Gender", "Type",
                "Product", "Category", "Brand", "Qty", "Price",
                "Final Amt", "Date", "Payment", "Status", "Location"
              ].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 text-left font-semibold text-white whitespace-nowrap"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-slate-200">
            {sales.map((s, idx) => (
              <tr
                key={s.id}
                className={`transition-all ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50`}
              >
                
                {/* SERIAL NUMBER CELL */}
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {idx + 1}
                </td>

                <td className="px-4 py-3 font-medium text-slate-900">{s.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{s.phoneNumber}</td>
                <td className="px-4 py-3 text-slate-600">{s.age}</td>
                <td className="px-4 py-3 text-slate-600">{s.customerRegion}</td>
                <td className="px-4 py-3 text-slate-600">{s.gender}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.customerType}</td>

                <td className="px-4 py-3 text-slate-900">{s.productName}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.productCategory}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.brand}</td>

                <td className="px-4 py-3 text-right font-semibold text-slate-900">{s.quantity}</td>

                <td className="px-4 py-3 text-right text-slate-600">
                  ₹{parseFloat(s.pricePerUnit || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  ₹{parseFloat(s.finalAmount || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-xs text-slate-600">{s.date}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{s.paymentMethod}</td>

                {/* STATUS BADGE */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.orderStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : s.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.orderStatus}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-slate-600">{s.storeLocation}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
