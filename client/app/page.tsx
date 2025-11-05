import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import LandingPage from "./landing/page";
import FinanceDashboard from "./dashboard/page";
export default async function Home() {
  return <FinanceDashboard />;
}
