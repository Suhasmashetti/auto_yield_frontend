interface AggregatorAPI {
  name: string;
  protocol: string;
  apiEndpoint: string;
  fallbackAPY: number;
}

interface APYResponse {
  usdcPools: Array<{
    symbol: string;
    project: string;
    apy: number;
    pool: string;
    chain: string;
    tvlUsd: number;
  }>;
  bestPool: {
    symbol: string;
    project: string;
    apy: number;
    pool: string;
    chain: string;
    tvlUsd: number;
  } | null;
  source: string;
  timestamp: string;
}

interface APYData {
  name: string;
  protocol: string;
  apy: number;
  lastUpdated: Date;
  isLive: boolean;
  source?: string;
}

/**
 * Service to fetch real-time APY data from Solana DeFi protocols via proxy server
 */
export class APYFetchService {
  private readonly PROXY_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://apy-proxy-server.onrender.com'
    : 'http://localhost:5000';
  
  private aggregatorAPIs: AggregatorAPI[] = [
    {
      name: "Francium",
      protocol: "francium", 
      apiEndpoint: `${this.PROXY_BASE_URL}/api/usdc-apy`,
      fallbackAPY: 13.15
    },
    {
      name: "Pluto",
      protocol: "pluto",
      apiEndpoint: `${this.PROXY_BASE_URL}/api/usdc-apy`,
      fallbackAPY: 3.07
    },
  ];

  private cache = new Map<string, { data: APYData; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch APY for a specific protocol via proxy server
   */
  async fetchAPY(protocol: string): Promise<APYData | null> {
    const cacheKey = protocol;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for proxy

      const response = await fetch(`${this.PROXY_BASE_URL}/api/usdc-apy`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const proxyResponse: APYResponse = await response.json();

      // Find the specific protocol in the pools
      const pool = proxyResponse.usdcPools.find(p => p.project.toLowerCase() === protocol.toLowerCase());
      const apiConfig = this.aggregatorAPIs.find(api => api.protocol === protocol);
      
      if (!pool && !apiConfig) {
        console.warn(`No pool found for protocol: ${protocol}`);
        return null;
      }

      const apyData: APYData = {
        name: apiConfig?.name || (pool?.project) || protocol,
        protocol: protocol,
        apy: pool?.apy || apiConfig?.fallbackAPY || 0,
        lastUpdated: new Date(proxyResponse.timestamp),
        isLive: !!pool && proxyResponse.source !== 'fallback',
        source: proxyResponse.source
      };

      // Cache the result
      this.cache.set(cacheKey, { data: apyData, timestamp: Date.now() });

      return apyData;

    } catch (error) {
      console.error(`Failed to fetch APY for ${protocol}:`, error);
      
      const apiConfig = this.aggregatorAPIs.find(api => api.protocol === protocol);
      if (!apiConfig) return null;
      
      // Return fallback data
      const fallbackData: APYData = {
        name: apiConfig.name,
        protocol: apiConfig.protocol,
        apy: apiConfig.fallbackAPY,
        lastUpdated: new Date(),
        isLive: false,
        source: 'fallback'
      };

      return fallbackData;
    }
  }

  /**
   * Fetch APY data for all supported protocols at once
   */
  async fetchAllAPYs(): Promise<APYData[]> {
    try {
      // Fetch APY data from the unified endpoint
      const response = await fetch(`${this.PROXY_BASE_URL}/api/usdc-apy`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const apyResponse: APYResponse = await response.json();
        
        return apyResponse.usdcPools.map((pool) => {
          const apyData: APYData = {
            name: pool.project.charAt(0).toUpperCase() + pool.project.slice(1),
            protocol: pool.project.toLowerCase(),
            apy: pool.apy,
            lastUpdated: new Date(apyResponse.timestamp),
            isLive: apyResponse.source !== 'fallback',
            source: apyResponse.source
          };

          // Cache individual results
          this.cache.set(pool.project.toLowerCase(), { data: apyData, timestamp: Date.now() });
          
          return apyData;
        });
      }
    } catch (error) {
      console.error('Failed to fetch APY data:', error);
    }

    // Fallback to individual requests if needed
    const promises = this.aggregatorAPIs.map(api => this.fetchAPY(api.protocol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<APYData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  /**
   * Get cached APY data without making new requests
   */
  getCachedAPYs(): APYData[] {
    const now = Date.now();
    return Array.from(this.cache.values())
      .filter(cached => now - cached.timestamp < this.CACHE_DURATION)
      .map(cached => cached.data);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get the best APY from cached or fresh data
   */
  async getBestAPY(): Promise<APYData | null> {
    const apys = await this.fetchAllAPYs();
    if (apys.length === 0) return null;

    return apys.reduce((best, current) => 
      current.apy > best.apy ? current : best
    );
  }

  /**
   * Subscribe to APY updates (polling-based)
   */
  subscribeToUpdates(
    callback: (apys: APYData[]) => void,
    intervalMs: number = 60000 // 1 minute default
  ): () => void {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;
      
      try {
        const apys = await this.fetchAllAPYs();
        callback(apys);
      } catch (error) {
        console.error('Error in APY polling:', error);
      }

      if (isActive) {
        setTimeout(poll, intervalMs);
      }
    };

    // Start immediately
    poll();

    // Return cleanup function
    return () => {
      isActive = false;
    };
  }
}

// Singleton instance
export const apyService = new APYFetchService();

// Helper hook for React components
export interface UseAPYReturn {
  apys: APYData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

/**
 * React hook to fetch and manage APY data
 */
export function useAPYData(autoRefresh: boolean = true): UseAPYReturn {
  const [apys, setAPYs] = React.useState<APYData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const freshAPYs = await apyService.fetchAllAPYs();
      setAPYs(freshAPYs);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch APY data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();

    if (autoRefresh) {
      const cleanup = apyService.subscribeToUpdates((freshAPYs) => {
        setAPYs(freshAPYs);
        setLastUpdated(new Date());
      }, 60000); // Update every minute

      return cleanup;
    }
  }, [refresh, autoRefresh]);

  return { apys, loading, error, lastUpdated, refresh };
}

// Import React for the hook
import * as React from 'react';