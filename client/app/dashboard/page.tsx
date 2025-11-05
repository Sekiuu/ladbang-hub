"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api } from "../api";
import { UserBase } from "@/lib/schema/users";

// Import the new components
import BalanceCard from "./BalanceCard";
import TransactionHistory from "./TransactionHistory";
import AddTransactionForm from "./AddTransactionForm";
import ButtonUI from "../components/ui/Button";
import GraphView from "./GraphView"; // Import the new GraphView component
import AIChat from "./AIChat";
import AIFinancialAnalysis from "./AIFinancialAnalysis";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  detail: string | "";
  tag: string;
  created_at?: string;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [view, setView] = useState<"default" | "graph">("default");
  const [currentPage, setPage] = useState(0); // 0 for Dashboard, 1 for AI/Chat
  const Pages = ["Dashboard", "AI Insights"];

  const userId = (session?.user as UserBase)?.id;

  // Load transactions
  const loadTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/transactions/user/${userId}`);
      if (response?.success) {
        setTransactions(response.body || []);
      }
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลธุรกรรมได้");
    }
  }, [userId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Calculate balance
  useEffect(() => {
    const transactionsBalance = transactions.reduce((acc, t) => {
      return acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount));
    }, 0);
    setBalance(transactionsBalance);
  }, [transactions]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <p className="text-xl font-light text-slate-600">Please sign in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-4 sm:p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-light text-slate-700">
                {Pages[currentPage].toUpperCase()}
              </h1>
              {currentPage === 0 && (
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-slate-500 text-sm">Overview</p>
                  <select
                    name="view"
                    title="Perspective"
                    value={view}
                    onChange={(e) =>
                      setView(e.target.value as "default" | "graph")
                    }
                    className="text-slate-600 px-3 py-1 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white font-light text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="graph">Graph</option>
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setPage((currentPage + 1) % 2);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition font-light shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span className="text-base">
                Switch to {Pages[(currentPage + 1) % 2]}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm mb-4 font-light">
            {error}
          </div>
        )}

        {/* Main Grid Layout */}
        {currentPage === 0 ? (
          view === "default" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BalanceCard balance={balance} />
                <TransactionHistory transactions={transactions} />
              </div>
              <div className="lg:col-span-1">
                <AddTransactionForm
                  userId={userId}
                  onTransactionAdded={loadTransactions}
                />
              </div>
            </div>
          ) : (
            // Render Graph View
            <div className="lg:col-span-3">
              <GraphView transactions={transactions} />
            </div>
          )
        ) : (
          // AI Insights Page
          <div className="flex flex-col gap-6">
            <AIFinancialAnalysis transactions={transactions} userId={userId} />
            <AIChat transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}
