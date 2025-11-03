"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonUI from "../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use NextAuth credentials provider for username/password.
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(`ERR:${result.error}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("savedEmail");
      if (saved) setEmail(saved);
    } catch (e) {
      // ignore in non-browser
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Login
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
              placeholder="Email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
              placeholder="Password"
            />
          </div>
          <ButtonUI
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </ButtonUI>
          <div className="text-center text-sm text-gray-500 ">
            -------------------------------- OR --------------------------------
          </div>
          <div className="text-center mt-2">
            <ButtonUI
              type="button"
              variant="ghost"
              size="md"
              className="w-full flex items-center justify-center gap-2"
              onClick={() =>
                signIn("google", { callbackUrl: "/signin?from=google" })
              }
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </ButtonUI>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            ยังไม่มีบัญชี?{" "}
            <Link href="/signin" className="text-purple-600 hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
