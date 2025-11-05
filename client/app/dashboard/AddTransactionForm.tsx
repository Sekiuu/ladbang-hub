"use client";

import React, { useState, useRef } from "react";
import { api } from "@/app/api";
// import { analyzeReceiptImage } from "@/lib/ai-api";
import {
  Plus,
  Edit3,
  Image,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles,
} from "lucide-react";
import { MdOutlineUploadFile } from "react-icons/md";
import {
  INCOME_TAGS,
  EXPENSE_TAGS,
  Transaction,
} from "@/lib/schema/transaction";

interface AddTransactionFormProps {
  userId: string;
  onTransactionAdded: () => Promise<void>;
}

export default function AddTransactionForm({
  userId,
  onTransactionAdded,
}: AddTransactionFormProps) {
  // Add Record states
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [type, setType] = useState<Transaction["type"]>("income");
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image upload states
  const [uploadMode, setUploadMode] = useState<"manual" | "image">("manual");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setError(null);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prevPreviews) => [
            ...prevPreviews,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageUpload = async () => {
    if (files.length === 0 || !userId) {
      setError("Please select at least one file.");
      return;
    }
    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    for (const imageFile of files) {
      formData.append("images", imageFile);
    }

    try {
      const results = await api.post(
        `/transactions/images/${userId}`,
        formData
      );
      if (results && results.body.length > 0) {
        setFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await onTransactionAdded();
      }
    } catch (err) {
      console.error("Image analysis error:", err);
      setError("ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/transactions", {
        user_id: userId,
        amount: parseFloat(amount),
        detail: detail || "",
        type,
        tag: tag || "",
      });
      if (response?.success) {
        setAmount("");
        setDetail("");
        setType("income");
        setTag("");
        await onTransactionAdded();
      } else {
        setError(response?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-slate-700" />
        <h2 className="text-xl font-light text-slate-700">New Transaction</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setUploadMode("manual")}
          className={`flex-1 py-3 px-4 rounded-xl font-light transition flex items-center justify-center gap-2 ${
            uploadMode === "manual"
              ? "bg-sky-500 text-white"
              : "bg-sky-50 text-slate-600 hover:bg-sky-100"
          }`}
        >
          <Edit3 className="w-4 h-4" /> Manual
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("image")}
          className={`flex-1 py-3 px-4 rounded-xl font-light transition flex items-center justify-center gap-2 ${
            uploadMode === "image"
              ? "bg-sky-500 text-white"
              : "bg-sky-50 text-slate-600 hover:bg-sky-100"
          }`}
        >
          <Image className="w-4 h-4" /> Upload
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm mb-4 font-light">
          {error}
        </div>
      )}

      {uploadMode === "manual" ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light text-slate-600 mb-3">
              Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl font-light transition flex items-center justify-center gap-2 ${
                  type === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-sky-50 text-slate-600 hover:bg-sky-100"
                }`}
                onClick={() => setType("income")}
              >
                <TrendingUp className="w-4 h-4" /> Income
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl font-light transition flex items-center justify-center gap-2 ${
                  type === "expense"
                    ? "bg-rose-500 text-white"
                    : "bg-sky-50 text-slate-600 hover:bg-sky-100"
                }`}
                onClick={() => setType("expense")}
              >
                <TrendingDown className="w-4 h-4" /> Expense
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-light text-slate-600 mb-3">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-slate-700 font-light"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-600 mb-3">
              Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              list={type === "income" ? "income-tags" : "expense-tags"}
              className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-slate-700 font-light"
              placeholder="What's this catagorised as?"
            />
            <datalist id="income-tags" className="bg-white/50">
              {INCOME_TAGS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <datalist id="expense-tags" className="bg-white/50">
              {EXPENSE_TAGS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-light text-slate-600 mb-3">
              Description
            </label>
            <input
              type="text"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-slate-700 font-light"
              placeholder="What's this for?"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition font-light"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block w-full">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  previews.length > 0
                    ? "border-sky-300 bg-sky-50/50"
                    : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/30"
                }`}
              >
                {previews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Receipt preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-1 right-1 bg-rose-500/80 text-white rounded-full p-1 hover:bg-rose-600 transition backdrop-blur-sm"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <MdOutlineUploadFile className="mx-auto h-12 w-12 text-sky-300" />
                    <p className="mt-3 text-sm text-slate-600 font-light">
                      Click to upload receipt(s)
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-light">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={files.length === 0 || analyzing}
            className="w-full px-4 py-3 bg-sky-500 text-white font-light rounded-xl hover:bg-sky-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Analyze & Save
              </>
            )}
          </button>
          <p className="text-xs text-slate-400 text-center font-light flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> AI will analyze and save
            automatically
          </p>
        </div>
      )}
    </div>
  );
}
