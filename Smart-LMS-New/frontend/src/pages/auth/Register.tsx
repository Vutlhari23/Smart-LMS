import { FormEvent, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        role,
      });
      setSuccess("Registration successful. You can now login.");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError("Unable to register. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-indigo-600">
      <h1 className="mb-4 text-2xl font-semibold">Create your account</h1>
      {success && (
        <p className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "lecturer")}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
