import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  X,
  Star,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/authContext";

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Change Password",
      path: "/owner/change-password",
      icon: LockKeyhole,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0F172A] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
              <Star size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                StoreRate
              </h1>

              <p className="text-xs text-slate-500">
                Owner Panel
              </p>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

   
        <nav className="flex-1 space-y-2 px-3 py-6">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        <div className="border-t border-slate-800 p-3">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <div className="lg:pl-64">

      
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-[#020617]/90 px-4 backdrop-blur-xl sm:px-6">

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-800 bg-[#0F172A] p-2.5 text-slate-300 hover:text-white lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="hidden lg:block">

            <p className="text-sm text-slate-500">
              Welcome back
            </p>

            <h2 className="text-lg font-semibold">
              Store Owner Dashboard
            </h2>

          </div>

      
          <div className="relative ml-auto">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0F172A] px-3 py-2 transition hover:border-slate-700"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "O"}
              </div>

              <div className="hidden text-left sm:block">

                <p className="max-w-32 truncate text-sm font-medium">
                  {user?.name || "Store Owner"}
                </p>

                <p className="text-xs text-slate-500">
                  Store Owner
                </p>

              </div>

              <ChevronDown
                size={16}
                className="hidden text-slate-500 sm:block"
              />

            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] p-1.5 shadow-2xl">

                <div className="flex items-center gap-3 border-b border-slate-800 px-3 py-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium">
                      {user?.name || "Store Owner"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "owner@example.com"}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/owner/change-password");
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <LockKeyhole size={17} />
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            )}

          </div>

        </header>

        <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default OwnerLayout;