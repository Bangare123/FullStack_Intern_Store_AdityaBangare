import { useEffect, useState } from "react";
import { Search, Star, X, Send, Pencil } from "lucide-react";

import { getStores, rateStore } from "../api/storeApi";

const UserStores = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(null);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStores({
          search,
        });

        setStores(response.data.stores || []);
      } catch (error) {
        console.error("Get stores error:", error);

        setError(error.response?.data?.message || "Failed to load stores.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [search]);

  
  const handleRatingChange = (storeId, value) => {
    setRatingInput((prev) => ({
      ...prev,
      [storeId]: value,
    }));
  };

  const submitRating = async (storeId) => {
    const rating = Number(ratingInput[storeId]);

    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      setRatingLoading(storeId);
      setError("");

      await rateStore(storeId, rating);

      const response = await getStores({
        search,
      });

      setStores(response.data.stores || []);

      setRatingInput((prev) => ({
        ...prev,
        [storeId]: "",
      }));
    } catch (error) {
      console.error("Rating error:", error);

      setError(error.response?.data?.message || "Failed to submit rating.");
    } finally {
      setRatingLoading(null);
    }
  };

  const totalPages = Math.ceil(stores.length / itemsPerPage);

  const paginatedStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderOverallRating = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= Math.round(value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-700"
              }
            />
          ))}
        </div>

        <span className="text-sm font-medium text-white">
          {value.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderUserRating = (store) => {
    const rating = store.user_rating;

    if (!rating) {
      return <span className="text-xs text-slate-500">Not rated yet</span>;
    }

    return (
      <div className="flex items-center gap-1.5">
        <Star size={15} className="fill-violet-400 text-violet-400" />

        <span className="text-sm font-semibold text-white">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-bold text-white">Stores</h1>

        <p className="mt-1 text-sm text-slate-400">
          Discover stores and share your experience.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      
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
            placeholder="Search by store name or address..."
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

     
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-500">
          Loading stores...
        </div>
      ) : (
        <>
        
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4">
                      <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                        Store Name
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                        Address
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white">
                        Overall Rating
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Your Rating
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {paginatedStores.length > 0 ? (
                    paginatedStores.map((store) => {
                      const hasRated = store.user_rating;

                      return (
                        <tr
                          key={store.id}
                          className="transition hover:bg-slate-800/40"
                        >
                          
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-white">
                              {store.name}
                            </p>
                          </td>

                       
                          <td className="max-w-xs px-5 py-4">
                            <p className="truncate text-sm text-slate-400">
                              {store.address}
                            </p>
                          </td>

                          
                          <td className="px-5 py-4">
                            {renderOverallRating(store.overall_rating)}
                          </td>

                          
                          <td className="px-5 py-4">
                            {renderUserRating(store)}
                          </td>

                        
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={ratingInput[store.id] || ""}
                                onChange={(e) =>
                                  handleRatingChange(store.id, e.target.value)
                                }
                                className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-white outline-none focus:border-violet-500"
                              >
                                <option value="">Rate</option>

                                <option value="1">1 Star</option>

                                <option value="2">2 Stars</option>

                                <option value="3">3 Stars</option>

                                <option value="4">4 Stars</option>

                                <option value="5">5 Stars</option>
                              </select>

                              <button
                                disabled={ratingLoading === store.id}
                                onClick={() => submitRating(store.id)}
                                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {hasRated ? (
                                  <>
                                    <Pencil size={14} />
                                    {ratingLoading === store.id
                                      ? "Updating..."
                                      : "Update"}
                                  </>
                                ) : (
                                  <>
                                    <Send size={14} />
                                    {ratingLoading === store.id
                                      ? "Submitting..."
                                      : "Submit"}
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
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

       
          <div className="space-y-4 md:hidden">
            {paginatedStores.length > 0 ? (
              paginatedStores.map((store) => {
                const hasRated = store.user_rating;

                return (
                  <div
                    key={store.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                  >
                  
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {store.name}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {store.address}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {renderOverallRating(store.overall_rating)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-xs text-slate-500">
                        Your Rating
                      </span>

                      {renderUserRating(store)}
                    </div>

                    
                    <div className="mt-3 flex gap-2">
                      <select
                        value={ratingInput[store.id] || ""}
                        onChange={(e) =>
                          handleRatingChange(store.id, e.target.value)
                        }
                        className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="">Select rating</option>

                        <option value="1">1 Star</option>

                        <option value="2">2 Stars</option>

                        <option value="3">3 Stars</option>

                        <option value="4">4 Stars</option>

                        <option value="5">5 Stars</option>
                      </select>

                      <button
                        disabled={ratingLoading === store.id}
                        onClick={() => submitRating(store.id)}
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {hasRated ? (
                          <>
                            <Pencil size={14} />
                            {ratingLoading === store.id
                              ? "Updating..."
                              : "Update"}
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            {ratingLoading === store.id
                              ? "Submitting..."
                              : "Submit"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-500">
                No stores found.
              </div>
            )}
          </div>

        
          {totalPages > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-slate-300">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="text-slate-300">
                  {Math.min(currentPage * itemsPerPage, stores.length)}
                </span>{" "}
                of <span className="text-slate-300">{stores.length}</span>{" "}
                stores
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserStores;
