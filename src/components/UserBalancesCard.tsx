import type { UserBalances } from "../types/vault";

interface UserBalancesCardProps {
  userBalances: UserBalances;
}

export function UserBalancesCard({ userBalances }: UserBalancesCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Your Balances</h2>

      <div className="space-y-2 text-sm">
        <BalanceRow
          label="USDC"
          value={`${userBalances.usdcBalance.toFixed(6)} USDC`}
        />
        <BalanceRow
          label="yUSDC"
          value={`${userBalances.yusdcBalance.toFixed(6)} yUSDC`}
        />
      </div>
    </div>
  );
}

/* 🔹 Reusable row component */
function BalanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-gray-300">
      <span>{label}:</span>
      <span className="font-mono text-gray-100">{value}</span>
    </div>
  );
}
