import Dashboard from "@/components/dashboard/Dashboard";
import { cookies } from "next/headers";

export default async function WalletPage() {
  const token = (await cookies()).get('access_token')?.value;
  return <Dashboard token={token}/>
}
