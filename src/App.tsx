import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import HangarPage from './pages/HangarPage';
import ExchangePage from './pages/ExchangePage';
import ExplorePage from './pages/ExplorePage';
import TechPage from './pages/TechPage';
import ArenaPage from './pages/ArenaPage';
import DysonSpherePage from './pages/DysonSpherePage';

export default function App() {
  const { initializeGame, currentPage, setCurrentPage, tick, collectResources } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'market':
        return <MarketPage />;
      case 'hangar':
        return <HangarPage />;
      case 'exchange':
        return <ExchangePage />;
      case 'explore':
        return <ExplorePage />;
      case 'tech':
        return <TechPage />;
      case 'arena':
        return <ArenaPage />;
      case 'dyson':
        return <DysonSpherePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#1a1a2e]">
        {renderPage()}
        <Navbar />
      </div>
    </Router>
  );
}
