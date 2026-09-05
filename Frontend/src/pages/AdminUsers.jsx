import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../api/adminApi.jsx";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUsers({
          search,
          role: roleFilter !== "ALL" ? roleFilter : "",
        });

        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Fetch users error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, roleFilter]);

  const totalPages = Math.ceil(
    users.length / itemsPerPage
  );

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleStyle = (role) => {
    if (role === "ADMIN") {
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }

    if (role === "OWNER") {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }

    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  const formatRole = (role) => {
    if (role === "OWNER") return "Store Owner";
    if (role === "ADMIN") return "Admin";

    return "Normal User";
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage system users and their roles.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/users/create")}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

    
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
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
              placeholder="Search by name, email or address..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            {search && (
              <button
                type="button"
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

          <div className="relative lg:w-52">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-slate-300 outline-none focus:border-violet-500"
            >
              <option value="ALL">
                All Roles
              </option>

              <option value="USER">
                Normal User
              </option>

              <option value="ADMIN">
                Admin
              </option>

              <option value="OWNER">
                Store Owner
              </option>
            </select>
          </div>
        </div>
      </div>

    
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-500">
          Loading users...
        </div>
      ) : (
        <>
         
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">

                <thead className="border-b border-slate-800 bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Name
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Address
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Role
                      </span>
                    </th>

                    <th className="px-5 py-4 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {user.email}
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-slate-400">
                          <p className="truncate">
                            {user.address}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getRoleStyle(
                              user.role
                            )}`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/users/${user.id}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        
          <div className="space-y-3 md:hidden">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    {user.address}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/users/${user.id}`
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-300 hover:border-violet-500/40 hover:text-violet-400"
                  >
                    <Eye size={15} />
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-12 text-center text-sm text-slate-500">
                No users found.
              </div>
            )}
          </div>

         
          {totalPages > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-slate-300">
                  {(currentPage - 1) *
                    itemsPerPage +
                    1}
                </span>{" "}
                to{" "}
                <span className="text-slate-300">
                  {Math.min(
                    currentPage * itemsPerPage,
                    users.length
                  )}
                </span>{" "}
                of{" "}
                <span className="text-slate-300">
                  {users.length}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white">
                  {currentPage}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
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

export default AdminUsers;