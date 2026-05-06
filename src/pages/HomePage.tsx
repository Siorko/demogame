import { Star, Cpu, Rocket, Gem, Coins, Pickaxe, Activity } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';
import Dashboard from '../components/Dashboard';
import Achievements from '../components/Achievements';

export default function HomePage() {
  const { player, stars, ais, ships, resources, collectResources } = useGameStore();

  const activeStars = stars.filter(s => s.status === 'active');
  const depletedStars = stars.filter(s => s.status === 'depleted');
  const dormantStars = stars.filter(s => s.status === 'dormant');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] bg-clip-text text-transparent mb-2">
            星际矿业主
          </h1>
          <p className="text-gray-400">探索宇宙，开采无限资源</p>
        </div>

        <div className="bg-gradient-to-br from-[#4ECDC4]/10 to-[#45B7AA]/5 rounded-2xl p-2 mb-6 border border-[#4ECDC4]/20">
          <div className="flex items-center gap-2 px-4 py-2">
            <Activity className="text-[#4ECDC4]" size={18} />
            <span className="text-[#4ECDC4] text-sm">主运行台</span>
          </div>
        </div>

        <Dashboard />

        <div className="mt-6">
          <button
            onClick={collectResources}
            className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#4ECDC4]/30 hover:shadow-[#4ECDC4]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Pickaxe size={24} />
            <span>收集资源</span>
          </button>
        </div>

        <div className="mt-6">
          <Achievements />
        </div>

        <h2 className="text-white font-bold text-lg mt-8 mb-4 flex items-center gap-2">
          <Star className="text-[#4ECDC4]" size={20} />
          我的恒星
        </h2>
        
        <div className="space-y-3">
          {stars.map(star => {
            const config = STAR_CONFIGS[star.type];
            const progress = (star.remainingResources / star.totalResources) * 100;
            
            return (
              <div
                key={star.id}
                className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460] hover:border-[#4ECDC4]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{star.name}</h3>
                      <p className="text-gray-400 text-xs">{config.name} · 维护费: {star.maintenanceFee}/天</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    star.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    star.status === 'depleted' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {star.status === 'active' ? '活跃' : star.status === 'depleted' ? '枯竭' : '休眠'}
                  </span>
                </div>
                <div className="w-full bg-[#0f3460] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400 text-xs">剩余资源</span>
                  <span className="text-white text-xs font-mono">{star.remainingResources.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {stars.length === 0 && (
          <div className="text-center py-12">
            <Star className="text-gray-600 mx-auto mb-4" size={64} />
            <p className="text-gray-400">还没有恒星，快去探索吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
