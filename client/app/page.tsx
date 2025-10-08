import { api } from "./api";
import HomePage from "./landing/home";
export default async function Home() {
  const data1 = await api.get("/test");
  const data2 = await api.get("/test2");
  return (
    <div className="grid grid-cols-4 justify-center items-center h-screen bg-white text-black">
      <HomePage testData={data1} test2Data={data2} />
    </div>
  );
}
