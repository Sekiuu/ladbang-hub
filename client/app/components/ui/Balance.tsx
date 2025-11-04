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
    console.log((session?.user as UserBase)?.id);
  }, [session]);

  // Calculate balance when transactions change
  useEffect(() => {
    // ผลรวมจาก transactions เดิม
    console.log(transactions);
    const transactionsBalance = transactions.reduce((acc, t) => {
      return acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount));
    }, 0);

    setBalance(transactionsBalance);
    console.log(transactionsBalance, balance);
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
    <div>
       <div className="bg-white rounded-lg shadow p-6 mb-8 min-h-2 w-72 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            ยอดเงินคงเหลือ
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            ฿{balance.toLocaleString()}
          </p>
        </div>
    </div>
  )
}

export default Balance
