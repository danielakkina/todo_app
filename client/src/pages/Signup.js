import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (username.trim().length < 3) {
      setMessage("⚠️ Username must be at least 3 characters");
      return;
    }
    if (password.trim().length < 6) {
      setMessage("⚠️ Password must be at least 6 characters");
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/api/auth/signup`;
    console.log("✅ SIGNUP URL:", url);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signup successful! You can now login.");
        setUsername("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.error || "Signup failed"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username (min 3 chars)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
