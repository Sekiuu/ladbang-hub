export const INCOME_TAGS = [
  "Salary",
  "Freelance",
  "Investment",
  "Bonus",
  "Gift",
  "Other",
];

export const EXPENSE_TAGS = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Travel",
  "Other",
];

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  detail: string;
  tag: string;
  created_at?: string;
};

export type TransactionCreate = Omit<Transaction, "id" | "created_at">;
