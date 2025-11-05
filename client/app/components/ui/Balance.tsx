import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "../../api";
import { UserBase } from "@/lib/schema/users";

function Balance() {
  const [balance, setBalance] = useState(0);
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  type Transaction = {
    id: string;
    user_id: string;
    amount: number;
    type: "income" | "expense";
    detail: string | "";
    tag: string;
  };

  useEffect(() => {
    if ((session?.user as UserBase)?.id) {
      loadTransactions();
    }
  }, [session]);

  // Calculate balance when transactions change
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm p-8">
      <h2 className="text-sm font-medium mb-3 text-slate-500 uppercase tracking-wide">
        Balance
      </h2>
      <p className="text-5xl font-light text-sky-600">
        ฿{balance.toLocaleString()}
      </p>
    </div>
  );
}

export default Balance;
