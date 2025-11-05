import React from "react";

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-4">
      <h2 className="text-sm font-medium mb-3 text-slate-500 uppercase tracking-wide">
        Balance
      </h2>
      <p className="text-5xl font-light text-sky-600">
        ฿{balance.toLocaleString()}
      </p>
    </div>
  );
}
