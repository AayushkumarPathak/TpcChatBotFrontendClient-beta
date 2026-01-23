import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import lpuLogo from "../assets/lpuLogo.svg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Login form submitted");
    if (!regNo.trim() || !password.trim()) {
      setError("Please fill in all fields");
      console.log("Validation failed: missing fields");
      return;
    }
    setIsLoading(true);
    try {
      const loginPayload = { regNo, password };
     
      await login(loginPayload);
     
      navigate("/chat");
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
    finally {
      setIsLoading(false);
      console.log('Login flow finished');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF1F1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl mb-4">
            <img src={lpuLogo} alt="LPU Logo" className="w-28 h-28 " />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TPC Query Assistant
          </h1>
          <p className="text-gray-600">Training & Placement Cell</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Registration Number */}
            <div>
              <label
                htmlFor="regNo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Registration Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="regNo"
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your registration number"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 " />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error || authError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-400"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Having trouble logging in?{" "}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact TPC Block 33-204
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Lovely Professional University</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
