export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left - Logo & Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-white font-bold text-lg">yUSDC Vault</h2>
          <p className="text-gray-500 mt-1">Automated yield strategies on Solana</p>
        </div>

        {/* Center - Built on Solana */}
        <div className="flex items-center space-x-2">
          <img src="https://cdn3.emoji.gg/emojis/7187-solana.png" alt="Solana" className="w-5 h-5" />
          <span className="uppercase text-gray-400 tracking-wider">
            Built on Solana
          </span>
        </div>

        {/* Right - Social Links */}
        <div className="flex space-x-5">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <span className="text-sm">Twitter</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <span className="text-sm">Discord</span>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} yUSDC Vault. All rights reserved.
      </div>
    </footer>
  );
}