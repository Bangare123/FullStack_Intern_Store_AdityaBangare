import { useEffect, useState } from "react";
import { Search, Plus, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminStores } from "../api/adminApi.jsx";

const AdminStores = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminStores();

      console.log("Admin stores API response:", response.data);

      setStores(response.data.stores || []);
    } catch (error) {
      console.error("Fetch stores error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch stores"
      );
    } finally {
      setLoading(false);
    }
  };
  const filteredStores = stores.filter((store) => {
    const searchValue = search.toLowerCase();

    return (
      store.name?.toLowerCase().includes(searchValue) ||
      store.email?.toLowerCase().includes(searchValue) ||
      store.address?.toLowerCase().includes(searchValue)
    );
  });
  const totalPages = Math.ceil(
    filteredStores.length / itemsPerPage
  );

  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const renderRating = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= Math.round(numericRating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-700"
              }
            />
          ))}
        </div>

        <span className="text-sm font-medium text-white">
          {numericRating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Stores
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage stores and monitor their ratings.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/stores/create")}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Store
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="relative">

          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by store name, email or address..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}

        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-400">
          Loading stores...
        </div>
      )}

      {!loading && (
        <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="border-b border-slate-800 bg-slate-900/80">
                <tr>

                  <th className="px-5 py-4">
                    <button className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                      Store Name
                    </button>
                  </th>

                  <th className="px-5 py-4">
                    <button className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                      Email
                    </button>
                  </th>

                  <th className="px-5 py-4">
                    <button className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                      Address
                    </button>
                  </th>

                  <th className="px-5 py-4">
                    <button className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                      Rating
                    </button>
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">

                {paginatedStores.length > 0 ? (

                  paginatedStores.map((store) => (

                    <tr
                      key={store.id}
                      className="transition hover:bg-slate-800/40"
                    >

                   
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">
                          {store.name}
                        </p>
                      </td>

                    
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {store.email}
                      </td>
                
                      <td className="max-w-xs px-5 py-4 text-sm text-slate-400">
                        <p className="truncate">
                          {store.address}
                        </p>
                      </td>

                      
                      <td className="px-5 py-4">
                        {renderRating(
                          store.overall_rating
                        )}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No stores found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-3 md:hidden">

          {paginatedStores.length > 0 ? (

            paginatedStores.map((store) => (

              <div
                key={store.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-white">
                      {store.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {store.email}
                    </p>

                  </div>

                  <div className="shrink-0">
                    {renderRating(
                      store.overall_rating
                    )}
                  </div>

                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {store.address}
                </p>

              </div>

            ))

          ) : (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-500">
              No stores found.
            </div>

          )}

        </div>
      )}

      {!loading && totalPages > 0 && (

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">

            Showing{" "}

            <span className="text-slate-300">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>

            {" "}to{" "}

            <span className="text-slate-300">
              {Math.min(
                currentPage * itemsPerPage,
                filteredStores.length
              )}
            </span>

            {" "}of{" "}

            <span className="text-slate-300">
              {filteredStores.length}
            </span>

            {" "}stores

          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white">
              {currentPage}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminStores;