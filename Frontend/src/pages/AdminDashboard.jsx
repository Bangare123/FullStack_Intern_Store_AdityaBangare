import { useEffect, useState } from "react";
import { Users, Store, Star } from "lucide-react";
import { getAdminDashboard } from "../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await getAdminDashboard();

        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalStores: response.data.totalStores || 0,
          totalRatings: response.data.totalRatings || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: Store,
    },
    {
      title: "Total Ratings",
      value: stats.totalRatings,
      icon: Star,
    },
  ];

  return (
    <div className="space-y-6">
  
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Overview of your StoreRate platform.
        </p>
      </div>

     
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

    
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700 hover:bg-slate-900"
            >
              
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Icon size={22} />
              </div>

             
              <div className="mt-5">
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {loading ? "..." : card.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;