"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { analyzeUserTransactions } from "@/lib/ai-api";
import { api } from "@/app/api";
import { UserBase } from "@/lib/schema/users";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  detail: string;
  tag: string;
  created_at: string;
}

export default function FinanceAnalysis() {
  const { data: session } = useSession();
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // ดึงข้อมูล transactions เมื่อ component โหลด
  useEffect(() => {
    const loadTransactions = async () => {
      if (!session?.user?.id) return;

      setLoadingTransactions(true);
      try {
        const response = await api.get(
          `/transactions/user/${(session?.user as UserBase)?.id}`
        );
        if (response?.success) {
          setTransactions(response.body || []);
        }
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลธุรกรรมได้");
      } finally {
        setLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [session?.user?.id]);

  const handleAnalyze = async () => {
    if (!session?.user?.id) {
      setError("กรุณา login ก่อนใช้งาน");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const result = await analyzeUserTransactions(session.user.id);
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const getTransactionSummary = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const summary = getTransactionSummary();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 AI Financial Analysis
        </h2>
        <p className="text-gray-600">
          วิเคราะห์รายรับรายจ่ายของคุณด้วย AI และรับคำแนะนำการจัดการเงิน
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={handleAnalyze}
          disabled={loading || !session?.user?.id || transactions.length === 0}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              กำลังวิเคราะห์...
            </span>
          ) : (
            "🔍 เริ่มวิเคราะห์"
          )}
        </button>
        {transactions.length === 0 && !loadingTransactions && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ ไม่พบข้อมูล transactions กรุณาเพิ่มรายการก่อนวิเคราะห์
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">❌ {error}</p>
        </div>
      )}

      {/* Transaction Summary */}
      {transactions.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">รายรับ</p>
            <p className="text-2xl font-bold text-green-600">
              +{summary.income.toLocaleString()} ฿
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">รายจ่าย</p>
            <p className="text-2xl font-bold text-red-600">
              -{summary.expense.toLocaleString()} ฿
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">คงเหลือ</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {summary.balance >= 0 ? '+' : ''}{summary.balance.toLocaleString()} ฿
            </p>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && !analysis && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            📝 รายการล่าสุด ({transactions.length} รายการ)
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{transaction.detail}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString('th-TH')} • 
                    <span className="text-blue-600 ml-1">{transaction.tag}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} ฿
                  </p>
                </div>
              </div>
            ))}
          </div>
          {transactions.length > 5 && (
            <p className="text-sm text-gray-500 text-center mt-2">
              และอีก {transactions.length - 5} รายการ...
            </p>
          )}
        </div>
      )}

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            คำแนะนำจาก AI
          </h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {analysis}
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      {!analysis && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-800 mb-1">วิเคราะห์รายจ่าย</h4>
            <p className="text-sm text-gray-600">
              ดูว่าคุณใช้เงินไปกับอะไรมากที่สุด
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-semibold text-gray-800 mb-1">แนะนำการออม</h4>
            <p className="text-sm text-gray-600">
              รับคำแนะนำวิธีประหยัดและออมเงิน
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-800 mb-1">เป้าหมายการเงิน</h4>
            <p className="text-sm text-gray-600">
              ติดตามความคืบหน้าสู่เป้าหมาย
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
