"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import ButtonUI from "../components/ui/Button";
import Balance from "../components/ui/Balance";
import { signOut } from "next-auth/react";
export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (

      <div className="h-screen w-screen bg-[linear-gradient(to_bottom_right,_#f472b6_-15%,_#ffffff_50%,_#c084fc_110%)] py-8">
        <div className="flex items-center justify-center gap-6 mb-1">
          <div className="w-30 h-30 rounded-full overflow-hidden ring-2 ring-gray-200">
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center mt-8">
            <Balance />
          </div>
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {session?.user?.name || "Not provided"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {session?.user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {(session?.user as any)?.id || "Not available"}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-start mt-6">
            <ButtonUI
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            LogOut
          </ButtonUI>
          </div>
        </div>
        
      </div>
      
  );
}
