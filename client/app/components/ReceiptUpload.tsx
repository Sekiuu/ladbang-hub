"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { analyzeReceiptImage, TransactionData } from "@/lib/ai-api";
import { apiPost } from "@/app/api";

export default function ReceiptUpload() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TransactionData[]>([]);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setResults([]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !session?.user?.id) {
      setError("กรุณาเลือกไฟล์และ login");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const transactions = await analyzeReceiptImage(file, session.user.id);
      setResults(transactions);
    } catch (err) {
      console.error("Receipt upload error:", err);
      setError("ไม่สามารถวิเคราะห์ใบเสร็จได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setResults([]);
    setError("");
    setSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAll = async () => {
    if (results.length === 0 || !session?.user?.id) {
      setError("ไม่มีรายการที่จะบันทึก");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // บันทึกแต่ละรายการ
      for (const transaction of results) {
        const response = await apiPost("/transactions", {
          amount: transaction.amount,
          type: transaction.type,
          detail: transaction.detail,
          tag: transaction.tag,
          user_id: session.user.id,
        });

        if (!response?.success) {
          throw new Error("Failed to save transaction");
        }
      }

      setSavedSuccess(true);
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      console.error("Save error:", err);
      setError("ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  };

  const getTotalAmount = () => {
    return results.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📸 Upload Receipt
        </h2>
        <p className="text-gray-600">
          ถ่ายรูปหรืออัปโหลดใบเสร็จ AI จะช่วยบันทึกรายการอัตโนมัติ
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <label className="block w-full">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              preview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-600">{file?.name}</p>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  คลิกเพื่ออัปโหลดรูปภาพ
                </p>
                <p className="text-xs text-gray-500">PNG, JPG ขนาดไม่เกิน 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleUpload}
          disabled={!file || loading || !session?.user?.id}
          className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
            "🔍 วิเคราะห์ใบเสร็จ"
          )}
        </button>
        {file && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            รีเซ็ต
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              ✅ พบ {results.length} รายการ
            </h3>
            <div className="space-y-2">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.detail}</p>
                    <p className="text-sm text-gray-500">
                      หมวดหมู่: <span className="text-blue-600">{item.tag}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      -{item.amount.toFixed(2)} ฿
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">รวมทั้งหมด</span>
                <span className="text-2xl font-bold text-red-600">
                  -{getTotalAmount().toFixed(2)} ฿
                </span>
              </div>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={saving || savedSuccess}
              className="w-full mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                  กำลังบันทึก...
                </span>
              ) : savedSuccess ? (
                "✅ บันทึกสำเร็จ!"
              ) : (
                "💾 บันทึกรายการทั้งหมด"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {savedSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-center">✅ บันทึกรายการทั้งหมดเรียบร้อยแล้ว!</p>
        </div>
      )}

   
    </div>
  );
}
