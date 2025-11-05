"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Mail, Hash, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../api";
import { UserBase } from "@/lib/schema/users";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  type Transaction = {
    id: string;
    user_id: string;
    amount: number;
    type: "income" | "expense";
    detail: string | "";
    tag: string;
  };

  useEffect(() => {
    if ((session?.user as UserBase)?.id) {
      loadTransactions();
    }
  }, [session]);

  useEffect(() => {
    const transactionsBalance = transactions.reduce((acc, t) => {
      return acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount));
    }, 0);
    setBalance(transactionsBalance);
  }, [transactions]);

  const loadTransactions = async () => {
    try {
      const response = await api.get(
        `/transactions/user/${(session?.user as UserBase)?.id}`
      );
      if (response?.success) {
        setTransactions(response.body || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-slate-700">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account</p>
        </div>

        {/* Single Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-8">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-light text-slate-700">
              {session?.user?.username || "User"}
            </h2>
          </div>

          {/* Balance */}
          <div className="mb-8 p-6 bg-sky-50/50 rounded-xl border border-sky-100 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
              Balance
            </p>
            <p className="text-5xl font-light text-sky-600">
              ฿{balance.toLocaleString()}
            </p>
          </div>

          {/* Email */}
          <div className="mb-6 p-5 bg-sky-50/50 rounded-xl border border-sky-100">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-sky-600" />
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Email
              </label>
            </div>
            <p className="text-xl text-slate-700 font-light ml-8 break-all">
              {session?.user?.email || "Not provided"}
            </p>
          </div>

          {/* User ID */}
          <div className="mb-8 p-5 bg-sky-50/50 rounded-xl border border-sky-100">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-5 h-5 text-sky-600" />
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                User ID
              </label>
            </div>
            <p className="text-lg text-slate-700 font-light font-mono ml-8 break-all">
              {session?.user?.id || "Not available"}
            </p>
          </div>

          {/* Sign Out Button */}
          <div className="pt-6 border-t border-sky-100">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition font-light"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
