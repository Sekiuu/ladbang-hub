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
    const res = await api.post("/item", { item: itemValue });
    setResponseData(res);
    console.log(res);
    setBody(JSON.stringify(res?.body));
  };

  const handleTestGetAPI = async () => {
    const res = await api.get("/item");
    setResponseData(res);
    console.log(res);
    setBody(JSON.stringify(res?.body));
  };

  const handleTestAPI = (num: number) => {
    if (num == 0) {
      setResponseData(testData);
      console.log(testData);
      setBody(JSON.stringify(testData?.body));
    } else {
      setResponseData(test2Data);
      console.log(test2Data);
      setBody(JSON.stringify(test2Data?.body));
    }
  };

  return (
    <div className="col-span-4 bg-red-500 w-full gap-5 h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Test</h1>
      <div className="bg-white rounded-xl p-5 min-w-md min-h-20">
        <p className="text-lg">{response ? response.message : ""}</p>
        <p className="text-lg">{body}</p>
      </div>
      <ButtonUI
        onClick={() => {
          handleTestAPI(0);
        }}
        className="min-w-lg"
      >
        Test API
      </ButtonUI>
      <ButtonUI
        onClick={() => {
          handleTestAPI(1);
        }}
        className="min-w-lg"
      >
        Test API 2
      </ButtonUI>
      <textarea
        className="bg-white rounded-xl p-5 min-w-md min-h-20"
        value={itemValue}
        onChange={(e) => setItemValue(e.target.value)}
        placeholder="Enter item value"
        title="Item Value"
      />
      <ButtonUI
        onClick={() => {
          handleTestPostAPI();
          setItemValue(""); //set empty field
        }}
        className="min-w-lg"
      >
        Test Post Add Item
      </ButtonUI>
      <ButtonUI
        onClick={() => {
          handleTestGetAPI();
        }}
        className="min-w-lg"
      >
        Test Get Item
      </ButtonUI>
    </div>
  );
}
