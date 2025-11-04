import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
// import LandingPage from "./landing/page";
export default async function Home() {
  const session = await getServerSession(authOptions);
  

  return (
    <div className="w-full grid justify-center items-center h-screen bg-white text-gray-800">
      Dashboard
    </div>
  );
}
