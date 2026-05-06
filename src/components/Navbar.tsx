import { Home, Store, Plane, TrendingUp, Compass, FlaskConical, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const navItems = [
  { id: 'home', icon: Home, label: '空间站' },
  { id: 'market', icon: Store, label: '售货区' },
  { id: 'hangar', icon: Plane, label: '机库' },
  { id: 'exchange', icon: TrendingUp, label: '交易所' },
  { id: 'explore', icon: Compass, label: '探索' },
  { id: 'tech', icon: FlaskConical, label: '科技' },
  { id: 'arena', icon: Trophy, label: '竞技场' },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, player } = useGameStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-md border-t border-[#0f3460]/30 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              currentPage === item.id
                ? 'bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] text-white shadow-lg shadow-[#4ECDC4]/30 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-[#16213e]/50'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-gradient-to-r from-[#1a1a2e] via-[#0f3460] to-[#1a1a2e] px-6 py-2 rounded-b-xl border-b border-x border-[#4ECDC4]/30">
        <div className="flex items-center gap-3">
          <span className="text-[#4ECDC4] font-bold text-lg">星币</span>
          <span className="text-white font-mono text-lg">{player.starcoins.toLocaleString()}</span>
        </div>
      </div>
    </nav>
  );
}
