"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "../api";
import ButtonUI from "../components/ui/Button";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  detail: string;
  tag: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const tag = "";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  // Load transactions when component mounts
  useEffect(() => {
    if (session?.user?.email) {
      loadTransactions();
    }
  }, [session]);

  // Calculate balance when transactions change
  useEffect(() => {
    const newBalance = transactions.reduce((acc, t) => {
      return acc + (t.tag === "income" ? t.amount : -t.amount);
    }, 0);
    setBalance(newBalance);
  }, [transactions]);

  const loadTransactions = async () => {
    try {
      const response = await api.get("/transactions", {
        user_id: session?.user?.email
      });
      if (response?.success) {
        setTransactions(response.body || []);
      }
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลธุรกรรมได้");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/transactions", {
        user_id: session?.user?.email,
        amount: parseFloat(amount),
        type: type,
        detail,
        tag
      });

      if (response?.success) {
        // Clear form
        setAmount("");
        setDetail("");
        setType("income");
        // Reload transactions
        await loadTransactions();
      } else {
        setError(response?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>กรุณาเข้าสู่ระบบ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">ยอดเงินคงเหลือ</h2>
          <p className="text-3xl font-bold text-purple-600">
            ฿{balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">เพิ่มธุรกรรมใหม่</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทธุรกรรม
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    type === "income"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setType("income")}
                >
                  รายรับ
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    type === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setType("expense")}
                >
                  รายจ่าย
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนเงิน
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="ใส่จำนวนเงิน"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียด
              </label>
              <input
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="ใส่รายละเอียด"
              />
            </div>

            <ButtonUI
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "กำลังบันทึก..." : "บันทึกธุรกรรม"}
            </ButtonUI>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">ประวัติธุรกรรม</h2>
          
          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{t.detail}</p>
                  <p className="text-sm text-gray-500">
                    {t.tag === "income" ? "รายรับ" : "รายจ่าย"}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    t.tag === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.tag === "income" ? "+" : "-"}฿{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <p className="text-center text-gray-500">
                ยังไม่มีประวัติธุรกรรม
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
