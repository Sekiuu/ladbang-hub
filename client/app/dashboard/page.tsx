"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { api } from "../api";
import ButtonUI from "../components/ui/Button";
import { UserBase } from "@/lib/schema/users";
import { sendPromptToAI, analyzeReceiptImage, analyzeUserTransactions } from "@/lib/ai-api";
import { Upload, X, MessageCircle, TrendingUp, TrendingDown, History, Send, Sparkles, Image, Edit3, CheckCircle, Plus, BarChart3 } from "lucide-react";
import { BsRobot } from "react-icons/bs";
import { MdOutlineUploadFile } from "react-icons/md";
import ReactMarkdown from "react-markdown";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  detail: string | "";
  tag: string;
  created_at?: string;
};

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const { data: session } = useSession();
  
  // Add Record states
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  // Image upload states
  const [uploadMode, setUploadMode] = useState<"manual" | "image">("manual");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // AI Financial Analysis states
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>("");

  // Load transactions
  useEffect(() => {
    if ((session?.user as UserBase)?.id) {
      loadTransactions();
    }
  }, [session]);

  // Calculate balance
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
      setError("ไม่สามารถโหลดข้อมูลธุรกรรมได้");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file || !session?.user?.id) {
      setError("กรุณาเลือกไฟล์");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const results = await analyzeReceiptImage(file, (session.user as UserBase).id);
      
      if (results && results.length > 0) {
        // บันทึกแต่ละรายการ
        for (const transaction of results) {
          await api.post("/transactions", {
            user_id: (session?.user as UserBase)?.id,
            amount: transaction.amount,
            detail: transaction.detail,
            type: transaction.type,
            tag: transaction.tag,
          });
        }

        // Reset form
        setFile(null);
        setPreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        await loadTransactions();
 
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
      const transaction = {
        user_id: (session?.user as UserBase)?.id,
        amount: parseFloat(amount),
        detail: detail || "",
        type: type,
        tag: "",
      };
      const response = await api.post("/transactions", transaction);

      if (response?.success) {
        setAmount("");
        setDetail("");
        setType("income");
        await loadTransactions();
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

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || aiLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAiLoading(true);

    try {
      let contextPrompt = userMessage.content;
      
      if (transactions.length > 0) {
        const transactionSummary = transactions
          .slice(0, 20)
          .map(t => `- ${t.detail}: ${t.amount} บาท (${t.type === 'income' ? 'รายรับ' : 'รายจ่าย'})`)
          .join('\n');
        
        contextPrompt = `ข้อมูลประวัติรายรับรายจ่ายของฉัน:\n${transactionSummary}\n\nคำถาม: ${userMessage.content}\n\nกรุณาให้คำแนะนำโดยอ้างอิงจากข้อมูลประวัติการใช้จ่ายของฉันด้วย`;
      }

      const response = await sendPromptToAI(contextPrompt);
      const aiMessage: Message = {
        role: "ai",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat error:", error);
      const errorMessage: Message = {
        role: "ai",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!session?.user?.id) {
      setAnalysisError("Please sign in");
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysis("");

    try {
      const result = await analyzeUserTransactions(session.user.id);
      // Clean up the response - remove \n artifacts and normalize line breaks
      const cleanedResult = result
        .replace(/\\n/g, '\n')  // Convert literal \n to actual newlines
        .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
        .trim();
      setAnalysis(cleanedResult);
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisError("Analysis failed. Please try again.");
    } finally {
      setAnalysisLoading(false);
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

  const suggestedQuestions = [
    "วิเคราะห์การใช้จ่าย",
    "ควรลดค่าใช้จ่ายตรงไหน",
    "แนะนำการออม",
  ];

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <p className="text-xl font-light text-slate-600">Please sign in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-slate-700">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left & Center Column - AI Chat and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-8">
              <h2 className="text-sm font-medium mb-3 text-slate-500 uppercase tracking-wide">
                Balance
              </h2>
              <p className="text-5xl font-light text-sky-600">
                ฿{balance.toLocaleString()}
              </p>
            </div>

            {/* AI Chat Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              {/* AI Header */}
              <div className="p-6 bg-gradient-to-r from-sky-400 to-cyan-400 text-white">
                <div className="flex items-center gap-2">
                  <BsRobot className="w-6 h-6" />
                  <h2 className="text-xl font-light">AI Assistant</h2>
                </div>
                <p className="text-sm opacity-90 font-light mt-1">
                  {transactions.length > 0 ? `${transactions.length} transactions loaded` : 'Ask anything'}
                </p>
              </div>

              {/* Messages */}
              <div className="p-6 h-96 overflow-y-auto space-y-4 bg-sky-50/30">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 mt-8">
                    <BsRobot className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                    <p className="text-lg mb-4 font-light">
                      Hey! How can I help?
                      {transactions.length > 0 && (
                        <span className="flex items-center justify-center text-sm text-sky-600 mt-2 gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {transactions.length} transactions ready
                        </span>
                      )}
                    </p>
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(question)}
                          className="p-4 text-sm bg-white hover:bg-sky-50 rounded-xl text-left transition border border-sky-100 font-light text-slate-600 flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-sky-400" />
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-sky-500 text-white"
                            : "bg-white text-slate-700 border border-sky-100"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap font-light">{msg.content}</p>
                        ) : (
                          <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown
                              components={{
                                h2: ({ node, ...props }) => (
                                  <h2 className="text-base font-semibold text-slate-800 mt-3 mb-2" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3 className="text-sm font-medium text-slate-700 mt-2 mb-1" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="list-disc list-inside space-y-1 my-2" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                  <li className="text-slate-700 font-light text-sm" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                  <p className="text-slate-700 font-light text-sm my-1" {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                  <strong className="font-semibold text-slate-800" {...props} />
                                ),
                                code: ({ node, ...props }) => (
                                  <code className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                        <p className="text-xs mt-2 opacity-70">
                          {msg.timestamp.toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-sky-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Input */}
              <form onSubmit={handleAISubmit} className="p-4 border-t border-sky-100 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={aiLoading}
                    className="flex-1 px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent disabled:bg-sky-50 text-slate-700 font-light"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !input.trim()}
                    className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition font-light flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* AI Financial Analysis Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-6 h-6 text-sky-600" />
                  <h2 className="text-xl font-light text-slate-700">
                    AI Financial Analysis
                  </h2>
                </div>
                <p className="text-sm text-slate-500 font-light">
                  Analyze your spending with AI and get financial advice
                </p>
              </div>

              {/* Summary Cards */}
              {transactions.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Income</p>
                    <p className="text-2xl font-light text-emerald-600">
                      +฿{summary.income.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Expense</p>
                    <p className="text-2xl font-light text-rose-600">
                      -฿{summary.expense.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Net</p>
                    <p className={`text-2xl font-light ${summary.balance >= 0 ? 'text-sky-600' : 'text-rose-600'}`}>
                      {summary.balance >= 0 ? '+' : ''}฿{summary.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mb-6">
                <button
                  onClick={handleAnalyze}
                  disabled={analysisLoading || !session?.user?.id || transactions.length === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-light rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-300 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
                >
                  {analysisLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Analysis
                    </>
                  )}
                </button>
                {transactions.length === 0 && (
                  <p className="text-sm text-rose-500 mt-2 font-light flex items-center gap-1">
                    <X className="w-4 h-4" />
                    No transactions found. Please add transactions first.
                  </p>
                )}
              </div>

              {/* Error Message */}
              {analysisError && (
                <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <p className="text-rose-600 font-light flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {analysisError}
                  </p>
                </div>
              )}

              {/* Analysis Result */}
              {analysis && (
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-6 border border-sky-200">
                  <h3 className="text-lg font-light text-slate-700 mb-4 flex items-center gap-2">
                    <BsRobot className="w-5 h-5 text-sky-600" />
                    AI Recommendations
                  </h3>
                  <div className="prose prose-sm prose-slate max-w-none markdown-content">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-semibold text-slate-800 mt-4 mb-2 flex items-center gap-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-base font-medium text-slate-700 mt-3 mb-2" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-inside space-y-1 my-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-slate-700 font-light" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-slate-700 font-light my-2" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-slate-800" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                          <code className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                        ),
                      }}
                    >
                      {analysis}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Transactions Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-light text-slate-700">
                  History
                </h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.slice().reverse().map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 border border-sky-100 rounded-xl hover:bg-sky-50/50 transition"
                  >
                    <div>
                      <p className="text-sm text-slate-500 font-light">
                        {t.type === "income" ? "รายรับ" : "รายจ่าย"}
                      </p>
                      <p className="font-light text-slate-700 mt-1">{t.detail}</p>
                    </div>
                    <p
                      className={`text-lg font-light ${
                        t.type === "income" ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}฿{t.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-slate-400 py-12 font-light">
                    ยังไม่มีประวัติธุรกรรม
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Add Record */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-light text-slate-700">
                  New Transaction
                </h2>
              </div>

              {/* Mode Toggle */}
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
                  <Edit3 className="w-4 h-4" />
                  Manual
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
                  <Image className="w-4 h-4" />
                  Upload
                </button>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm mb-4 font-light">
                  {error}
                </div>
              )}

              {/* Manual Mode */}
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
                        <TrendingUp className="w-4 h-4" />
                        Income
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
                        <TrendingDown className="w-4 h-4" />
                        Expense
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
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
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
                      Description
                    </label>
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      required
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
                /* Image Upload Mode */
                <div className="space-y-5">
                  {/* Upload Area */}
                  <div>
                    <label className="block w-full">
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                          preview
                            ? "border-sky-300 bg-sky-50/50"
                            : "border-sky-200 hover:border-sky-400 hover:bg-sky-50/30"
                        }`}
                      >
                        {preview ? (
                          <div className="relative">
                            <img
                              src={preview}
                              alt="Receipt preview"
                              className="max-h-48 mx-auto rounded-xl shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveImage();
                              }}
                              className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1.5 hover:bg-rose-600 transition"
                            >
                              <X size={18} />
                            </button>
                            <p className="text-sm text-slate-600 mt-3 font-light">{file?.name}</p>
                          </div>
                        ) : (
                          <div>
                            <MdOutlineUploadFile className="mx-auto h-12 w-12 text-sky-300" />
                            <p className="mt-3 text-sm text-slate-600 font-light">
                              Click to upload receipt
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
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={!file || analyzing}
                    className="w-full px-4 py-3 bg-sky-500 text-white font-light rounded-xl hover:bg-sky-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze & Save
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 text-center font-light flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI will analyze and save automatically
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
