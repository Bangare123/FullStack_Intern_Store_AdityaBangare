import { Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Registration from "../pages/Registration";
import LoginLayout from "../layouts/LoginLayout";
import AdminLayout from "../pages/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminStores from "../pages/AdminStores";
import AdminCreateStore from "../pages/AdminCreateStore";
import AdminCreateUser from "../pages/AdminCreateUser";
import UserStores from "../pages/UserStores";
import OwnerDashboard from "../pages/OwnerDashboard";
import ChangePassword from "../pages/ChangePassword";

const Routing = () => {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/create" element={<AdminCreateUser />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/stores/create" element={<AdminCreateStore />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/user/stores" element={<UserStores />} />
          <Route path="/user/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/change-password" element={<ChangePassword />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routing;
