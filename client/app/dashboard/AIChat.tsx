"use client";

import React, { useState } from "react";
import { sendPromptToAI } from "@/lib/ai-api";
import { CheckCircle, Send, Sparkles } from "lucide-react";
import { BsRobot } from "react-icons/bs";
import ReactMarkdown from "react-markdown";

type Transaction = {
  amount: number;
  type: "income" | "expense";
  detail: string | "";
};

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  transactions: Transaction[];
}

const suggestedQuestions = [
  "วิเคราะห์การใช้จ่าย",
  "ควรลดค่าใช้จ่ายตรงไหน",
  "แนะนำการออม",
];

export default function AIChat({ transactions }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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
          .map(
            (t) =>
              `- ${t.detail}: ${t.amount} บาท (${
                t.type === "income" ? "รายรับ" : "รายจ่าย"
              })`
          )
          .join("\n");
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-sky-400 to-cyan-400 text-white">
        <div className="flex items-center gap-2">
          <BsRobot className="w-6 h-6" />
          <h2 className="text-xl font-light">AI Assistant</h2>
        </div>
        <p className="text-sm opacity-90 font-light mt-1">
          {transactions.length > 0
            ? `${transactions.length} transactions loaded`
            : "Ask anything"}
        </p>
      </div>

      <div className="p-6 h-96 overflow-y-auto space-y-4 bg-sky-50/30">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-8">
            <BsRobot className="w-16 h-16 mx-auto mb-4 text-sky-400" />
            <p className="text-lg mb-4 font-light">
              Hey! How can I help?
              {transactions.length > 0 && (
                <span className="flex items-center justify-center text-sm text-sky-600 mt-2 gap-1">
                  <CheckCircle className="w-4 h-4" /> {transactions.length}{" "}
                  transactions ready
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
                  <Sparkles className="w-4 h-4 text-sky-400" /> {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white"
                    : "bg-white text-slate-700 border border-sky-100"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap font-light">
                    {msg.content}
                  </p>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-base font-semibold text-slate-800 mt-3 mb-2"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-sm font-medium text-slate-700 mt-2 mb-1"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside space-y-1 my-2"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside space-y-1 my-2"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li
                            className="text-slate-700 font-light text-sm"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="text-slate-700 font-light text-sm my-1"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-slate-800"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-xs font-mono"
                            {...props}
                          />
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

      <form
        onSubmit={handleAISubmit}
        className="p-4 border-t border-sky-100 bg-white"
      >
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
                <Send className="w-4 h-4" /> Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
