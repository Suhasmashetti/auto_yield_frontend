import { useState } from "react";

export function FAQ() {
  const faqs = [
    {
      q: "What is BlueBerry Finance?", 
      a: "BlueBerry Finance is a decentralized yield aggregator on Solana that helps users maximize their stablecoin yields through automated strategies."
    },
    { 
      q: "What does BlueBerry Finance do?", 
      a: "BlueBerry Finance is a yield aggregator that optimizes your stablecoin yield by automatically allocating funds to the best protocols on Solana." 
    },
    { 
      q: "How is the yield earned?", 
      a: "Yield is earned by lending your deposited USDC/USDT to top protocols. The vault automatically moves funds to capture the highest available rates." 
    },
    { 
      q: "How does the yield get paid to me?", 
      a: "Yield accrues to the value of your BBC tokens. When you redeem BBC, you receive your share of the vault, including earned yield." 
    },
    { 
      q: "When can I withdraw my stablecoins?", 
      a: "You can withdraw at any time by redeeming your BBC tokens for USDC." 
    },
    { 
      q: "How do I get BBC?", 
      a: "Deposit USDC into the vault to receive BBC tokens representing your share." 
    },
    { 
      q: "What risks should I know about?", 
      a: "Risks include smart contract risk, protocol risk, and market volatility. BlueBerry Finance aims to minimize risk by diversifying and using audited protocols." 
    },
    { 
      q: "How do you manage risk?", 
      a: "We monitor protocol health, diversify allocations, and use only reputable, audited protocols to help protect your funds." 
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-5xl mx-auto px-4 py-24">
      <h2 className="text-3xl font-mono font-bold mb-8 text-center text-white">Frequently asked questions</h2>
      <div className="divide-y divide-gray-800">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <button
              className="w-full flex justify-between items-center py-6 text-lg font-mono font-medium text-left text-white hover:text-gray-300 focus:outline-none transition-colors"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span>{faq.q}</span>
              <span className="text-2xl text-gray-400 transition-transform duration-200" style={{
                transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)'
              }}>+</span>
            </button>
            {open === idx && (
              <div className="pb-6 text-gray-300 font-mono text-base leading-relaxed animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}