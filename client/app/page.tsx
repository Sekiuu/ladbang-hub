import { api } from "./api";
import HomePage from "./landing/home";
export default async function Home() {
  const data1 = await api("/test");
  const data2 = await api("/test2");
  const data3 = await api("/test3");
  return (
    <div className="grid grid-cols-4 justify-center items-center h-screen bg-white text-black">
      <HomePage testData={data1} test2Data={data2} test3Data={data3}/>
    </div>
  );
}
