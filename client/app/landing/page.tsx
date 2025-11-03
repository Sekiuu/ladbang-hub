"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../api";

export default function LandingPage() {
  const { data: session, status } = useSession();

  const testApi = async () => {
    const res = await api.get("/users");
    if (res?.body) {
      console.log(JSON.stringify(res.body, null, 2));
    } else {
      console.log(res);
    }
  };
  testApi();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ladbang Hub
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for productivity, collaboration, and
            growth. Join thousands of users who are already transforming their
            workflow.
          </p>

          {session ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-green-800 mb-2">
                  Welcome back, {session.user?.name}!
                </h2>
                <p className="text-green-600 mb-4">
                  You're successfully logged in and ready to go.
                </p>
                <div className="space-x-4">
                  <Link
                    href="/profile"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/home"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
                
              </div>
              <p className="text-sm text-gray-500">
                Demo credentials: admin@example.com / password
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Ladbang Hub?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for teams
            and individuals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Built with modern technology for optimal performance and speed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Reliable
            </h3>
            <p className="text-gray-600">
              Enterprise-grade security with 99.9% uptime guarantee.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-600">
              Work together seamlessly with real-time collaboration tools.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already transforming their
              workflow with Ladbang Hub.
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
