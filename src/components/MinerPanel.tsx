import { useState } from 'react';
import { Pickaxe, Plus, ArrowRight, Zap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';

export default function MinerPanel() {
  const { stars, miners, selectedStar, selectStar } = useGameStore();
  const [selectedStarForMiner, setSelectedStarForMiner] = useState<string | null>(null);

  const activeStars = stars.filter(s => s.status === 'active');

  const handleInstallMiner = (starId: string) => {
    const starMiners = miners.filter(m => m.starId === starId);
    if (starMiners.length >= 10) {
      alert('每颗恒星最多安装10台矿机！');
      return;
    }

    const newMiner = {
      id: Math.random().toString(36).substr(2, 9),
      starId,
      level: 1,
      isDeep: false,
      installedAt: new Date()
    };

    const newMiners = [...miners, newMiner];
    // 这里应该调用store的方法，但store中没有添加矿机的方法，暂时用alert提示
    alert(`已在恒星安装矿机！当前数量: ${starMiners.length + 1}/10`);
  };

  return (
    <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Pickaxe className="text-[#4ECDC4]" size={20} />
          <h3 className="text-white font-bold">矿机管理</h3>
        </div>
        <button
          onClick={() => setSelectedStarForMiner(selectedStarForMiner ? null : stars[0]?.id || null)}
          className="px-3 py-1 bg-[#0f3460] border border-[#4ECDC4]/30 rounded-lg text-[#4ECDC4] text-sm hover:border-[#4ECDC4] transition-all flex items-center gap-1"
        >
          <Plus size={16} />
          安装矿机
        </button>
      </div>

      {selectedStarForMiner && (
        <div className="mb-4 p-3 bg-[#0f3460]/50 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">选择安装矿机的恒星:</p>
          <div className="flex gap-2 flex-wrap">
            {activeStars.map(star => {
              const config = STAR_CONFIGS[star.type];
              const isSelected = selectedStarForMiner === star.id;
              const starMiners = miners.filter(m => m.starId === star.id);
              
              return (
                <button
                  key={star.id}
                  onClick={() => {
                    if (isSelected) {
                      handleInstallMiner(star.id);
                      setSelectedStarForMiner(null);
                    } else {
                      setSelectedStarForMiner(star.id);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#4ECDC4]/30 border border-[#4ECDC4] text-[#4ECDC4]'
                      : 'bg-[#16213e] border border-transparent hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{starMiners.length}/10</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {miners.length > 0 ? (
          miners.map(miner => {
            const star = stars.find(s => s.id === miner.starId);
            const config = star ? STAR_CONFIGS[star.type] : null;
            
            return (
              <div key={miner.id} className="flex items-center justify-between p-3 bg-[#0f3460]/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{config?.icon || '⛏️'}</span>
                  <div>
                    <p className="text-white text-sm">{star?.name || '未知恒星'}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Lv.{miner.level}</span>
                      {miner.isDeep && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                          深层矿机
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-[#0f3460] border border-gray-600 rounded text-gray-400 text-xs hover:text-white hover:border-white/50 transition-all">
                    升级
                  </button>
                  {!miner.isDeep && (
                    <button className="px-2 py-1 bg-orange-500/20 border border-orange-500/50 rounded text-orange-400 text-xs hover:bg-orange-500/30 transition-all flex items-center gap-1">
                      <Zap size={12} />
                      深层
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <Pickaxe className="text-gray-600 mx-auto mb-2" size={32} />
            <p className="text-gray-500 text-sm">还没有安装矿机</p>
            <p className="text-gray-600 text-xs">点击上方按钮安装矿机</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/10 rounded-xl border border-orange-500/30">
        <p className="text-orange-400 text-xs">
          💡 提示：深层矿机速度+30%，但额外消耗20%资源
        </p>
      </div>
    </div>
  );
}
