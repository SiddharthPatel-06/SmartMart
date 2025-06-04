import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginUser,
  signupUser,
  sendOtp,
  verifyOtp,
} from "../../app/slices/authSlice";
import Button from "./Button";
import OtpForm from "./OtpForm";

export default function AuthForm({ isSignup }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }
      if (isSignup && formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await dispatch(sendOtp({ email: formData.email })).unwrap();
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setIsLoading(true);
    setError("");

    try {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      if (isSignup) {
        await dispatch(
          verifyOtp({
            email: formData.email,
            otp: otp.toString(),
          })
        ).unwrap();

        const result = await dispatch(
          signupUser({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();

        if (result?.token) {
          localStorage.setItem("token", result.token);
          navigate("/dashboard");
        }
      } else {
        const result = await dispatch(
          verifyOtp({
            email: formData.email,
            otp: otp.toString(),
            password: formData.password,
          })
        ).unwrap();

        if (result?.token) {
          localStorage.setItem("token", result.token);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");

    try {
      await dispatch(sendOtp({ email: formData.email })).unwrap();
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result?.token) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <OtpForm
        email={formData.email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-neutral-950 text-white">
      <form
        onSubmit={isSignup ? handleSendOtp : handleLogin}
        className="bg-neutral-900 p-10 rounded-xl w-92 space-y-6 shadow-xl border border-neutral-800"
      >
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded font-medium"
        >
          {isLoading
            ? "Processing..."
            : isSignup
            ? "Send Verification Code"
            : "Login"}
        </Button>

        <p className="text-sm text-center text-neutral-400">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a
            href={isSignup ? "/login" : "/signup"}
            className="text-white underline hover:text-neutral-300 transition"
          >
            {isSignup ? "Login" : "Sign up"}
          </a>
        </p>
      </form>
    </div>
  );
}
