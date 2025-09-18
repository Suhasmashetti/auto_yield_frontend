
import usdcLogo from "../../assets/icons/usd-coin-usdc-logo.png";
import blueberry from "../../assets/icons/blueberry.png";

interface AssetData {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  apy: number;
  protocol?: string;
}

interface AllocationData {
  protocol: string;
  amount: number;
  percentage: number;
  apy: number;
}

interface AssetsDisplayProps {
  assets: AssetData[];
  allocations: AllocationData[];
  loading?: boolean;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const timeframes = [
  { id: "7D", label: "7D" },
  { id: "30D", label: "30D" },
  { id: "1Y", label: "1Y" },
  { id: "ALL", label: "ALL" },
];

export function AssetsDisplay({
  assets,
  allocations,
  loading = false,
  selectedTimeframe = "7D",
  onTimeframeChange,
}: AssetsDisplayProps) {


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  };

  const formatAmount = (amount: number, decimals = 6) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Timeframe selector */}
      {onTimeframeChange && (
        <div className="flex justify-center">
          <div className="flex bg-gray-900 rounded-lg p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => onTimeframeChange(timeframe.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  selectedTimeframe === timeframe.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Your Assets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Your Assets</h2>
        <div className="bg-black rounded-lg overflow-hidden">
          {assets.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">No deposited assets</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {assets.map((asset, index) => (
                <div key={index} className="p-4 hover:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* USDC logo */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
                        <img 
                          src={blueberry}
                          alt="USDC"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{asset.symbol}</div>
                        <div className="text-gray-400 text-sm">{asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ${formatCurrency(asset.value)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatAmount(asset.amount)} {asset.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-medium">
                        {asset.apy.toFixed(2)}% APY
                      </div>
                      {asset.protocol && (
                        <div className="text-gray-400 text-sm">{asset.protocol}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Your Allocations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Your Allocations</h2>
        <div className="bg-black rounded-lg overflow-hidden">
          {allocations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">No deposited assets</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {allocations.map((allocation, index) => (
                <div key={index} className="p-4 hover:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* USDC logo */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
                        <img 
                          src={usdcLogo}
                          alt="USDC"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{allocation.protocol}</div>
                        <div className="text-gray-400 text-sm">
                          {allocation.percentage.toFixed(1)}% of portfolio
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ${formatCurrency(allocation.amount)}
                      </div>
                      <div className="text-green-300 text-sm">
                        {allocation.apy.toFixed(2)}% APY
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  {/* <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${allocation.percentage}%` }}
                      ></div>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}