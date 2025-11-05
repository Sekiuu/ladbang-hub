"use client";

import { useState } from "react";
import AIChat from "../components/AIChat";
import { useSession } from "next-auth/react";
import { api } from "../api";
import { UserSettingBase } from "@/lib/schema/users";
import { redirect } from "next/navigation";

const UserSettingPage = () => {
  const [goal, setGoal] = useState("");
  const [setting, setSetting] = useState<UserSettingBase | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await api.post("/usersetting/", {
        user_id: session.user.id,
        goal_description: goal,
        daily_spending_limit: setting?.daily_spending_limit,
        monthly_income: setting?.monthly_income,
        notify_over_budget: setting?.notify_over_budget,
        notify_low_saving: setting?.notify_low_saving,
        conclusion_routine: setting?.conclusion_routine,
      });
      if (response?.success) {
        setGoal("");
        setSetting(null);
        redirect("/");
      } else {
        console.error("Error submitting user setting:", response?.message);
      }
    } catch (error) {
      console.error("Error submitting user setting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>User Setting</h1>
      <AIChat />
    </>
  );
};

export default UserSettingPage;
