import { useState } from "react";
import { handleLogin } from "./api/api.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [useEmail, setUseEmail] = useState(true);
  const [data, setData] = useState({
    criteria: {
      zip: "",
      phone: "",
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    if (!data.criteria.phone || !data.criteria.zip) {
      setError("Phone and Zip Code are required.");
      return;
    }
    try {
      const userData = await handleLogin(
        data.criteria.zip,
        data.criteria.phone
      );
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/component");
    } catch (error) {
      setError("Login failed. Please check your details and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="p-10 bg-slate-700/90 shadow-2xl rounded-3xl border border-blue-400 w-[400px] backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-blue-200 mb-2 tracking-wide drop-shadow">Customer Login</h2>
        <p className="text-blue-300 text-center mb-8">Access your account securely</p>
        {error && (
          <div className="mb-4 text-red-400 text-center font-semibold bg-red-900/30 rounded p-2 border border-red-400">{error}</div>
        )}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setUseEmail(true)}
            className={`px-4 py-2 text-base font-semibold rounded-l-md border border-blue-400 text-blue-100 hover:bg-blue-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${
              useEmail ? "bg-blue-500 text-white shadow-lg" : "bg-slate-700"
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setUseEmail(false)}
            className={`px-4 py-2 text-base font-semibold rounded-r-md border border-blue-400 text-blue-100 hover:bg-blue-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${
              !useEmail ? "bg-blue-500 text-white shadow-lg" : "bg-slate-700"
            }`}
          >
            Phone Login
          </button>
        </div>

        <form className="flex flex-col gap-5">
          {useEmail ? (
            <>
              <label className="text-blue-200 text-sm font-medium">Email
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 mt-1 bg-slate-800 border border-blue-400 rounded-md text-white placeholder-blue-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label className="text-blue-200 text-sm font-medium">Password
                <input
                  type="password"
                  placeholder="Password"
                  className="p-4 mt-1 bg-slate-800 border border-blue-400 rounded-md text-white placeholder-blue-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            </>
          ) : (
            <>
              <label className="text-blue-200 text-sm font-medium">Phone Number
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  onChange={(e) => {
                      setData({
                          ...data,
                          criteria: {
                              ...data.criteria,
                              phone: e.target.value
                          }
                      })
                  }}
                  className="p-4 mt-1 bg-slate-800 border border-blue-400 rounded-md text-white placeholder-blue-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label className="text-blue-200 text-sm font-medium">Zip Code
                <input
                  type="text"
                  name="zip"
                  onChange={(e) => {
                      setData({
                          ...data,
                          criteria: {
                              ...data.criteria,
                              zip: e.target.value
                          }
                      })
                  }}
                  placeholder="Zip Code"
                  className="p-4 mt-1 bg-slate-800 border border-blue-400 rounded-md text-white placeholder-blue-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
            className="mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-md text-white hover:from-blue-700 hover:to-blue-600 transition font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
