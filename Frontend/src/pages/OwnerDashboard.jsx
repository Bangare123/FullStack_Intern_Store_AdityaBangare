
import { useEffect, useState } from "react";
import {
  Star,
  Users,
  Store,
  Mail,
  MapPin,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { getOwnerDashboard } from "../api/ownerApi";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOwnerDashboard();

        setDashboard(response.data);
      } catch (error) {
        console.error("Owner dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load owner dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle
          size={32}
          className="animate-spin text-violet-500"
        />
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-400" size={22} />

          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const store = dashboard?.store;
  const ratedUsers = dashboard?.ratedUsers || [];

  return (
    <div className="space-y-6">

      
      <div>
        <p className="text-sm text-slate-500">
          Store Owner
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          View your store rating and customers who rated your store.
        </p>
      </div>


     
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

      
        <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 lg:col-span-2">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400">
              <Store size={24} />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-lg font-semibold text-white">
                {store?.name}
              </h2>

              <div className="mt-2 space-y-2">

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={16} />
                  <span className="truncate">
                    {store?.email}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {store?.address}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>


    
        <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="text-3xl font-bold text-white">
                  {store?.averageRating ?? 0}
                </span>

                <Star
                  size={24}
                  className="fill-yellow-400 text-yellow-400"
                />

              </div>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Star
                size={24}
                className="fill-yellow-400"
              />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            Based on {store?.totalRatings ?? 0} rating
            {store?.totalRatings === 1 ? "" : "s"}
          </p>

        </div>

      </div>


      
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A]">

        
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Users size={20} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Users Who Rated Your Store
              </h2>

              <p className="text-xs text-slate-500">
                {ratedUsers.length} user
                {ratedUsers.length === 1 ? "" : "s"}
              </p>

            </div>

          </div>

        </div>


        
        {ratedUsers.length === 0 ? (

          <div className="px-5 py-12 text-center">

            <Users
              size={40}
              className="mx-auto text-slate-700"
            />

            <h3 className="mt-3 text-sm font-medium text-slate-300">
              No ratings yet
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Users who rate your store will appear here.
            </p>

          </div>

        ) : (

          <>

           
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-800 text-left">

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Address
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rating
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {ratedUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 font-semibold text-white">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <span className="text-sm font-medium text-white">
                            {user.name}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {user.email}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-slate-400">
                        <span className="line-clamp-2">
                          {user.address}
                        </span>
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5">

                          <Star
                            size={17}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="text-sm font-semibold text-white">
                            {user.rating}
                          </span>

                          <span className="text-xs text-slate-500">
                            / 5
                          </span>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            <div className="space-y-3 p-4 md:hidden">

              {ratedUsers.map((user) => (

                <div
                  key={user.id}
                  className="rounded-xl border border-slate-800 bg-[#020617] p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 font-semibold text-white">
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-white">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-yellow-500/10 px-2.5 py-1.5">

                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-semibold text-yellow-400">
                        {user.rating}
                      </span>

                    </div>

                  </div>

                  <div className="mt-3 flex items-start gap-2 border-t border-slate-800 pt-3 text-xs text-slate-500">

                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {user.address}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default OwnerDashboard;

