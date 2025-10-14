"use client";

import React from "react";
import type { ResponseData } from "../api";
import ButtonUI from "../compoents/ui/Button";
import { useState } from "react";
import { api } from "../api";

export default function HomePage({
  testData,
  test2Data,
}: {
  testData: ResponseData | null;
  test2Data: ResponseData | null;
}) {
  const [response, setResponseData] = useState<ResponseData | null>(null);
  const [body, setBody] = useState<string>("");
  const [itemValue, setItemValue] = useState<string>("");

  const handleTestPostAPI = async () => {
    try {
      const res = await api.post("/item", { item: itemValue });
      setResponseData(res);
      setBody(JSON.stringify(res?.body));
    } catch (err) {
      setResponseData({ message: "Request failed", body: null } as any);
      setBody(String(err));
    }
  };

  const handleTestGetAPI = async () => {
    try {
      const res = await api.get("/item");
      setResponseData(res);
      setBody(JSON.stringify(res?.body));
    } catch (err) {
      setResponseData({ message: "Request failed", body: null } as any);
      setBody(String(err));
    }
  };

  const handleTestAPI = (num: number) => {
    if (num == 0) {
      setResponseData(testData);
      setBody(JSON.stringify(testData?.body));
    } else {
      setResponseData(test2Data);
      setBody(JSON.stringify(test2Data?.body));
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-900">
      <section className="max-w-6xl mx-auto px-6 py-14">
        {/* Header / Hero */}
        <header className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              LadBang Hub
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Modern demo page with a clean white & red theme. Use the buttons
              below to call example APIs and preview responses.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonUI
                onClick={() => handleTestAPI(0)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg shadow"
              >
                Use Test Data 1
              </ButtonUI>

              <ButtonUI
                onClick={() => handleTestAPI(1)}
                className="bg-white border border-red-600 text-red-600 px-5 py-3 rounded-lg hover:bg-red-50"
              >
                Use Test Data 2
              </ButtonUI>
            </div>
          </div>

          <div className="flex-1 bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-white p-4 shadow-inner">
                <p className="text-sm text-gray-500">Latest response</p>
                <p className="mt-2 font-medium text-gray-800">
                  {response ? response.message : "No response yet"}
                </p>
              </div>

              <pre className="bg-white rounded-lg p-3 text-xs text-gray-700 overflow-auto max-h-40">
                {body || "Response body will appear here..."}
              </pre>
            </div>
          </div>
        </header>

        {/* Action area */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-semibold text-gray-800">Interact</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add an item value and send it to the API, or fetch existing
              items.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <textarea
                className="w-full min-h-[90px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                value={itemValue}
                onChange={(e) => setItemValue(e.target.value)}
                placeholder="Enter item value"
                title="Item Value"
              />

              <div className="flex flex-wrap gap-3">
                <ButtonUI
                  onClick={() => {
                    handleTestPostAPI();
                    setItemValue("");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Send Item
                </ButtonUI>

                <ButtonUI
                  onClick={() => {
                    handleTestGetAPI();
                  }}
                  className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-lg"
                >
                  Fetch Items
                </ButtonUI>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-6 shadow">
            <h4 className="text-lg font-semibold text-gray-800">Quick Tips</h4>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>• Theme: clean white background with red accents.</li>
              <li>• Buttons use bold red fills for primary actions.</li>
              <li>• Responses are shown live in the panel above.</li>
            </ul>
          </aside>
        </section>
      </section>
    </main>
  );
}
