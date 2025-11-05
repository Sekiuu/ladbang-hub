import React from "react";
import { History } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  detail: string | "";
};

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-slate-700" />
        <h2 className="text-xl font-light text-slate-700">History</h2>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length > 0 ? (
          transactions
            .slice()
            .reverse()
            .map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 border border-sky-100 rounded-xl hover:bg-sky-50/50 transition"
              >
                <div>
                  <p className="text-sm text-slate-500 font-light">
                    {t.type === "income" ? "รายรับ" : "รายจ่าย"}
                  </p>
                  <p className="font-light text-slate-700 mt-1 max-w-4/5">
                    {t.detail}
                  </p>
                </div>
                <p
                  className={`text-lg font-light w-full max-w-1/5 text-pretty ${
                    t.type === "income" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}฿{t.amount.toLocaleString()}
                </p>
              </div>
            ))
        ) : (
          <p className="text-center text-slate-400 py-12 font-light">
            ยังไม่มีประวัติธุรกรรม
          </p>
        )}
      </div>
    </div>
  );
}
