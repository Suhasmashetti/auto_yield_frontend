import { useState, useEffect } from "react";

interface ProtocolData {
  protocol: string;
  apy: number;
  source: string;
  error?: string;
  timestamp: string;
  thirtyDayApy?: number;
}

interface APIResponse {
  data: ProtocolData[];
  timestamp: string;
}

// Protocol icons and colors
const protocolConfig = {
  tulip: {
    name: "Tulip Garden",
    icon: "🌷",
    color: "from-pink-500 to-rose-600"
  },
  francium: {
    name: "Francium",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600"
  },
  kamino: {
    name: "Kamino Finance",
    icon: "🌊",
    color: "from-blue-500 to-cyan-600"
  },
  solend: {
    name: "Solend",
    icon: "💎",
    color: "from-purple-500 to-indigo-600"
  },
  marginfi: {
    name: "MarginFi",
    icon: "📊",
    color: "from-green-500 to-emerald-600"
  }
};

export function LiveRatesDisplay() {
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState("USDC");

  const currencies = ["USDC"];

  // Cache key and expiration time (15 minutes)
  const CACHE_KEY = 'apy_data_cache';
  const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  const getCachedData = (): { data: ProtocolData[]; timestamp: string } | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp, expiry } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() < expiry) {
        return { data, timestamp };
      }
      
      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (err) {
      console.error('Error reading cache:', err);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedData = (data: ProtocolData[], timestamp: string) => {
    try {
      const cacheData = {
        data,
        timestamp,
        expiry: Date.now() + CACHE_EXPIRATION
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Error setting cache:', err);
    }
  };

  const fetchAPYData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get data from cache first
      if (useCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setProtocols(cachedData.data);
          setLastUpdated(cachedData.timestamp);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data from API
      const response = await fetch("http://localhost:3001/api/all-apys");
      const data: APIResponse = await response.json();

      setProtocols(data.data);
      setLastUpdated(data.timestamp);
      
      // Cache the new data
      setCachedData(data.data, data.timestamp);
    } catch (err) {
      setError("Failed to fetch APY data");
      console.error("APY fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPYData(true); // Use cache on initial load
    const interval = setInterval(() => fetchAPYData(false), 3600000); // Force fresh data hourly
    return () => clearInterval(interval);
  }, []);

  const getProtocolConfig = (protocol: string) => {
    return protocolConfig[protocol as keyof typeof protocolConfig] || {
      name: protocol,
      icon: "🔷",
      color: "from-gray-500 to-gray-600"
    };
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const sortedProtocols = protocols.sort((a, b) => b.apy - a.apy);
  const highestAPY = protocols.length > 0 ? Math.max(...protocols.map((p) => p.apy)) : 0;
  const liveProtocols = protocols.filter((p) => !p.error);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-400">Loading live rates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header with currency selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Live rates</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time APY data</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchAPYData(false)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
          
          <div className="flex bg-gray-800 rounded-lg p-1">
            {currencies.map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedCurrency === currency
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
          
          {lastUpdated && (
            <div className="text-right text-xs text-gray-400">
              <div>Last updated</div>
              <div className="text-white">{formatTime(lastUpdated)}</div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Protocol cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {sortedProtocols.map((protocol) => {
          const config = getProtocolConfig(protocol.protocol);
          const isHighest = protocol.apy === highestAPY;
          
          return (
            <div
              key={protocol.protocol}
              className={`bg-gray-900 rounded-lg p-4 border transition-all duration-200 hover:bg-gray-800 ${
                isHighest 
                  ? "border-green-500 ring-1 ring-green-500/20" 
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center text-lg`}>
                  {config.icon}
                </div>
                {isHighest && (
                  <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Best
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-medium text-sm">
                  {config.name}
                </h3>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {protocol.apy.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {protocol.thirtyDayApy ? 
                      `${protocol.thirtyDayApy.toFixed(2)}% (30d)` : 
                      "Current APY"
                    }
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className={`px-2 py-1 rounded border ${
                    protocol.error
                      ? "text-red-400 border-red-700/50 bg-red-900/20"
                      : protocol.source === "fallback"
                      ? "text-yellow-400 border-yellow-700/50 bg-yellow-900/20"
                      : "text-green-400 border-green-700/50 bg-green-900/20"
                  }`}>
                    {protocol.error ? "Offline" : 
                     protocol.source === "fallback" ? "Fallback" : "Live"
                    }
                  </div>
                </div>

                {protocol.error && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-800 rounded text-xs">
                    <p className="text-red-400">Using estimated rate</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats summary */}
      {protocols.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {highestAPY.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">Best Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {getProtocolConfig(
                  protocols.find((p) => p.apy === highestAPY)?.protocol || ""
                ).name}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(protocols.reduce((sum, p) => sum + p.apy, 0) / protocols.length).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">Average Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Across all protocols
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {liveProtocols.length}/{protocols.length}
              </div>
              <div className="text-sm text-gray-400">Live Sources</div>
              <div className="text-xs text-gray-500 mt-1">
                Active data feeds
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}