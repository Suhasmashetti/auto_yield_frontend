import { useState, useEffect, useMemo, useCallback } from "react";
import franciumPng from "../../assets/icons/francium.png";
import plutoPng from "../../assets/icons/pluto.png";


interface PoolData {
  symbol: string;
  project: string;
  apy: number;
  pool: string;
  chain: string;
  tvlUsd: number;
}

interface APIResponse {
  usdcPools: PoolData[];
  bestPool: PoolData;
  source: string;
  timestamp: string;
}

// Protocol icons and colors (only francium and pluto)
const protocolConfig = {
  francium: {
    name: "Francium",
    icon: franciumPng,
    color: "from-yellow-500 to-orange-600"
  },
  pluto: {
    name: "Pluto",
    icon: plutoPng,
    color: "from-blue-500 to-indigo-600"
  }
};

export function LiveRatesDisplay() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [bestPool, setBestPool] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Cache key and expiration time (15 minutes)
  const CACHE_KEY = 'apy_data_cache';
  const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const { pools, bestPool, timestamp, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        return { pools, bestPool, timestamp };
      }
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (err) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedData = useCallback((pools: PoolData[], bestPool: PoolData | null, timestamp: string) => {
    try {
      const cacheData = {
        pools,
        bestPool,
        timestamp,
        expiry: Date.now() + CACHE_EXPIRATION
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {}
  }, []);

  const fetchAPYData = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);
      if (useCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setPools(cachedData.pools);
          setBestPool(cachedData.bestPool);
          setLastUpdated(cachedData.timestamp);
          setLoading(false);
          return;
        }
      }
      const response = await fetch("http://localhost:5000/api/usdc-apy");
      const data: APIResponse = await response.json();
      setPools(data.usdcPools);
      setBestPool(data.bestPool);
      setLastUpdated(data.timestamp);
      setCachedData(data.usdcPools, data.bestPool, data.timestamp);
    } catch (err) {
      setError("Failed to fetch APY data");
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  useEffect(() => {
    fetchAPYData(true); // Use cache on initial load
    const interval = setInterval(() => fetchAPYData(false), 3600000); // Force fresh data hourly
    return () => clearInterval(interval);
  }, [fetchAPYData]);

  const getProtocolConfig = useCallback((protocol: string) => {
    return protocolConfig[protocol as keyof typeof protocolConfig] || {
      name: protocol,
      icon: "🔷",
      color: "from-gray-500 to-gray-600"
    };
  }, []);

  const formatTime = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const sortedPools = useMemo(() => [...pools].sort((a, b) => b.apy - a.apy), [pools]);
  const highestAPY = useMemo(() => pools.length > 0 ? Math.max(...pools.map((p) => p.apy)) : 0, [pools]);

if (loading) {
  return (
    <div className="px-4 py-6">
      <div className="bg-black rounded-xl p-6 border border-green-300">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-green-300">Loading live rates...</span>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="px-4 py-6 space-y-5">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Live Rates</h2>
        <div className="flex items-center space-x-2 text-sm text-green-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time APY data</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => fetchAPYData(false)}
          disabled={loading}
          className="p-2 text-green-300 hover:text-white transition disabled:opacity-50"
          title="Refresh data"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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

        {lastUpdated && (
          <div className="text-right text-xs text-green-300">
            <div>Last updated</div>
            <div className="text-white">{formatTime(lastUpdated)}</div>
          </div>
        )}
      </div>
    </div>

    {/* Error */}
    {error && (
      <div className="bg-black border border-red-500 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}

    {/* Pools */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {sortedPools.map((pool) => {
        const config = getProtocolConfig(pool.project);
        const isHighest = pool.apy === highestAPY;

        return (
          <div
            key={pool.pool}
            className={`bg-black rounded-xl p-4 border transition hover:bg-green-950/10 ${
              isHighest
                ? "border-green-300 ring-1 ring-green-500/30"
                : "border-white/10 hover:border-green-600/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <img
                src={config.icon}
                alt={config.name}
                className="w-8 h-8 object-contain"
              />
              {isHighest && (
                <div className="text-xs bg-green-600/20 text-green-300 px-2 py-1 rounded-full">
                  Best
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-medium text-sm">{config.name}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-300">
                  {pool.apy.toFixed(2)}%
                </div>
                <div className="text-xs text-white/60">
                  TVL: ${pool.tvlUsd.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="px-2 py-1 rounded border text-green-300 border-green-600/50 bg-green-900/20">
                  Live
                </div>
                <span className="text-white/60">{pool.chain}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Quick stats */}
    {pools.length > 0 && bestPool && (
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">
              {bestPool.apy.toFixed(2)}%
            </div>
            <div className="text-sm text-white/70">Best Rate</div>
            <div className="text-xs text-white/50 mt-1">
              {getProtocolConfig(bestPool.project).name}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">
              {(
                pools.reduce((sum, p) => sum + p.apy, 0) / pools.length
              ).toFixed(2)}
              %
            </div>
            <div className="text-sm text-white/70">Average Rate</div>
            <div className="text-xs text-white/50 mt-1">Across protocols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">
              {pools.length}
            </div>
            <div className="text-sm text-white/70">Live Sources</div>
            <div className="text-xs text-white/50 mt-1">Active feeds</div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}