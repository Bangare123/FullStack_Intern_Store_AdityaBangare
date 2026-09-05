import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Mail, MapPin, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createStore, getStoreOwners } from "../api/adminApi.jsx";

const AdminCreateStore = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setError("");

        const response = await getStoreOwners();

        setOwners(response.data.owners || []);
      } catch (error) {
        console.error("Fetch owners error:", error);

        setError(
          error.response?.data?.message || "Failed to fetch store owners",
        );
      } finally {
        setOwnersLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const storeName = formData.name.trim();

    if (!storeName) {
      setError("Store name is required");
      return;
    }

    if (storeName.length < 20 || storeName.length > 60) {
      setError("Store name must be between 20 and 60 characters");
      return;
    }

    const storeEmail = formData.email.trim();

    if (!storeEmail) {
      setError("Store email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(storeEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    const storeAddress = formData.address.trim();

    if (!storeAddress) {
      setError("Store address is required");
      return;
    }

    if (storeAddress.length > 400) {
      setError("Store address must not exceed 400 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
        ownerId: formData.ownerId ? Number(formData.ownerId) : null,
      };

      console.log("Create store payload:", payload);

      await createStore(payload);

      setSuccess("Store created successfully!");

      setFormData({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      setTimeout(() => {
        navigate("/admin/stores");
      }, 1000);
    } catch (error) {
      console.error("Create store error:", error);

      setError(error.response?.data?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/stores")}
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">Add Store</h1>

          <p className="mt-1 text-sm text-slate-400">
            Create a new store in the system.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Store Name
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter store name"
                maxLength={60}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="mt-1 flex justify-between">
              <p className="text-xs text-slate-500">
                Must be between 20 and 60 characters.
              </p>

              <p className="text-xs text-slate-600">
                {formData.name.length}/60
              </p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="store@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3 top-3 text-slate-500"
              />

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter store address"
                rows={4}
                maxLength={400}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="mt-1 flex justify-between">
              <p className="text-xs text-slate-500">Maximum 400 characters.</p>

              <p className="text-xs text-slate-600">
                {formData.address.length}/400
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Store Owner
              <span className="ml-1 text-slate-500">(optional)</span>
            </label>

            <div className="relative">
              <UserPlus
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                disabled={ownersLoading}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {ownersLoading
                    ? "Loading store owners..."
                    : owners.length === 0
                      ? "No available store owners"
                      : "Select a store owner"}
                </option>

                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} — {owner.email}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Only store owners without an existing store are shown.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || ownersLoading}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateStore;
