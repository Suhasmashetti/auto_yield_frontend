import doodleBackground from '../../assets/background/doodle.jpg';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div
      className="p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 relative overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `url(${doodleBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70 rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-md">
          {icon}
        </div>
        <div className="text-4xl font-mono font-bold text-white mb-2">{value}</div>
        <div className="text-gray-300 font-mono text-sm uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <div className="relative z-10 py-20 rounded-xl">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-mono font-bold text-white uppercase tracking-wider text-center mb-12">
          Vault Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <StatCard
            icon={
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
            value="8.5%"
            label="Average APY"
          />

          <StatCard
            icon={
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            value="0"
            label="Minimum Deposit"
          />

          <StatCard
            icon={
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
            value="24/7"
            label="Automated"
          />
        </div>
      </div>
    </div>
  );
}
