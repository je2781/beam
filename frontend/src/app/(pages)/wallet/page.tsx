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

  const [transRes, balanceRes, bankRes] = await Promise.all([
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
    fetch(`${process.env.SERVER_DOMAIN}/bank`, {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    }),
  ]);

  const [transData, balanceData, bankData] = await Promise.all([
    transRes.json(),
    balanceRes.json(),
    bankRes.json()
  ]);

  return [transData, balanceData.wallet_balance, bankData];
}

export default async function WalletPage() {
  const [transData, balance, bank] = await getContentData();

  const dashboardProps: {
    transData: any,
    balance: number,
    bank: any
  } = {
    transData,
    balance,
    bank
  };

  return <DashboardComponent {...dashboardProps} />;
}
