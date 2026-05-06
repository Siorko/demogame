import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import HangarPage from './pages/HangarPage';
import ExchangePage from './pages/ExchangePage';
import ExplorePage from './pages/ExplorePage';
import TechPage from './pages/TechPage';
import ArenaPage from './pages/ArenaPage';

export default function App() {
  const { initializeGame, currentPage, setCurrentPage } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, []);

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
