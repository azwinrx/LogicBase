import React, { useState, useEffect } from "react";
import { signInUser } from "../../helper/supabaseAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../../helper/toastUtil";

const pastelColors = [
  "#A2D1B0",
  "#77B1E3",
  "#F1AD8D",
  "#A9A6E5",
  "#A2CFD1",
  "#E37777",
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user just registered
    const queryParams = new URLSearchParams(location.search);
    const registered = queryParams.get("registered");

    if (registered === "true") {
      showToast("Account created successfully! You can now log in.", "success");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await signInUser(email, password);

    if (error) {
      setError(error.message);
      showToast(error.message, "error");
      setLoading(false);
      return;
    }

    setLoading(false);
    showToast("Login successful!", "success");
    console.log("Login successful:", data);
    navigate("/beranda");
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full p-3 sm:p-4"
      style={{
        backgroundColor: "#F1AD8D", // Peach orange - kontras dengan mint blue card
      }}
    >
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg text-slate-800"
        style={{ backgroundColor: pastelColors[4] }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <img
              src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
              alt="Kobi"
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <h2 className="text-xl sm:text-2xl font-semibold">
              Hai, Selamat Datang!
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700">
            Masuk untuk melanjutkan petualangan belajar coding kamu 🎯
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-slate-700 mb-2 font-semibold"
            >
              Email 📧
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-slate-800 bg-white/70 border-2 border-white/50 rounded-md focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm text-slate-700 mb-2 font-semibold"
            >
              Password 🔑
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-slate-800 bg-white/70 border-2 border-white/50 rounded-md focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="text-right mb-4">
            <a
              href="reset-password"
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
            >
              Lupa Password? 🤔
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-slate-800 rounded-md hover:shadow-lg transition duration-300 mb-4 focus:outline-none font-semibold"
            style={{ backgroundColor: pastelColors[0] }}
            disabled={loading}
          >
            {loading ? "Sedang Masuk..." : "Masuk 🚀"}
          </button>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-slate-700">
            Belum punya akun?{" "}
            <a
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
            >
              Daftar Sekarang! 🎉
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
