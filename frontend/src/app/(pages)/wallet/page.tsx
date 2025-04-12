import Spinner from "@/components/layout/Spinner";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const DashboardComponent = dynamic(
  () => import("../../../components/dashboard/Dashboard"),
  {
    loading: () => <Spinner />,
    ssr: true,
  }
);

export async function getContentData() {
  const token = (await cookies()).get('access_token')?.value;

  const [transRes, balanceRes] = await Promise.all([
    fetch(`${process.env.SERVER_DOMAIN}/transactions`, {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    }),
    fetch(`${process.env.SERVER_DOMAIN}/wallet/balance`, {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    }),
  ]);

  const [transData, balanceData] = await Promise.all([
    transRes.json(),
    balanceRes.json(),
  ]);

  return [transData.transactions, balanceData.wallet_balance];
}

export default async function WalletPage() {
  const [transactions, balance] = await getContentData();

  const dashboardProps: {
    transactions: any[],
    balance: number
  } = {
    transactions,
    balance,
  };

  console.log(dashboardProps);
  return <DashboardComponent {...dashboardProps} />;
}
