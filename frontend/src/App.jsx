import { useEffect, useState, startTransition, useCallback } from "react";
import { api } from "./api";

import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import SortBar from "./components/SortBar";
import SalesTable from "./components/SalesTable";
import Pagination from "./components/Pagination";

function App() {
  const [sales, setSales] = useState([]);
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    tags: [],
    paymentMethod: [],
    ageMin: "",
    ageMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 UseCallback prevents re-renders caused by function recreations
  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = {
      q: query,
      region: filters.region.join(","),
      gender: filters.gender.join(","),
      category: filters.category.join(","),
      tags: filters.tags.join(","),
      paymentMethod: filters.paymentMethod.join(","),
      ageMin: filters.ageMin || undefined,
      ageMax: filters.ageMax || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortBy,
      sortDir,
      page,
      pageSize,
    };

    try {
      const res = await api.get("/sales", { params });

      startTransition(() => {
        setSales(res.data.content);
        setTotalPages(res.data.totalPages);
      });
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setError("Failed to fetch sales data. Try again.");
    } finally {
      setLoading(false);
    }
  }, [query, filters, sortBy, sortDir, page, pageSize]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">TruEstate Sales Dashboard</h1>
          <p className="text-slate-600">Manage and analyze your property sales data</p>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <SearchBar value={query} onChange={setQuery} />
          <Filters filters={filters} setFilters={setFilters} resetPage={() => setPage(0)} />
          <SortBar sortBy={sortBy} sortDir={sortDir} setSortBy={setSortBy} setSortDir={setSortDir} />
        </div>

        {/* Data Section */}
        <div className="mt-8">

          {/* Error State */}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-4 mb-4">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center text-slate-600 py-8 text-lg animate-pulse">
              Loading sales data…
            </div>
          ) : (
            <SalesTable sales={sales} />
          )}

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
