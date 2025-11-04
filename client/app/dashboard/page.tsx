"use client";
import React from "react";
import { api } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Bell, Plus } from "lucide-react";

// Single-file React + Tailwind component. Default export a component.
// This is a starting point — you can plug it into a Create React App / Vite + Tailwind project.

const lineData = [
  { month: "Jan", income: 3200, expenses: 2800 },
  { month: "Feb", income: 3400, expenses: 3000 },
  { month: "Mar", income: 3000, expenses: 2900 },
  { month: "Apr", income: 3600, expenses: 3100 },
  { month: "May", income: 3900, expenses: 3500 },
  { month: "Jun", income: 3700, expenses: 3200 },
];

const pieData = [
  { name: "Food & Dining", value: 35 },
  { name: "Transportation", value: 20 },
  { name: "Shopping", value: 20 },
  { name: "Entertainment", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = ["#F97316", "#06B6D4", "#A78BFA", "#F43F5E", "#10B981"];

export default function FinanceDashboard() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,_#f472b6_-15%,_#ffffff_50%,_#c084fc_110%)] text-slate-800 font-sans">
      <div className="max-w-[1280px] mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">FF</div>
              <div>
                <div className="font-semibold">FinanceFlow</div>
                <div className="text-xs text-slate-400">Financial Discipline</div>
              </div>
            </div>

            <nav className="mt-4 flex-1">
              <ul className="flex flex-col gap-2">
                <li className="text-sm font-medium text-indigo-600">Dashboard</li>
                <li className="text-sm text-slate-500">Balance Records</li>
                <li className="text-sm text-slate-500">Goals & Tracking</li>
                <li className="text-sm text-slate-500">AI Helper</li>
                <li className="text-sm text-slate-500">Reports</li>
                <li className="text-sm text-slate-500">Settings</li>
              </ul>
            </nav>

            <div className="text-xs text-slate-400">Sarah Johnson</div>
            <div className="text-xs text-slate-300">Premium User</div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <header className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Financial Dashboard</h1>
                <p className="text-sm text-slate-500">Track your financial habits and achieve your goals</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-500" />
                </div>
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl">
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>
            </header>

            {/* Top metrics */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Current Balance</div>
                    <div className="mt-2 flex items-baseline gap-6">
                      <div>
                        <div className="text-xl text-green-600 font-bold">$12,450</div>
                        <div className="text-xs text-slate-400">Total Income</div>
                      </div>
                      <div>
                        <div className="text-xl text-red-600 font-bold">$8,720</div>
                        <div className="text-xs text-slate-400">Total Expenses</div>
                      </div>
                      <div>
                        <div className="text-xl text-sky-600 font-bold">$3,730</div>
                        <div className="text-xs text-slate-400">Net Balance</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500">This Month ▾</div>
                </div>

                {/* Spending categories + monthly trend */}
                <div className="grid grid-cols-12 gap-4 mt-6">
                  <div className="col-span-6 bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Spending Categories</h3>
                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={80}
                            paddingAngle={4}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="col-span-6 bg-white p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Monthly Trend</h3>
                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={lineData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                          <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h4 className="text-sm text-slate-500">AI Insights</h4>
                  <p className="mt-2 text-sm">Your spending on dining out increased by 23% this month. Consider setting a weekly limit.</p>
                  <button className="mt-3 text-sm text-indigo-600">View Details</button>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="text-sm text-slate-500">Emergency Fund</div>
                  <div className="mt-2 font-semibold">$4,200 / $10,000</div>
                  <div className="text-xs text-slate-400 mt-1">Keep saving $480/month to reach your goal by Dec 2024</div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="text-sm text-slate-500">Vacation Fund</div>
                  <div className="mt-2 font-semibold">$2,800 / $5,000</div>
                  <div className="text-xs text-slate-400 mt-1">On track! Continue saving $220/month</div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="text-sm text-slate-500">New Car</div>
                  <div className="mt-2 font-semibold">$8,500 / $25,000</div>
                  <div className="text-xs text-slate-400 mt-1">Consider increasing monthly savings to $650</div>
                </div>
              </div>
            </div>

            {/* Bottom area: Recent transactions & AI Recommendations */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">🍽️</div>
                      <div>
                        <div className="font-medium">Restaurant Dinner</div>
                        <div className="text-xs text-slate-400">Today, 7:30 PM</div>
                      </div>
                    </div>
                    <div className="text-rose-500">-$45.80</div>
                  </li>

                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">💰</div>
                      <div>
                        <div className="font-medium">Salary Deposit</div>
                        <div className="text-xs text-slate-400">Yesterday, 9:00 AM</div>
                      </div>
                    </div>
                    <div className="text-emerald-600">+$3,200.00</div>
                  </li>

                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">⛽</div>
                      <div>
                        <div className="font-medium">Gas Station</div>
                        <div className="text-xs text-slate-400">2 days ago</div>
                      </div>
                    </div>
                    <div className="text-rose-500">-$52.30</div>
                  </li>
                </ul>
              </div>

              <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
                <div className="flex flex-col gap-3">
                  <div className="border-l-4 border-amber-300 bg-amber-50 p-3 rounded-md text-sm">⚠️ High Dining Expenses — You've spent $340 on dining this week. Consider meal planning.</div>
                  <div className="border-l-4 border-emerald-200 bg-emerald-50 p-3 rounded-md text-sm">✅ Great Progress! You're 15% ahead of your emergency fund goal this month.</div>
                  <div className="border-l-4 border-slate-200 bg-slate-50 p-3 rounded-md text-sm">💡 Tip — Set up automatic transfers to reach your vacation fund faster.</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
