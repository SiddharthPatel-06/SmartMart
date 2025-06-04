import { useState } from "react";
import Button from "./Button";

export default function OtpForm({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error = "",
}) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-neutral-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-10 py-14 rounded-xl w-92 space-y-6 shadow-xl border border-neutral-800"
      >
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
        <p className="text-center text-neutral-400">
          We've sent a 6-digit code to {email}
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="space-y-2">
          <label className="block text-sm text-neutral-400">
            Verification Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none text-center text-xl tracking-widest"
            required
            autoFocus
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded font-medium"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="text-center text-sm text-neutral-400">
          Didn't receive code?{" "}
          <button
            type="button"
            onClick={onResend}
            className="text-blue-400 hover:underline focus:outline-none"
            disabled={isLoading}
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}
