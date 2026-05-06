import { Activity, TrendingUp, TrendingDown, Cpu, Rocket, Pickaxe } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function Dashboard() {
  const { stars, ais, ships, miners, techTree } = useGameStore();

  const activeStars = stars.filter(s => s.status === 'active');
  const assignedAIs = ais.filter(ai => ai.currentStarId !== null);
  const totalMaintenance = stars.reduce((sum, s) => sum + s.maintenanceFee, 0);
  
  const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;

  const totalMiners = miners.length;
  const totalAISlots = ships.reduce((sum, ship) => sum + ship.aiSlots, 0);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-[#4ECDC4]" size={20} />
        <h3 className="text-white font-bold">运营数据</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0f3460]/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Rocket className="text-blue-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{ships.length}</p>
          <p className="text-xs text-gray-400">飞船</p>
        </div>

        <div className="bg-[#0f3460]/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Cpu className="text-purple-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{assignedAIs.length}/{totalAISlots}</p>
          <p className="text-xs text-gray-400">AI工位</p>
        </div>

        <div className="bg-[#0f3460]/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Pickaxe className="text-orange-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{totalMiners}</p>
          <p className="text-xs text-gray-400">矿机</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-[#0f3460]/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-400" size={14} />
            <span className="text-xs text-gray-400">日维护</span>
          </div>
          <p className="text-lg font-bold text-red-400">-{totalMaintenance}</p>
        </div>

        <div className="bg-[#0f3460]/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-yellow-400" size={14} />
            <span className="text-xs text-gray-400">科技加成</span>
          </div>
          <p className="text-lg font-bold text-green-400">+{(techMultiplier - 1) * 100}%</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#4ECDC4]/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">活跃恒星</span>
          <span className="text-white font-bold">{activeStars.length} / {stars.length}</span>
        </div>
      </div>
    </div>
  );
}
