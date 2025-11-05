"use client";

import React, { useState } from "react";
import { analyzeUserTransactions } from "@/lib/ai-api";
import { BarChart3, Sparkles, X } from "lucide-react";
import { BsRobot } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { Transaction } from "@/lib/schema/transaction";

interface AIFinancialAnalysisProps {
  transactions: Transaction[];
  userId: string;
}

export default function AIFinancialAnalysis({
  transactions,
  userId,
}: AIFinancialAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!userId) {
      setAnalysisError("Please sign in");
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysis("");
    try {
      const result = await analyzeUserTransactions(userId);
      const cleanedResult = result
        .replace(/\\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-6">
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

      {transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
              Income
            </p>
            <p className="text-2xl font-light text-emerald-600">
              +฿{summary.income.toLocaleString()}
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
              Expense
            </p>
            <p className="text-2xl font-light text-rose-600">
              -฿{summary.expense.toLocaleString()}
            </p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
              Net
            </p>
            <p
              className={`text-2xl font-light ${
                summary.balance >= 0 ? "text-sky-600" : "text-rose-600"
              }`}
            >
              {summary.balance >= 0 ? "+" : ""}฿
              {summary.balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleAnalyze}
          disabled={analysisLoading || !userId || transactions.length === 0}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-light rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-200 disabled:to-slate-300 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
        >
          {analysisLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Start Analysis
            </>
          )}
        </button>
        {transactions.length === 0 && (
          <p className="text-sm text-rose-500 mt-2 font-light flex items-center gap-1">
            <X className="w-4 h-4" /> No transactions found. Please add
            transactions first.
          </p>
        )}
      </div>

      {analysisError && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-rose-600 font-light flex items-center gap-2">
            <X className="w-4 h-4" /> {analysisError}
          </p>
        </div>
      )}

      {analysis && (
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-sky-200">
          <h3 className="text-lg font-light text-slate-700 mb-4 flex items-center gap-2">
            <BsRobot className="w-5 h-5 text-sky-600" /> AI Recommendations
          </h3>
          <div className="prose prose-sm prose-slate max-w-none markdown-content">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-lg font-semibold text-slate-800 mt-4 mb-2 flex items-center gap-2"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-base font-medium text-slate-700 mt-3 mb-2"
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
                  <li className="text-slate-700 font-light" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-slate-700 font-light my-2" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-slate-800" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  />
                ),
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
