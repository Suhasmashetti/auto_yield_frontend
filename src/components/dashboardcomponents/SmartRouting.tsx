import { useState, useEffect } from "react";

interface ProtocolData {
  protocol: string;
  apy: number;
  source: string;
  error?: string;
  timestamp: string;
}

interface APIResponse {
  data: ProtocolData[];
  timestamp: string;
}

export function SmartRouting() {
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchAPYData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3001/api/all-apys");
      const data: APIResponse = await response.json();

      setProtocols(data.data);
      setLastUpdated(data.timestamp);
    } catch (err) {
      setError("Failed to fetch APY data");
      console.error("APY fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPYData();
    const interval = setInterval(fetchAPYData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getProtocolName = (protocol: string) => {
    const names: { [key: string]: string } = {
      tulip: "Tulip Garden",
      francium: "Francium",
      kamino: "Kamino Finance",
      solend: "Solend",
    };
    return names[protocol] || protocol;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
        second: "2-digit",
    });
  };

  const highestAPY =
    protocols.length > 0 ? Math.max(...protocols.map((p) => p.apy)) : 0;
  const liveProtocols = protocols.filter((p) => !p.error);

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 p-6">
        <div className="flex items-center justify-center py-8">
          <span className="text-gray-400">Loading yield data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <h3 className="text-xl font-semibold text-white uppercase tracking-wider">
          Smart Yield Aggregator
        </h3>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-xs text-gray-400">Last Updated</div>
            <div className="text-sm text-white">
              {lastUpdated ? formatTime(lastUpdated) : "Never"}
            </div>
          </div>
          <button
            onClick={fetchAPYData}
            disabled={loading}
            className="px-3 py-2 bg-gray-900 border border-gray-700 text-white text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-gray-900 border border-red-700 rounded">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Highest APY Highlight */}
      {protocols.length > 0 && (
        <div className="bg-black border border-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                Best Available Yield
              </h4>
              <p className="text-gray-400 text-sm">
                {getProtocolName(
                  protocols.find((p) => p.apy === highestAPY)?.protocol || ""
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {highestAPY.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">Annual APY</div>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Grid */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-white uppercase tracking-wider">
          Available Protocols
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((protocol) => (
            <div
              key={protocol.protocol}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                protocol.apy === highestAPY
                  ? "border-white"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-semibold">
                  {getProtocolName(protocol.protocol)}
                </h5>
                <div
                  className={`text-2xl font-bold ${
                    protocol.apy === highestAPY
                      ? "text-white"
                      : "text-gray-300"
                  }`}
                >
                  {protocol.apy.toFixed(2)}%
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div
                  className={`px-2 py-1 rounded border ${
                    protocol.error
                      ? "text-red-400 border-red-700"
                      : protocol.source === "fallback"
                      ? "text-gray-400 border-gray-600"
                      : "text-white border-gray-600"
                  }`}
                >
                  {protocol.error ? "Offline" : `Source: ${protocol.source}`}
                </div>
                <span className="text-gray-400">
                  {formatTime(protocol.timestamp)}
                </span>
              </div>

              {protocol.error && (
                <div className="mt-2 p-2 bg-gray-900 border border-red-800 rounded">
                  <p className="text-red-400 text-xs">Using fallback rate</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {protocols.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-black border border-gray-700 rounded">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {highestAPY.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400">Best APY</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {(
                protocols.reduce((sum, p) => sum + p.apy, 0) / protocols.length
              ).toFixed(2)}
              %
            </div>
            <div className="text-xs text-gray-400">Average APY</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {liveProtocols.length}/{protocols.length}
            </div>
            <div className="text-xs text-gray-400">Live Sources</div>
          </div>
        </div>
      )}
    </div>
  );
}
