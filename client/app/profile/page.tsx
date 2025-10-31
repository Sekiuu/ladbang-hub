"use client";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
