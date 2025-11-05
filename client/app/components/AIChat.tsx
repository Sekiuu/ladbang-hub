"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { sendPromptToAI } from "@/lib/ai-api";
import { api } from "@/app/api";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  detail: string;
  tag: string;
  created_at: string;
}

export default function AIChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // ดึงข้อมูล transactions เมื่อ component mount
  useEffect(() => {
    if (session?.user?.id) {
      loadTransactions();
    }
  }, [session?.user?.id]);

  const loadTransactions = async () => {
    if (!session?.user?.id) return;
    
    setLoadingTransactions(true);
    try {
      const response = await api.get(`/transactions/user/${session.user.id}`);
      if (response?.success && response.body) {
        setTransactions(response.body.slice(0, 20)); // เอา 20 รายการล่าสุด
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // สร้าง context จากประวัติ transactions
      let contextPrompt = userMessage.content;
      
      if (transactions.length > 0) {
        const transactionSummary = transactions
          .map(t => `- ${t.detail}: ${t.amount} บาท (${t.tag}) - ${new Date(t.created_at).toLocaleDateString('th-TH')}`)
          .join('\n');
        
        contextPrompt = `ข้อมูลประวัติรายรับรายจ่ายของฉัน (${transactions.length} รายการล่าสุด):\n${transactionSummary}\n\nคำถาม: ${userMessage.content}\n\nกรุณาให้คำแนะนำโดยอ้างอิงจากข้อมูลประวัติการใช้จ่ายของฉันด้วย`;
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
        content: "ขอโทษครับ เกิดข้อผิดพลาดในการติดต่อ AI กรุณาลองใหม่อีกครั้ง",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "วิเคราะห์การใช้จ่ายของฉันหน่อย",
    "ฉันควรลดค่าใช้จ่ายตรงไหน",
    "แนะนำวิธีประหยัดเงินตามข้อมูลของฉัน",
    "ช่วยวิเคราะห์พฤติกรรมการใช้เงินของฉัน",
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <h2 className="text-xl font-bold">💬 AI Financial Advisor</h2>
        <p className="text-sm opacity-90">
          ถามคำถามเกี่ยวกับการเงินได้เลย {transactions.length > 0 && `(มีข้อมูล ${transactions.length} รายการ)`}
        </p>
        {loadingTransactions && (
          <p className="text-xs opacity-75 mt-1">กำลังโหลดข้อมูล...</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-4">
              🤖 สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?
              {transactions.length > 0 && (
                <span className="block text-sm text-green-600 mt-2">
                  ✅ ระบบโหลดข้อมูลรายรับรายจ่าย {transactions.length} รายการแล้ว
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="p-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition"
                >
                  💡 {question}
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
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์คำถามของคุณ..."
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? "⏳" : "ส่ง"}
          </button>
        </div>
      </form>
    </div>
  );
}
