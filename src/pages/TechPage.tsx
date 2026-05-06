import { FlaskConical, Lock, Check, Zap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function TechPage() {
  const { techTree, player, unlockTech } = useGameStore();

  const handleUnlock = (techId: string) => {
    const tech = techTree.find(t => t.id === techId);
    if (!tech) return;
    
    const prereqsMet = tech.prerequisites.every(prereqId => 
      techTree.find(t => t.id === prereqId)?.unlocked
    );
    
    if (!prereqsMet) {
      alert('请先解锁前置科技！');
      return;
    }
    
    if (player.starcoins < tech.cost) {
      alert('星币不足！');
      return;
    }
    
    unlockTech(techId);
  };

  const getTechStatus = (techId: string) => {
    const tech = techTree.find(t => t.id === techId);
    if (!tech) return 'locked';
    
    if (tech.unlocked) return 'unlocked';
    
    const prereqsMet = tech.prerequisites.every(prereqId => 
      techTree.find(t => t.id === prereqId)?.unlocked
    );
    
    return prereqsMet ? 'available' : 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] rounded-xl">
            <FlaskConical className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">科技实验室</h1>
            <p className="text-gray-400 text-sm">解锁新科技，提升采矿效率</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#4ECDC4]/20 to-[#45B7AA]/10 rounded-2xl p-4 mb-6 border border-[#4ECDC4]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="text-[#4ECDC4]" size={24} />
              <div>
                <h3 className="text-white font-medium">科技等级</h3>
                <p className="text-gray-400 text-sm">当前等级: {player.techLevel} · 重置次数: {player.techResetCount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#4ECDC4] font-bold text-lg">+{player.techResetCount * 100}%</p>
              <p className="text-gray-400 text-xs">全局加成</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {techTree.map((tech, index) => {
            const status = getTechStatus(tech.id);
            
            return (
              <div
                key={tech.id}
                className={`relative rounded-xl p-4 border transition-all ${
                  status === 'unlocked' 
                    ? 'bg-gradient-to-br from-[#4ECDC4]/20 to-[#45B7AA]/10 border-[#4ECDC4]/50' 
                    : status === 'available'
                    ? 'bg-[#16213e]/50 border-[#4ECDC4]/30 hover:border-[#4ECDC4]/50'
                    : 'bg-[#16213e]/30 border-[#0f3460] opacity-60'
                }`}
                style={{ 
                  marginLeft: `${Math.min(index * 12, 48)}px`,
                  position: 'relative'
                }}
              >
                {index > 0 && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-12 h-0.5 bg-[#4ECDC4]/30"
                    style={{ left: `-12px` }}
                  />
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      status === 'unlocked' 
                        ? 'bg-[#4ECDC4]/30' 
                        : status === 'available'
                        ? 'bg-[#0f3460]'
                        : 'bg-gray-700/50'
                    }`}>
                      {status === 'unlocked' ? (
                        <Check className="text-[#4ECDC4]" size={24} />
                      ) : status === 'available' ? (
                        <FlaskConical className="text-[#4ECDC4]" size={20} />
                      ) : (
                        <Lock className="text-gray-500" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${
                          status === 'unlocked' ? 'text-[#4ECDC4]' : 'text-white'
                        }`}>
                          {tech.name}
                        </h3>
                        {status === 'unlocked' && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            已解锁
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{tech.description}</p>
                      <p className="text-[#FFE66D] text-xs mt-1 flex items-center gap-1">
                        <Zap size={12} />
                        {tech.effect}
                      </p>
                      {tech.prerequisites.length > 0 && status !== 'unlocked' && (
                        <p className="text-gray-500 text-xs mt-2">
                          需要: {tech.prerequisites.map(prereqId => {
                            const prereq = techTree.find(t => t.id === prereqId);
                            return prereq?.name;
                          }).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  {status === 'available' && (
                    <button
                      onClick={() => handleUnlock(tech.id)}
                      className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] rounded-xl text-white font-medium hover:shadow-lg hover:shadow-[#4ECDC4]/30 transition-all"
                    >
                      {tech.cost === 0 ? '免费' : `${tech.cost}星币`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-gradient-to-r from-[#9B59B6]/20 to-[#8E44AD]/10 rounded-xl p-4 border border-[#9B59B6]/30">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2">
            <Zap className="text-[#9B59B6]" size={18} />
            科技跃迁
          </h3>
          <p className="text-gray-400 text-sm">
            达到50级后可进行科技跃迁，重置星币和矿石，保留AI、飞船、恒星，科技等级+1，所有AI挖掘速度翻倍。
          </p>
        </div>
      </div>
    </div>
  );
}
