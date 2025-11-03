import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
// import LandingPage from "./landing/page";
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/landing");
  }

  return (
    <div className="grid justify-center items-center h-screen bg-white text-black">
      {session ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-gray-600 mb-4">You are successfully logged in.</p>
          <Link href="/profile" className="text-blue-500 hover:underline">
            View Profile
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Ladbang Hub</h1>
          <p className="text-gray-600 mb-4">
            Please log in to access your account.
          </p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      )}
      {/* <LandingPage /> */}
    </div>
  );
}
