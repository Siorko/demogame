import { useState } from 'react';
import { Sparkles, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { RESOURCE_PRICE_CONFIGS } from '../types/game';

const resourceDisplayInfo = [
  { key: 'iron', name: '铁矿', icon: '⛏️' },
  { key: 'titanium', name: '钛合金', icon: '🔩' },
  { key: 'crystal', name: '能量晶体', icon: '💎' },
  { key: 'rareOre', name: '稀有矿石', icon: '💠' },
  { key: 'nano', name: '纳米材料', icon: '⚛️' },
  { key: 'darkMatter', name: '暗物质', icon: '🔮' },
  { key: 'antiMatter', name: '反物质', icon: '⚡' },
  { key: 'exoticMatter', name: '奇异物质', icon: '🌀' }
];

const requiredResources = {
  iron: 100000,
  titanium: 50000,
  crystal: 20000,
  rareOre: 10000,
  nano: 5000,
  darkMatter: 1000,
  antiMatter: 500,
  exoticMatter: 100
};

export default function DysonSpherePage() {
  const { 
    resources, 
    player, 
    stars, 
    dysonSphereBuilt, 
    dysonSphereProgress,
    buildDysonSphere,
    contributeToDysonSphere
  } = useGameStore();
  
  const [contributeAmounts, setContributeAmounts] = useState<Record<string, number>>({});
  
  const canBuild = 
    Object.entries(requiredResources).every(([key, amount]) => resources[key as keyof typeof resources] >= amount) &&
    player.starcoins >= 1000000 &&
    stars.length >= 3;
  
  const getProgressPercent = (resource: string, current: number, required: number) => {
    return Math.min(100, (current / required) * 100);
  };
  
  const handleContribute = (resourceKey: keyof typeof resources) => {
    const amount = contributeAmounts[resourceKey] || 0;
    if (amount > 0) {
      contributeToDysonSphere(resourceKey, amount);
      setContributeAmounts(prev => ({ ...prev, [resourceKey]: 0 }));
    }
  };
  
  const handleMaxContribute = (resourceKey: keyof typeof resources) => {
    const available = resources[resourceKey];
    const needed = requiredResources[resourceKey as keyof typeof requiredResources];
    const toContribute = Math.min(available, needed);
    if (toContribute > 0) {
      contributeToDysonSphere(resourceKey, toContribute);
    }
  };
  
  if (dysonSphereBuilt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f1a2e] pb-32">
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 animate-pulse">
              <Sparkles className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">戴森球已建造完成！</h1>
            <p className="text-green-400 text-lg">所有恒星产出已翻倍</p>
          </div>
          
          <div className="glass-card p-6 border-gradient-animated">
            <div className="text-center">
              <div className="text-6xl mb-4">🌞</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">戴森球正在运作</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#0f3460]/50 rounded-xl p-4">
                  <Zap className="text-yellow-400 w-8 h-8 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">产出加成</p>
                  <p className="text-2xl font-bold text-white">2.0x</p>
                </div>
                <div className="bg-[#0f3460]/50 rounded-xl p-4">
                  <CheckCircle2 className="text-green-400 w-8 h-8 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">状态</p>
                  <p className="text-2xl font-bold text-white">正常</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 glass-card p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              效果说明
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• 所有恒星的矿产产出提升 100%</li>
              <li>• 离线收益同样享受加成</li>
              <li>• 成就系统获得额外奖励</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f1a2e] pb-32">
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 mb-4">
            <Sparkles className="text-gray-400 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">建造戴森球</h1>
          <p className="text-gray-400">收集资源，建造终极能量收集装置</p>
        </div>
        
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">建造进度</span>
            <span className="text-yellow-400 font-bold">{dysonSphereProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#16213e] rounded-full h-4 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${dysonSphereProgress}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <h3 className="text-white font-bold text-lg">所需资源</h3>
          {resourceDisplayInfo.map(({ key, name, icon }) => {
            const current = resources[key as keyof typeof resources];
            const required = requiredResources[key as keyof typeof requiredResources];
            const progress = getProgressPercent(key, current, required);
            const isComplete = current >= required;
            
            return (
              <div 
                key={key} 
                className={`glass-card p-4 ${isComplete ? 'border-green-500/50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-white font-medium">{name}</p>
                      <p className="text-gray-400 text-sm">
                        {Math.floor(current).toLocaleString()} / {required.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {isComplete ? (
                    <CheckCircle2 className="text-green-400" size={24} />
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max={current}
                        value={contributeAmounts[key] || ''}
                        onChange={(e) => setContributeAmounts(prev => ({
                          ...prev,
                          [key]: Math.min(Math.max(0, parseInt(e.target.value) || 0), current)
                        }))}
                        className="w-24 bg-[#0f3460] border border-[#4ECDC4]/30 rounded-lg px-3 py-1 text-white text-sm text-center font-mono focus:outline-none focus:border-[#4ECDC4]"
                        placeholder="0"
                      />
                      <button
                        onClick={() => handleMaxContribute(key as keyof typeof resources)}
                        className="px-3 py-1 bg-[#0f3460] border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-white/50 transition-all text-xs"
                      >
                        全部
                      </button>
                      <button
                        onClick={() => handleContribute(key as keyof typeof resources)}
                        disabled={(contributeAmounts[key] || 0) <= 0}
                        className="px-3 py-1 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] rounded-lg text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4ECDC4]/30 transition-all"
                      >
                        贡献
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full bg-[#16213e] rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-green-500' : 'bg-[#4ECDC4]'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-4 mb-6">
          <h3 className="text-white font-bold text-lg">建造条件</h3>
          
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  player.starcoins >= 1000000 ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                  {player.starcoins >= 1000000 ? (
                    <CheckCircle2 className="text-green-400" size={18} />
                  ) : (
                    <AlertCircle className="text-gray-400" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">星币</p>
                  <p className="text-gray-400 text-sm">
                    {player.starcoins.toLocaleString()} / 1,000,000
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stars.length >= 3 ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                  {stars.length >= 3 ? (
                    <CheckCircle2 className="text-green-400" size={18} />
                  ) : (
                    <AlertCircle className="text-gray-400" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">恒星数量</p>
                  <p className="text-gray-400 text-sm">
                    {stars.length} / 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={buildDysonSphere}
          disabled={!canBuild}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canBuild
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canBuild ? '🎊 建造戴森球' : '🔒 条件未满足'}
        </button>
        
        <div className="mt-6 glass-card p-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={18} />
            建造奖励
          </h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• 所有恒星的矿产产出提升 100%</li>
            <li>• 离线收益同样享受加成</li>
            <li>• 获得专属成就</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
