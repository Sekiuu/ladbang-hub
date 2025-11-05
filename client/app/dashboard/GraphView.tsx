"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { Transaction } from "@/lib/schema/transaction";

interface GraphViewProps {
  transactions: Transaction[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function GraphView({ transactions }: GraphViewProps) {
  const [timeframe, setTimeframe] = useState("monthly"); // daily, weekly, monthly, yearly
  const [pieChartMode, setPieChartMode] = useState<"expense" | "income">(
    "expense"
  );

  const lineChartData = useMemo(() => {
    if (!transactions) return [];

    const formatters: { [key: string]: (date: Date) => string } = {
      daily: (date) => format(date, "yyyy-MM-dd"),
      weekly: (date) => format(startOfWeek(date), "yyyy-MM-dd"),
      monthly: (date) => format(startOfMonth(date), "yyyy-MM"),
      yearly: (date) => format(startOfYear(date), "yyyy"),
    };

    const formatter = formatters[timeframe];

    const grouped = transactions.reduce((acc, t) => {
      if (!t.created_at) return acc;
      const dateKey = formatter(parseISO(t.created_at));
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, income: 0, expense: 0 };
      }
      if (t.type === "income") {
        acc[dateKey].income += t.amount;
      } else {
        acc[dateKey].expense += t.amount;
      }
      return acc;
    }, {} as { [key: string]: { date: string; income: number; expense: number } });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, timeframe]);

  const pieChartData = useMemo(() => {
    const filtered = transactions.filter(
      (t) => t.type === pieChartMode && t.tag
    );
    const grouped = filtered.reduce((acc, t) => {
      const tag = t.tag || "Uncategorized";
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag] += t.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions, pieChartMode]);

  return (
    <div className="space-y-6">
      {/* Line Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-light text-slate-700 mb-2 sm:mb-0">
            Transaction Trends
          </h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-slate-700 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white font-light text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-light text-slate-700 mb-2 sm:mb-0">
            Category Breakdown
          </h2>
          <div className="flex gap-2 bg-sky-50 p-1 rounded-xl">
            <button
              onClick={() => setPieChartMode("expense")}
              className={`px-4 py-2 text-sm font-light rounded-lg transition ${
                pieChartMode === "expense"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setPieChartMode("income")}
              className={`px-4 py-2 text-sm font-light rounded-lg transition ${
                pieChartMode === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Income
            </button>
          </div>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `฿${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 font-light">
                No data available for {pieChartMode} categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
