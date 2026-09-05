import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Outlet />
    </div>
  );
};

export default LoginLayout;
