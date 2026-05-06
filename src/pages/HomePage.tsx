import { Star, Cpu, Rocket, Gem, Coins, Pickaxe, Activity, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32 relative overflow-hidden">
      <div className="absolute inset-0 star-field">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ECDC4]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9B59B6]/5 rounded-full blur-3xl" />

      <div className="relative z-10 p-6">
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-2 bg-gradient-to-r from-[#4ECDC4]/20 to-[#9B59B6]/20 rounded-full border border-[#4ECDC4]/30">
            <Sparkles className="text-[#FFE66D]" size={16} />
            <span className="text-[#4ECDC4] text-sm">欢迎来到星际矿业主</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            星际矿业主
          </h1>
          <p className="text-gray-400">探索宇宙，开采无限资源</p>
        </div>

        <div className="glass-card p-2 mb-6 border-gradient animate-slide-in-left">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Activity className="text-[#4ECDC4]" size={18} />
              <span className="text-[#4ECDC4] text-sm font-medium">主运行台</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="text-[#FFE66D]" size={16} />
              <span className="text-[#FFE66D] font-bold">{player.starcoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="animate-slide-in-right">
          <Dashboard />
        </div>

        <div className="mt-6 animate-fade-in-up">
          <button
            onClick={collectResources}
            className="w-full btn-primary flex items-center justify-center gap-2 animate-pulse-glow"
          >
            <Pickaxe size={24} />
            <span>收集资源</span>
          </button>
        </div>

        <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Achievements />
        </div>

        <h2 className="text-white font-bold text-lg mt-8 mb-4 flex items-center gap-2">
          <Star className="text-[#4ECDC4]" size={20} />
          我的恒星
        </h2>
        
        <div className="space-y-3">
          {stars.map((star, index) => {
            const config = STAR_CONFIGS[star.type];
            const progress = (star.remainingResources / star.totalResources) * 100;
            
            return (
              <div
                key={star.id}
                className="glass-card p-4 card-hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-star-twinkle" style={{ animationDelay: `${index * 0.2}s` }}>
                      {config.icon}
                    </span>
                    <div>
                      <h3 className="text-white font-medium">{star.name}</h3>
                      <p className="text-gray-400 text-xs">{config.name} · 维护费: {star.maintenanceFee}/天</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    star.status === 'active' ? 'bg-green-500/20 text-green-400 glow-green' :
                    star.status === 'depleted' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-blue-500/20 text-blue-400 glow-blue'
                  }`}>
                    {star.status === 'active' ? '活跃' : star.status === 'depleted' ? '枯竭' : '休眠'}
                  </span>
                </div>
                <div className="w-full progress-bar">
                  <div
                    className="progress-fill"
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
          <div className="text-center py-12 animate-fade-in-up">
            <Star className="text-gray-600 mx-auto mb-4" size={64} />
            <p className="text-gray-400">还没有恒星，快去探索吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
