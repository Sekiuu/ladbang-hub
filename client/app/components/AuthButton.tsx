"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonUI from "./ui/Button";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <ButtonUI
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          LogOut
        </ButtonUI>
      </div>
    );
  }

  return (
    <ButtonUI
      onClick={() => router.push("/Login")}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      LogIn
    </ButtonUI>
  );
}
