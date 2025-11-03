export type UserData = {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
};

export type UserBase = {
  id: string;
  username: string;
  email: string;
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
}

export type UserSettingBase = {
  user_id: string;
  daily_spending_limit: number;
  monthly_income: number;
  notify_over_budget: boolean;
  notify_low_saving: boolean;
  goal_description: string;
  conclusion_routine: string;
};
