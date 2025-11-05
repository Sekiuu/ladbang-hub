"use client";

import AIChat from "../components/AIChat";
import FinanceAnalysis from "../components/FinanceAnalysis";
import ReceiptUpload from "../components/ReceiptUpload";
import { useState } from "react";

type Tab = "chat" | "analysis" | "receipt";

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<Tab>("analysis");

  const tabs = [
    { id: "analysis" as Tab, label: "📊 วิเคราะห์การเงิน", icon: "📊" },
    { id: "chat" as Tab, label: "💬 AI Advisor", icon: "💬" },
    { id: "receipt" as Tab, label: "📸 สแกนใบเสร็จ", icon: "📸" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Financial Assistant
          </h1>
          <p className="text-gray-600">
            ผู้ช่วยด้านการเงินอัจฉริยะที่ขับเคลื่อนด้วย Google Gemini AI
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === "analysis" && <FinanceAnalysis />}
          {activeTab === "chat" && <AIChat />}
          {activeTab === "receipt" && <ReceiptUpload />}
        </div>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">วิเคราะห์อัจฉริยะ</h3>
            <p className="text-sm text-gray-600">
              AI วิเคราะห์รายรับรายจ่ายและให้คำแนะนำแบบเฉพาะบุคคล
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold text-gray-800 mb-2">คำปรึกษา 24/7</h3>
            <p className="text-sm text-gray-600">
              ถามคำถามเกี่ยวกับการเงินได้ทุกเมื่อ AI พร้อมช่วยเสมอ
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">บันทึกอัตโนมัติ</h3>
            <p className="text-sm text-gray-600">
              สแกนใบเสร็จและบันทึกรายการอัตโนมัติด้วย AI
            </p>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash 🚀</p>
        </div>
      </div>
    </div>
  );
}
