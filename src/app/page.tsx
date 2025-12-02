import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      <Navbar />
      <HeroSection />
      <PortfolioSection />
      <Footer />
    </div>
  );
}