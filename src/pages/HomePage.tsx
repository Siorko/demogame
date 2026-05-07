import { useState, useEffect } from 'react';
import { Star, Cpu, Rocket, Pickaxe, TrendingUp, Zap, Coins, Play, Clock, CheckCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const { player, stars, ais, resources, collectResources, calculateHourlyRate, lastOnlineTime } = useGameStore();
  const [displayResources, setDisplayResources] = useState<Record<string, number>>({});
  const [prevResources, setPrevResources] = useState<Record<string, number>>({});
  const [showIncrease, setShowIncrease] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeStars = stars.filter(s => s.status === 'active');
  const depletedStars = stars.filter(s => s.status === 'depleted');

  const getStatusInfo = (star: any) => {
    if (star.status === 'depleted') {
      const timeLeft = Math.max(0, star.dormantUntil - currentTime);
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return {
        label: '休眠中',
        className: 'bg-purple-500/20 text-purple-400',
        extra: `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s 后恢复`
      };
    }
    
    return {
      label: '活跃',
      className: 'bg-green-500/20 text-green-400',
      extra: `${(star.remainingResources / star.totalResources * 100).toFixed(1)}% 剩余`
    };
  };

  useEffect(() => {
    const newDisplay: Record<string, number> = {};
    Object.keys(resources).forEach(key => {
      newDisplay[key] = Math.floor(resources[key as keyof typeof resources]);
    });
    
    const newShowIncrease: Record<string, boolean> = {};
    Object.keys(newDisplay).forEach(key => {
      const prev = prevResources[key] || 0;
      if (newDisplay[key] > prev) {
        newShowIncrease[key] = true;
        setTimeout(() => setShowIncrease(prev => ({ ...prev, [key]: false })), 500);
      }
    });
    
    setDisplayResources(newDisplay);
    setPrevResources(newDisplay);
    setShowIncrease(newShowIncrease);
  }, [resources]);

  const hourlyRate = calculateHourlyRate();
  const totalResources = Object.values(resources).reduce((sum, val) => sum + val, 0);

  const resourceNames: Record<string, string> = {
    iron: '铁矿',
    titanium: '钛合金',
    crystal: '能量晶体',
    rareOre: '稀有矿石',
    nano: '纳米材料',
    darkMatter: '暗物质',
    antiMatter: '反物质',
    exoticMatter: '奇异物质'
  };

  const mainResource = Object.entries(resources).find(([, val]) => val > 0) || ['iron', 0];
  const mainResourceName = resourceNames[mainResource[0]];
  const mainResourceValue = Math.floor(mainResource[1]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f1a2e] pb-32 relative overflow-hidden">
      <div className="absolute inset-0 star-field">
        {[...Array(150)].map((_, i) => (
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

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ECDC4]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9B59B6]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            星际矿业主
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">{stars.length} 颗恒星</span>
            <span className="text-gray-400">•</span>
            <span className="text-green-400">{activeStars.length} 活跃</span>
            <span className="text-gray-400">•</span>
            {depletedStars.length > 0 && (
              <>
                <span className="text-purple-400">{depletedStars.length} 休眠</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <span className="text-gray-400">{ais.length} 个AI</span>
          </div>
        </div>

        <div className="glass-card p-6 mb-4 border-gradient-animated">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">当前 {mainResourceName}</p>
            <div className="relative">
              <p className={`text-5xl md:text-6xl font-bold text-white font-mono transition-all duration-300 ${
                showIncrease[mainResource[0]] ? 'text-green-400 scale-110' : ''
              }`}>
                {mainResourceValue.toLocaleString()}
              </p>
              {showIncrease[mainResource[0]] && (
                <span className="absolute -top-4 right-0 text-green-400 text-lg animate-bounce">
                  +1
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <TrendingUp className="text-green-400" size={16} />
              <span className="text-green-400 font-medium">
                +{Math.floor(hourlyRate / 3600 * 100) / 100}/秒
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#4ECDC4]/20">
            {Object.entries(resources).filter(([, val]) => val > 0).slice(0, 4).map(([key, val]) => (
              <div key={key} className={`text-center p-2 rounded-lg ${
                showIncrease[key] ? 'bg-green-500/20' : 'bg-[#0f3460]/50'
              }`}>
                <p className="text-xs text-gray-400">{resourceNames[key]}</p>
                <p className={`text-sm font-bold text-white font-mono ${
                  showIncrease[key] ? 'text-green-400' : ''
                }`}>
                  {Math.floor(val).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="text-[#FFE66D]" size={20} />
              <span className="text-white font-bold">星币</span>
            </div>
            <span className="text-[#FFE66D] font-bold text-xl font-mono">
              {player.starcoins.toLocaleString()}
            </span>
          </div>

          <button
            onClick={collectResources}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Play size={20} />
            收集资源
          </button>
        </div>

        {depletedStars.length > 0 && (
          <div className="glass-card p-4 mb-4 border border-purple-500/30">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Clock className="text-purple-400" size={18} />
              休眠恒星
            </h3>
            
            <div className="space-y-2">
              {depletedStars.map(star => {
                const config = STAR_CONFIGS[star.type];
                const status = getStatusInfo(star);
                
                return (
                  <div key={star.id} className="flex items-center gap-3 p-3 bg-[#2a1a4a]/50 rounded-xl">
                    <span className="text-2xl opacity-50">{config.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">{star.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${status.className}`}>
                          休眠中
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-purple-400">
                        <CheckCircle size={12} />
                        <span>{status.extra}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="glass-card p-4 mb-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Zap className="text-yellow-400" size={18} />
            快速部署
          </h3>
          
          <div className="space-y-2">
            {stars.slice(0, 3).map((star, index) => {
              const config = STAR_CONFIGS[star.type];
              const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
              const status = getStatusInfo(star);
              
              return (
                <div
                  key={star.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    star.status === 'depleted' ? 'bg-purple-900/20' : 'bg-[#0f3460]/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className={`text-3xl ${star.status === 'depleted' ? 'opacity-50' : ''}`}>
                    {config.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{star.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    {star.status === 'active' && (
                      <div className="w-full bg-[#16213e] rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(star.remainingResources / star.totalResources) * 100}%`,
                            background: config.color
                          }}
                        />
                      </div>
                    )}
                    {star.status === 'active' && assignedAIs.length > 0 && (
                      <p className="text-xs text-green-400 mt-1">{assignedAIs.length} AI 正在工作</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Dashboard />

        <h2 className="text-white font-bold text-lg mt-6 mb-4 flex items-center gap-2">
          <Star className="text-[#4ECDC4]" size={20} />
          全部恒星
        </h2>
        
        <div className="space-y-2">
          {stars.map(star => {
            const config = STAR_CONFIGS[star.type];
            const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
            const status = getStatusInfo(star);
            
            return (
              <div
                key={star.id}
                className={`glass-card p-4 ${
                  star.status === 'depleted' ? 'border-purple-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl ${star.status === 'depleted' ? 'opacity-50' : ''}`}>
                    {config.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{star.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    {star.status === 'active' && (
                      <div className="w-full bg-[#16213e] rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(star.remainingResources / star.totalResources) * 100}%`,
                            background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{star.remainingResources.toLocaleString()} / {star.totalResources.toLocaleString()}</span>
                  <span>维护: {star.maintenanceFee}/天</span>
                </div>
                {star.status === 'active' && assignedAIs.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Cpu size={12} className="text-cyan-400" />
                    <span className="text-xs text-cyan-400">{assignedAIs.length} AI 工作中</span>
                  </div>
                )}
                {star.status === 'depleted' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-purple-400" />
                    <span className="text-xs text-purple-400">{status.extra}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
