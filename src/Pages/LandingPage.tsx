import { GridBackgroundDemo } from "../components/shadcomponents/GridBackground";
import { Navigation, Hero, Stats, CallToAction, Features, Footer, HowItWorks, FAQ } from "../components/landingpagecomponents";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Grid Background */}
      <GridBackgroundDemo />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero onGetStarted={onGetStarted} />

      {/* Stats Section */}
      <Stats />

      {/* How It Works Section */}
      <HowItWorks />

      {/* FAQ Section */}
      <FAQ />

      {/* Ready to Start Section */}
      <CallToAction />

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer />
      
    </div>
  );
}