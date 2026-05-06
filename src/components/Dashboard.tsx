import { Activity, TrendingUp, TrendingDown, Clock, Zap, Cpu, Rocket, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';

export default function Dashboard() {
  const { player, stars, ais, ships, resources, techTree } = useGameStore();

  const activeStars = stars.filter(s => s.status === 'active');
  const assignedAIs = ais.filter(ai => ai.currentStarId !== null);
  const totalMaintenance = stars.reduce((sum, s) => sum + s.maintenanceFee, 0);
  
  const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
  const aiTierSum = ais.reduce((sum, ai) => sum + ai.tier, 0);
  const shipBonus = ships.length * 0.5;
  
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

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#4ECDC4]/20 to-[#45B7AA]/10 rounded-2xl p-4 border border-[#4ECDC4]/30">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-[#4ECDC4]" size={20} />
          <h3 className="text-white font-bold">运行状态</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#16213e]/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-xs">活跃恒星</span>
            </div>
            <p className="text-white font-bold text-xl">{activeStars.length} / {stars.length}</p>
          </div>
          
          <div className="bg-[#16213e]/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="text-purple-400" size={16} />
              <span className="text-gray-400 text-xs">AI矿工</span>
            </div>
            <p className="text-white font-bold text-xl">{assignedAIs.length} / {ais.length} 工作中</p>
          </div>
          
          <div className="bg-[#16213e]/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="text-blue-400" size={16} />
              <span className="text-gray-400 text-xs">飞船舰队</span>
            </div>
            <p className="text-white font-bold text-xl">{ships.length} 艘</p>
          </div>
          
          <div className="bg-[#16213e]/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-xs">科技加成</span>
            </div>
            <p className="text-white font-bold text-xl">+{(techMultiplier - 1) * 100}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={18} />
            <span className="text-gray-400 text-sm">日产出</span>
          </div>
          <p className="text-white font-bold text-2xl">+{dailyProduction.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">资源/天</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-400" size={18} />
            <span className="text-gray-400 text-sm">日维护费</span>
          </div>
          <p className="text-white font-bold text-2xl">-{totalMaintenance.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">星币/天</p>
        </div>
      </div>

      <div className={`rounded-xl p-4 border ${
        dailyNet >= 0 
          ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30'
          : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={dailyNet >= 0 ? 'text-blue-400' : 'text-red-400'} size={20} />
            <span className="text-gray-400">日净收益</span>
          </div>
          <p className={`font-bold text-xl ${dailyNet >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {dailyNet >= 0 ? '+' : ''}{dailyNet.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">资源库存</h3>
          <span className="text-gray-400 text-sm">{Math.floor(resourceTotal).toLocaleString()} 总资源</span>
        </div>
        
        <div className="space-y-2">
          {topResources.length > 0 ? (
            topResources.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{resourceNames[key]}</span>
                <span className="text-white font-mono text-sm">{Math.floor(value).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">暂无资源，快去挖矿吧！</p>
          )}
        </div>
      </div>

      <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-gray-400" size={18} />
          <h3 className="text-white font-medium">恒星状态</h3>
        </div>
        
        <div className="space-y-2">
          {stars.slice(0, 5).map(star => {
            const config = STAR_CONFIGS[star.type];
            const progress = (star.remainingResources / star.totalResources) * 100;
            
            return (
              <div key={star.id} className="flex items-center gap-3">
                <span className="text-xl">{config.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{star.name}</span>
                    <span className={`text-xs ${
                      star.status === 'active' ? 'text-green-400' :
                      star.status === 'depleted' ? 'text-gray-400' : 'text-blue-400'
                    }`}>
                      {star.status === 'active' ? '活跃' : star.status === 'depleted' ? '枯竭' : '休眠'}
                    </span>
                  </div>
                  <div className="w-full bg-[#0f3460] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        background: config.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {stars.length > 5 && (
            <p className="text-gray-500 text-xs text-center mt-2">还有 {stars.length - 5} 颗恒星...</p>
          )}
        </div>
      </div>
    </div>
  );
}
