interface AggregatorAPI {
  name: string;
  protocol: string;
  apiEndpoint: string;
  fallbackAPY: number;
}

interface APYResponse {
  protocol: string;
  apy: number;
  source: string;
  timestamp: string;
  error?: string;
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
  private readonly PROXY_BASE_URL = 'http://localhost:3001';
  
  private aggregatorAPIs: AggregatorAPI[] = [
    {
      name: "Tulip Garden",
      protocol: "tulip",
      apiEndpoint: `${this.PROXY_BASE_URL}/api/tulip`,
      fallbackAPY: 8.5
    },
    {
      name: "Francium",
      protocol: "francium", 
      apiEndpoint: `${this.PROXY_BASE_URL}/api/francium`,
      fallbackAPY: 5.0
    },
    {
      name: "Kamino Finance",
      protocol: "kamino",
      apiEndpoint: `${this.PROXY_BASE_URL}/api/kamino`,
      fallbackAPY: 10.1
    },
    {
      name: "Solend",
      protocol: "solend",
      apiEndpoint: `${this.PROXY_BASE_URL}/api/solend`,
      fallbackAPY: 7.8
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

    const apiConfig = this.aggregatorAPIs.find(api => api.protocol === protocol);
    if (!apiConfig) {
      console.warn(`No API configuration found for protocol: ${protocol}`);
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for proxy

      const response = await fetch(apiConfig.apiEndpoint, {
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

      const apyData: APYData = {
        name: apiConfig.name,
        protocol: proxyResponse.protocol,
        apy: proxyResponse.apy || apiConfig.fallbackAPY,
        lastUpdated: new Date(proxyResponse.timestamp),
        isLive: proxyResponse.source !== 'fallback' && !proxyResponse.error,
        source: proxyResponse.source
      };

      // Cache the result
      this.cache.set(cacheKey, { data: apyData, timestamp: Date.now() });

      return apyData;

    } catch (error) {
      console.error(`Failed to fetch APY for ${apiConfig.name} via proxy:`, error);
      
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
      // Try to fetch all APYs at once from the proxy
      const response = await fetch(`${this.PROXY_BASE_URL}/api/all-apys`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const allApyResponse = await response.json();
        
        return allApyResponse.data.map((apyResponse: APYResponse) => {
          const apiConfig = this.aggregatorAPIs.find(api => api.protocol === apyResponse.protocol);
          
          const apyData: APYData = {
            name: apiConfig?.name || apyResponse.protocol,
            protocol: apyResponse.protocol,
            apy: apyResponse.apy || apiConfig?.fallbackAPY || 0,
            lastUpdated: new Date(apyResponse.timestamp),
            isLive: apyResponse.source !== 'fallback' && !apyResponse.error,
            source: apyResponse.source
          };

          // Cache individual results
          this.cache.set(apyResponse.protocol, { data: apyData, timestamp: Date.now() });
          
          return apyData;
        });
      }
    } catch (error) {
      console.error('Failed to fetch all APYs at once, falling back to individual requests:', error);
    }

    // Fallback to individual requests
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