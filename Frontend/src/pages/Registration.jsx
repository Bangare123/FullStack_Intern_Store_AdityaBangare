import { useState } from "react";
import { User, Mail, MapPin, Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.length < 20 || formData.name.length > 60) {
      alert("Name must be between 20 and 60 characters.");
      return;
    }

    if (formData.address.length > 400) {
      alert("Address cannot exceed 400 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must be 8–16 characters with at least 1 uppercase letter and 1 special character.",
      );
      return;
    }

    console.log("Registration Data:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-md">
      
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>

          <p className="mt-1 text-sm text-slate-400">
            Register your account to get started
          </p>
        </div>

        
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
          
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={20}
                  maxLength={60}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <p className="mt-1 text-right text-[11px] text-slate-500">
                {formData.name.length}/60
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={400}
                  required
                  rows="2"
                  placeholder="Enter your address"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <p className="mt-1 text-right text-[11px] text-slate-500">
                {formData.address.length}/400
              </p>
            </div>

         
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type={"password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={16}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                8–16 characters • 1 uppercase • 1 special character
              </p>
            </div>

          
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              className="font-medium text-violet-400 hover:text-violet-300"
              onClick={() => navigate("/")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
