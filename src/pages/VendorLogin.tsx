import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";

const VendorOtpLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage("Failed to send OTP: " + error.message);
    } else {
      setMessage("OTP sent! Check your email.");
      setStep(2);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      setMessage("OTP verification failed: " + error.message);
    } else {
      setMessage("Login successful!");
      // Redirect or update UI as needed
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Vendor OTP Login</h2>
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Verify OTP
          </button>
        </form>
      )}
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
};

export default VendorOtpLogin;