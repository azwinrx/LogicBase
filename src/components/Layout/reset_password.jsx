import React, { useState } from "react";
import { resetPassword } from "../../helper/supabaseAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../helper/toastUtil";

const pastelColors = [
  "#A2D1B0",
  "#77B1E3",
  "#F1AD8D",
  "#A9A6E5",
  "#A2CFD1",
  "#E37777",
];

const Reset_Password = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Sending reset password email to:", email);
    console.log("Current origin:", window.location.origin);
    console.log(
      "Expected redirect URL:",
      `${window.location.origin}/reset-password-confirm`
    );

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      showToast(error.message, "error");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    showToast("Password reset instructions sent to your email!", "success");

    // We don't navigate immediately to allow the user to see the success message
    setTimeout(() => {
      navigate("/login");
    }, 5000);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full"
      style={{
        backgroundColor: "#77B1E3", // Light blue - kontras dengan peach orange card
      }}
    >
      <div
        className="m-10 w-full max-w-md p-8 rounded-lg shadow-lg text-slate-800"
        style={{ backgroundColor: pastelColors[2] }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <img
              src="/Icon Kobi (maskot LogicBase)/kobiBingung.png"
              alt="Kobi"
              className="w-12 h-12"
            />
            <h2 className="text-2xl font-semibold">Reset Password</h2>
          </div>
          <p className="text-slate-700">
            Jangan khawatir! Masukkan email kamu dan kita akan kirimkan link
            untuk reset password 📧
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="text-green-700 mb-4 bg-green-100 p-4 rounded-md">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Berhasil!</span>
              </div>
              Link reset password sudah dikirim ke email kamu. Cek email dan
              klik linknya untuk reset password ya! 🎉
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 px-4 text-slate-800 rounded-md hover:shadow-lg transition duration-300 focus:outline-none font-semibold"
              style={{ backgroundColor: pastelColors[0] }}
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm text-slate-700 mb-2 font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-3 w-full px-3 py-2 text-slate-800 bg-white/70 border-2 border-white/50 rounded-md focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 text-slate-800 rounded-md hover:shadow-lg transition duration-300 mb-4 focus:outline-none font-semibold"
              style={{ backgroundColor: pastelColors[1] }}
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Link Reset 📨"}
            </button>

            {error && (
              <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-slate-700">
              Ingat passwordnya?{" "}
              <a
                href="login"
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
              >
                Masuk Sekarang!
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reset_Password;
