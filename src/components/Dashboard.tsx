import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, Zap, Cpu, Rocket, Star, Pickaxe, ArrowRight, Plus, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';

export default function Dashboard() {
  const { player, stars, ais, ships, resources, techTree, miners, assignAI, addMiner } = useGameStore();
  const [showDeployModal, setShowDeployModal] = useState<'ai' | 'miner' | null>(null);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);

  const activeStars = stars.filter(s => s.status === 'active');
  const assignedAIs = ais.filter(ai => ai.currentStarId !== null);
  const totalMaintenance = stars.reduce((sum, s) => sum + s.maintenanceFee, 0);
  
  const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
  const aiTierSum = ais.reduce((sum, ai) => sum + ai.tier, 0);
  const shipBonus = ships.reduce((sum, ship) => sum + ship.level * 0.5, 0);
  
  const dailyProduction = Math.floor(aiTierSum * shipBonus * techMultiplier * 100);
  const dailyNet = dailyProduction - totalMaintenance;

  const resourceTotal = Object.values(resources).reduce((sum, val) => sum + val, 0);

  const topResources = Object.entries(resources)
    .filter(([, val]) => val > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

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

  const handleDeployAI = () => {
    if (selectedAI && selectedStar) {
      assignAI(selectedAI, selectedStar);
      setShowDeployModal(null);
      setSelectedAI(null);
      setSelectedStar(null);
    }
  };

  const handleInstallMiner = () => {
    if (selectedStar) {
      addMiner(selectedStar);
      setShowDeployModal(null);
      setSelectedStar(null);
    }
  };

  const getStarAssignedAIs = (starId: string) => {
    return ais.filter(ai => ai.currentStarId === starId);
  };

  const getStarMiners = (starId: string) => {
    return miners.filter(m => m.starId === starId);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 border-gradient-animated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="text-[#4ECDC4]" size={20} />
            <h3 className="text-white font-bold">运行状态</h3>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="text-yellow-400" size={16} />
            <span className="text-yellow-400 text-sm font-bold">+{(techMultiplier - 1) * 100}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card card-hover-lift">
            <div className="flex items-center gap-2 mb-1">
              <Star className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-xs">活跃恒星</span>
            </div>
            <p className="text-white font-bold text-xl">{activeStars.length} / {stars.length}</p>
          </div>
          
          <div className="stat-card card-hover-lift">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="text-purple-400" size={16} />
              <span className="text-gray-400 text-xs">AI矿工</span>
            </div>
            <p className="text-white font-bold text-xl">{assignedAIs.length} / {ais.length} 工作中</p>
          </div>
          
          <div className="stat-card card-hover-lift">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="text-blue-400" size={16} />
              <span className="text-gray-400 text-xs">飞船舰队</span>
            </div>
            <p className="text-white font-bold text-xl">{ships.length} 艘</p>
          </div>
          
          <div className="stat-card card-hover-lift">
            <div className="flex items-center gap-2 mb-1">
              <Pickaxe className="text-orange-400" size={16} />
              <span className="text-gray-400 text-xs">矿机</span>
            </div>
            <p className="text-white font-bold text-xl">{miners.length} 台</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 border-green-500/30 card-hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={18} />
            <span className="text-gray-400 text-sm">日产出</span>
          </div>
          <p className="text-white font-bold text-2xl">+{dailyProduction.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">资源/天</p>
        </div>
        
        <div className="glass-card p-4 border-red-500/30 card-hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-400" size={18} />
            <span className="text-gray-400 text-sm">日维护费</span>
          </div>
          <p className="text-white font-bold text-2xl">-{totalMaintenance.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">星币/天</p>
        </div>
      </div>

      <div className="glass-card p-4 card-hover-lift">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">资源库存</h3>
          <span className="text-gray-400 text-sm">{Math.floor(resourceTotal).toLocaleString()} 总资源</span>
        </div>
        
        <div className="space-y-2">
          {topResources.length > 0 ? (
            topResources.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-[#4ECDC4]/10 last:border-0">
                <span className="text-gray-400 text-sm">{resourceNames[key]}</span>
                <span className="text-white font-mono text-sm">{Math.floor(value).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">暂无资源，快去挖矿吧！</p>
          )}
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="text-[#4ECDC4]" size={20} />
            <h3 className="text-white font-bold">恒星部署管理</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeployModal('ai')}
              className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 text-sm hover:bg-purple-500/30 transition-all flex items-center gap-1"
            >
              <Cpu size={14} />
              部署AI
            </button>
            <button
              onClick={() => setShowDeployModal('miner')}
              className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-400 text-sm hover:bg-orange-500/30 transition-all flex items-center gap-1"
            >
              <Pickaxe size={14} />
              安装矿机
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {stars.map((star, index) => {
            const config = STAR_CONFIGS[star.type];
            const progress = (star.remainingResources / star.totalResources) * 100;
            const starAIs = getStarAssignedAIs(star.id);
            const starMiners = getStarMiners(star.id);
            
            return (
              <div key={star.id} className="bg-[#0f3460]/50 rounded-xl p-4 border border-[#4ECDC4]/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-star-twinkle" style={{ animationDelay: `${index * 0.2}s` }}>
                      {config.icon}
                    </span>
                    <div>
                      <h4 className="text-white font-medium">{star.name}</h4>
                      <p className="text-gray-400 text-xs">{config.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    star.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    star.status === 'depleted' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {star.status === 'active' ? '活跃' : star.status === 'depleted' ? '枯竭' : '休眠'}
                  </span>
                </div>

                <div className="w-full bg-[#16213e] rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-gray-400">剩余: {star.remainingResources.toLocaleString()}</span>
                  <span className="text-gray-400">维护费: {star.maintenanceFee}/天</span>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#4ECDC4]/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu size={14} className="text-purple-400" />
                      <span className="text-gray-400 text-xs">AI矿工</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {starAIs.length > 0 ? (
                        starAIs.map(ai => (
                          <span key={ai.id} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                            {ai.name} (T{ai.tier})
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">未部署</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Pickaxe size={14} className="text-orange-400" />
                      <span className="text-gray-400 text-xs">矿机</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{starMiners.length}/10</span>
                      {starMiners.filter(m => m.isDeep).length > 0 && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                          {starMiners.filter(m => m.isDeep).length} 深层
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {stars.length === 0 && (
          <div className="text-center py-8">
            <Star className="text-gray-600 mx-auto mb-2" size={48} />
            <p className="text-gray-400">还没有恒星，快去探索吧！</p>
          </div>
        )}
      </div>

      {showDeployModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16213e] rounded-2xl p-6 w-full max-w-md border border-[#4ECDC4]/30 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">
                {showDeployModal === 'ai' ? '部署AI矿工' : '安装矿机'}
              </h3>
              <button
                onClick={() => {
                  setShowDeployModal(null);
                  setSelectedAI(null);
                  setSelectedStar(null);
                }}
                className="p-1 hover:bg-[#0f3460] rounded-lg transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {showDeployModal === 'ai' && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">选择AI矿工:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {ais.filter(ai => !ai.currentStarId).map(ai => (
                      <button
                        key={ai.id}
                        onClick={() => setSelectedAI(selectedAI === ai.id ? null : ai.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selectedAI === ai.id
                            ? 'bg-purple-500/30 border border-purple-500'
                            : 'bg-[#0f3460]/50 border border-transparent hover:border-purple-500/30'
                        }`}
                      >
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Cpu size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{ai.name}</p>
                          <p className="text-gray-400 text-xs">T{ai.tier} · 速度 x{ai.tier}</p>
                        </div>
                        {selectedAI === ai.id && <span className="text-purple-400">✓</span>}
                      </button>
                    ))}
                    {ais.filter(ai => !ai.currentStarId).length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">没有空闲的AI矿工</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">选择目标恒星:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {stars.filter(s => s.status === 'active').map(star => {
                      const config = STAR_CONFIGS[star.type];
                      const starAIs = getStarAssignedAIs(star.id);
                      
                      return (
                        <button
                          key={star.id}
                          onClick={() => setSelectedStar(selectedStar === star.id ? null : star.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            selectedStar === star.id
                              ? 'bg-[#4ECDC4]/30 border border-[#4ECDC4]'
                              : 'bg-[#0f3460]/50 border border-transparent hover:border-[#4ECDC4]/30'
                          }`}
                        >
                          <span className="text-2xl">{config.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{star.name}</p>
                            <p className="text-gray-400 text-xs">
                              {starAIs.length} AI · {star.remainingResources.toLocaleString()} 资源
                            </p>
                          </div>
                          {selectedStar === star.id && <span className="text-[#4ECDC4]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleDeployAI}
                  disabled={!selectedAI || !selectedStar}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowRight size={18} />
                  确认部署
                </button>
              </>
            )}

            {showDeployModal === 'miner' && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">选择目标恒星:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {stars.filter(s => s.status === 'active').map(star => {
                      const config = STAR_CONFIGS[star.type];
                      const starMiners = getStarMiners(star.id);
                      const cost = 200 * (starMiners.length + 1);
                      
                      return (
                        <button
                          key={star.id}
                          onClick={() => setSelectedStar(selectedStar === star.id ? null : star.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            selectedStar === star.id
                              ? 'bg-orange-500/30 border border-orange-500'
                              : 'bg-[#0f3460]/50 border border-transparent hover:border-orange-500/30'
                          }`}
                        >
                          <span className="text-2xl">{config.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{star.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">{starMiners.length}/10 矿机</span>
                              <span className="text-orange-400 text-xs">费用: {cost}星币</span>
                            </div>
                          </div>
                          {selectedStar === star.id && <span className="text-orange-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleInstallMiner}
                  disabled={!selectedStar}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  安装矿机
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
