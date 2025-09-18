import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import bluberry from "../../assets/icons/blueberry.png";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // adds blur when scrolled
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 border-b border-black transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-black/50" : "bg-transparent"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
          <img src={bluberry} alt="BlueBerry Logo" />
        </div>
        <span className="text-xl font-mono font-bold text-white/80">BlueBerry Finance</span>
      </div>

      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/vault"
            className="text-white font-mono hover:text-white/80 transition-colors"
          >
            VAULT
          </Link>
          <Link
            to="/dashboard"
            className="text-white font-mono hover:text-white/80 transition-colors"
          >
            DASHBOARD
          </Link>
          <Link
            to="/docs"
            className="text-white font-mono hover:text-white/80 transition-colors"
          >
            DOCS
          </Link>
        </nav>

        <WalletMultiButton className="!bg-white !text-black !rounded-none !px-6 !py-2 !font-medium hover:!bg-gray-200 !transition-all !duration-300" />
      </div>
    </nav>
  );
}
