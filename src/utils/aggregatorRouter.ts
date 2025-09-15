interface Aggregator {
  name: string;
  description: string;
  apy: string;
  icon: string;
  protocol: string;
  address?: string;
  minDeposit?: number;
  fees?: number;
  isLive?: boolean;
}

/**
 * Smart routing logic to find the best aggregator based on APY and other factors
 */
export class AggregatorRouter {
  private aggregators: Aggregator[];

  constructor(aggregators: Aggregator[]) {
    this.aggregators = aggregators;
  }

  /**
   * Find the best aggregator based on highest APY, prioritizing live data
   */
  getBestByAPY(): Aggregator | null {
    if (this.aggregators.length === 0) return null;

    // Filter out aggregators with 0 APY (failed fetches)
    const validAggregators = this.aggregators.filter(agg => parseFloat(agg.apy) > 0);
    
    if (validAggregators.length === 0) return null;

    // First try to find the best among live data sources
    const liveAggregators = validAggregators.filter(agg => agg.isLive);
    
    if (liveAggregators.length > 0) {
      return liveAggregators.reduce((best, current) => {
        const bestAPY = parseFloat(best.apy);
        const currentAPY = parseFloat(current.apy);
        return currentAPY > bestAPY ? current : best;
      });
    }

    // Fallback to all valid aggregators if no live data
    return validAggregators.reduce((best, current) => {
      const bestAPY = parseFloat(best.apy);
      const currentAPY = parseFloat(current.apy);
      return currentAPY > bestAPY ? current : best;
    });
  }

  /**
   * Find the best aggregator for a specific deposit amount
   * Considers APY, fees, and minimum deposits
   */
  getBestForAmount(depositAmount: number): {
    aggregator: Aggregator;
    netAPY: number;
    reasoning: string;
  } | null {
    if (this.aggregators.length === 0) return null;

    const validAggregators = this.aggregators.filter(agg => 
      !agg.minDeposit || depositAmount >= agg.minDeposit
    );

    if (validAggregators.length === 0) return null;

    let bestChoice = validAggregators[0];
    let bestNetAPY = this.calculateNetAPY(bestChoice, depositAmount);
    let reasoning = "Default choice";

    for (const aggregator of validAggregators) {
      const netAPY = this.calculateNetAPY(aggregator, depositAmount);
      
      if (netAPY > bestNetAPY) {
        bestChoice = aggregator;
        bestNetAPY = netAPY;
        reasoning = `Highest net APY after fees: ${netAPY.toFixed(2)}%`;
      }
    }

    return {
      aggregator: bestChoice,
      netAPY: bestNetAPY,
      reasoning
    };
  }

  /**
   * Calculate net APY after deducting fees
   */
  private calculateNetAPY(aggregator: Aggregator, _depositAmount: number): number {
    const grossAPY = parseFloat(aggregator.apy);
    const feePercentage = aggregator.fees || 0;
    
    // Simple fee calculation - in reality this would be more complex
    // depositAmount could be used for tiered fee structures
    const netAPY = grossAPY * (1 - feePercentage / 100);
    
    return netAPY;
  }

  /**
   * Get routing instructions for the best aggregator
   */
  getRoutingInstructions(depositAmount: number): {
    selectedAggregator: string;
    expectedAPY: string;
    route: string[];
    gasEstimate?: string;
    reasoning: string;
  } | null {
    const bestChoice = this.getBestForAmount(depositAmount);
    
    if (!bestChoice) {
      return null;
    }

    const { aggregator, netAPY, reasoning } = bestChoice;

    // Generate routing steps based on the selected aggregator
    const route = this.generateRoute(aggregator, depositAmount);

    return {
      selectedAggregator: aggregator.name,
      expectedAPY: `${netAPY.toFixed(2)}%`,
      route,
      gasEstimate: this.estimateGas(route),
      reasoning
    };
  }

  /**
   * Generate step-by-step routing instructions
   */
  private generateRoute(aggregator: Aggregator, amount: number): string[] {
    const steps: string[] = [];

    steps.push(`1. Approve ${amount} USDC for AutoYield contract`);
    steps.push(`2. AutoYield contract deposits USDC to ${aggregator.name}`);
    
    switch (aggregator.protocol) {
      case 'tulip':
        steps.push(`3. ${aggregator.name} deploys USDC to yield vaults`);
        steps.push(`4. Earn rewards from automated strategies`);
        steps.push(`5. Receive yUSDC tokens representing your share`);
        break;
      case 'francium':
        steps.push(`3. ${aggregator.name} provides USDC to LP farming`);
        steps.push(`4. Earn fees and rewards from liquidity provision`);
        steps.push(`5. Auto-compound returns back to USDC`);
        break;
      case 'kamino':
        steps.push(`3. ${aggregator.name} creates concentrated liquidity positions`);
        steps.push(`4. Automatically manages and rebalances positions`);
        steps.push(`5. Maximize fee collection from active trading`);
        break;
      case 'solend':
        steps.push(`3. ${aggregator.name} lends USDC to borrowers`);
        steps.push(`4. Earn interest from lending activities`);
        steps.push(`5. Receive cUSDC tokens with accumulated interest`);
        break;
      case 'marinade':
        steps.push(`3. Convert USDC to SOL via Jupiter`);
        steps.push(`4. ${aggregator.name} stakes SOL for mSOL`);
        steps.push(`5. Earn staking rewards from Solana network`);
        steps.push(`6. Auto-compound via liquid staking`);
        break;
      default:
        steps.push(`3. ${aggregator.name} deploys capital to yield strategies`);
        steps.push(`4. Receive yUSDC tokens with yield exposure`);
    }

    steps.push(`${steps.length + 1}. Monitor performance and withdraw anytime`);

    return steps;
  }

  /**
   * Estimate gas costs for the routing
   */
  private estimateGas(route: string[]): string {
    // Simple estimation based on route complexity
    const baseGas = 0.001; // SOL
    const perStepGas = 0.0005;
    
    const totalGas = baseGas + (route.length * perStepGas);
    return `~${totalGas.toFixed(4)} SOL`;
  }

  /**
   * Get all aggregators sorted by APY (highest first)
   */
  getAllSortedByAPY(): Aggregator[] {
    return [...this.aggregators].sort((a, b) => 
      parseFloat(b.apy) - parseFloat(a.apy)
    );
  }

  /**
   * Get aggregator recommendations based on deposit size
   */
  getRecommendations(depositAmount: number): {
    best: Aggregator;
    alternatives: Aggregator[];
    warnings: string[];
  } | null {
    const bestChoice = this.getBestForAmount(depositAmount);
    if (!bestChoice) return null;

    const sorted = this.getAllSortedByAPY();
    const alternatives = sorted.filter(agg => 
      agg.name !== bestChoice.aggregator.name
    ).slice(0, 2);

    const warnings: string[] = [];

    // Add warnings based on deposit amount
    if (depositAmount < 100) {
      warnings.push("Small deposits may have proportionally higher gas costs");
    }
    if (depositAmount > 10000) {
      warnings.push("Large deposits should consider risk diversification");
    }

    // Add protocol-specific warnings
    if (bestChoice.aggregator.protocol === 'experimental') {
      warnings.push("This aggregator uses experimental strategies - higher risk");
    }

    return {
      best: bestChoice.aggregator,
      alternatives,
      warnings
    };
  }
}

/**
 * Create router instance with current aggregator data
 */
export function createAggregatorRouter(): AggregatorRouter {
  const aggregators: Aggregator[] = [
    {
      name: "Tulip Garden",
      description: "USDC yield vaults",
      apy: "8.5",
      icon: "T",
      protocol: "tulip",
      minDeposit: 1,
      fees: 0.4,
      address: "TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs"
    },
    {
      name: "Francium",
      description: "USDC LP farming",
      apy: "9.2",
      icon: "F",
      protocol: "francium",
      minDeposit: 5,
      fees: 0.6,
      address: "FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj"
    },
    {
      name: "Kamino Finance",
      description: "Concentrated liquidity",
      apy: "10.1",
      icon: "K", 
      protocol: "kamino",
      minDeposit: 10,
      fees: 0.8,
      address: "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
    },
    {
      name: "Solend",
      description: "USDC lending",
      apy: "7.8",
      icon: "S",
      protocol: "solend",
      minDeposit: 1,
      fees: 0.3,
      address: "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"
    },
    {
      name: "Marinade (mSOL)",
      description: "Liquid staking via USDC→SOL→mSOL",
      apy: "8.9",
      icon: "M",
      protocol: "marinade",
      minDeposit: 1,
      fees: 0.5,
      address: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD"
    }
  ];

  return new AggregatorRouter(aggregators);
}