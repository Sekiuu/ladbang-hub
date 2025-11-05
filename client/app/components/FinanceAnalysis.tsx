"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { analyzeUserTransactions } from "@/lib/ai-api";

export default function FinanceAnalysis() {
  const { data: session } = useSession();
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
          disabled={loading || !session?.user?.id}
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">❌ {error}</p>
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
