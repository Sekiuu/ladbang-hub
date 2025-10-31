"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonUI from "../components/ui/Button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";


export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from");

  // try to read session to prefill if user came from Google OAuth
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // frontend-only scaffold: save the email so Login can prefill.
      // Real signup should call your backend API here.
      try {
        localStorage.setItem("savedEmail", email);
      } catch (e) {
        // ignore storage errors in non-browser environments
      }
      // If user came from Google OAuth, send them to home; otherwise to login
      if (from === "google") {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดขณะสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if user arrived via Google and is already authenticated, prefill fields
    try {
      if (from === "google" && session) {
        const u = (session as any)?.user ?? (session as any);
        if (u?.name) setName(u.name);
        if (u?.email) setEmail(u.email);
      }
    } catch (e) {
      // ignore
    }
  }, [from, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Sign in</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="username" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="ชื่อของคุณ" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="รหัสผ่านอย่างน้อย 8 ตัว" />
          </div>

          <ButtonUI type="submit" disabled={isLoading} className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition">
            {isLoading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </ButtonUI>

          <div className="text-center text-sm text-gray-500 ">
            -------------------------------- OR --------------------------------
          <div className="text-center mt-2">
            <ButtonUI type="button" variant="ghost" size="md" className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>Sign in with Google</ButtonUI>
          </div>

          </div>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          มีบัญชีอยู่แล้ว? {" "}
          <Link href="/login" className="text-purple-600 hover:underline">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}
