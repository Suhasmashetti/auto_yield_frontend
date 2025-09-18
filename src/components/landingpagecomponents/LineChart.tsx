import { LineChart } from '@mui/x-charts/LineChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a dark theme for the chart
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
    },
    primary: {
      main: '#86efac', // green-300
    },
  },
});

interface BasicLineChartProps {
  userTotalValue?: number; // User's deposited amount to determine if they have funds
}

export function BasicLineChart({ userTotalValue = 0 }: BasicLineChartProps) {
  // Mock APY data over time (last 12 months)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const apyData = [7.2, 8.1, 7.8, 8.5, 9.2, 8.8, 9.5, 8.9, 9.1, 8.7, 8.3, 8.5];
  const tvlData = [0, 150, 180, 220, 280, 320, 380, 420, 450, 480, 520, 580];

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="bg-black rounded-xl border border-gray-800 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-mono font-semibold text-white mb-2">Vault Performance</h2>
          <p className="text-sm font-mono text-gray-400">Historical APY trends and Total Value Locked</p>
        </div>
        
        <ThemeProvider theme={darkTheme}>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-lg font-mono font-medium text-white mb-4">APY Performance (%)</h3>
            <LineChart
              xAxis={[{ 
                data: months, 
                scaleType: 'point',
                tickLabelStyle: {
                  fill: '#a3a3a3',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }
              }]}
              series={[
                {
                  data: apyData,
                  color: '#86efac',
                  curve: 'monotoneX',
                  area: true,
                  label: 'APY %',
                },
              ]}
              height={300}
              margin={{ left: 60, right: 30, top: 30, bottom: 60 }}
              grid={{ vertical: true, horizontal: true }}
              sx={{
                '& .MuiChartsAxis-root': {
                  '& .MuiChartsAxis-tickLabel': {
                    fontFamily: 'monospace',
                    fill: '#a3a3a3',
                  },
                  '& .MuiChartsAxis-line': {
                    stroke: '#374151',
                  },
                  '& .MuiChartsAxis-tick': {
                    stroke: '#374151',
                  },
                },
                '& .MuiChartsGrid-root': {
                  '& .MuiChartsGrid-line': {
                    stroke: '#374151',
                    strokeOpacity: 0.3,
                  },
                },
                '& .MuiChartsTooltip-root': {
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  '& .MuiChartsTooltip-table': {
                    fontFamily: 'monospace',
                    color: '#ffffff',
                  },
                },
              }}
            />
          </div>
          
          {/* Portfolio Yield Chart */}
          <div className="bg-gray-900/50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-mono font-medium text-white mb-4">Your Portfolio Yield</h3>
            {userTotalValue > 0 ? (
              // If user has funds, show their yield chart (empty for now since they haven't earned anything)
              <div className="relative">
                <LineChart
                  xAxis={[{ 
                    data: months, 
                    scaleType: 'point',
                    tickLabelStyle: {
                      fill: '#a3a3a3',
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }
                  }]}
                  series={[
                    {
                      data: new Array(12).fill(0), // Empty data since user hasn't earned yield yet
                      color: '#86efac',
                      curve: 'monotoneX',
                      area: true,
                      label: 'Yield Earned (USDC)',
                    },
                  ]}
                  height={300}
                  margin={{ left: 60, right: 30, top: 30, bottom: 60 }}
                  grid={{ vertical: true, horizontal: true }}
                  sx={{
                    '& .MuiChartsAxis-root': {
                      '& .MuiChartsAxis-tickLabel': {
                        fontFamily: 'monospace',
                        fill: '#a3a3a3',
                      },
                      '& .MuiChartsAxis-line': {
                        stroke: '#374151',
                      },
                      '& .MuiChartsAxis-tick': {
                        stroke: '#374151',
                      },
                    },
                    '& .MuiChartsGrid-root': {
                      '& .MuiChartsGrid-line': {
                        stroke: '#374151',
                        strokeOpacity: 0.3,
                      },
                    },
                    '& .MuiChartsTooltip-root': {
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      '& .MuiChartsTooltip-table': {
                        fontFamily: 'monospace',
                        color: '#ffffff',
                      },
                    },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-mono text-sm mb-2">No yield earned yet</p>
                    <p className="text-gray-500 font-mono text-xs">Your yield will appear here as it accumulates</p>
                  </div>
                </div>
              </div>
            ) : (
              // Empty state for users with no deposits
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-mono text-lg mb-2">Start earning yield</p>
                  <p className="text-gray-500 font-mono text-sm mb-4">Deposit USDC tokens to begin tracking your portfolio performance</p>
                  <div className="inline-flex items-center px-4 py-2 bg-green-900/20 border border-green-600 rounded-lg">
                    <svg className="w-4 h-4 text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-green-300 font-mono text-sm">Go to Portfolio tab to deposit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-mono font-medium text-white mb-4">Total Value Locked (K USDC)</h3>
            <LineChart
              xAxis={[{ 
                data: months, 
                scaleType: 'point',
                tickLabelStyle: {
                  fill: '#a3a3a3',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }
              }]}
              series={[
                {
                  data: tvlData,
                  color: '#86efac',
                  curve: 'monotoneX',
                  area: true,
                  label: 'TVL (K)',
                },
              ]}
              height={300}
              margin={{ left: 60, right: 30, top: 30, bottom: 60 }}
              grid={{ vertical: true, horizontal: true }}
              sx={{
                '& .MuiChartsAxis-root': {
                  '& .MuiChartsAxis-tickLabel': {
                    fontFamily: 'monospace',
                    fill: '#a3a3a3',
                  },
                  '& .MuiChartsAxis-line': {
                    stroke: '#374151',
                  },
                  '& .MuiChartsAxis-tick': {
                    stroke: '#374151',
                  },
                },
                '& .MuiChartsGrid-root': {
                  '& .MuiChartsGrid-line': {
                    stroke: '#374151',
                    strokeOpacity: 0.3,
                  },
                },
                '& .MuiChartsTooltip-root': {
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  '& .MuiChartsTooltip-table': {
                    fontFamily: 'monospace',
                    color: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </ThemeProvider>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-green-300 mb-1">8.11%</div>
            <div className="text-sm font-mono text-gray-400">Current APY</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-green-300 mb-1">8.7%</div>
            <div className="text-sm font-mono text-gray-400">12M Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-green-300 mb-1">580K</div>
            <div className="text-sm font-mono text-gray-400">Total TVL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
