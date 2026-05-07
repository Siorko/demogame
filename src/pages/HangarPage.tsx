import { useState } from 'react';
import { Plane, Cpu, Plus, ArrowRight, Star, Shield, Battery, Cpu as ChipIcon, Compass, Zap, Pickaxe, AlertCircle, TrendingUp } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';
import type { AI, Star as StarType } from '../types/game';
import MinerPanel from '../components/MinerPanel';

const professionNames: Record<string, string> = {
  mining: '挖矿型',
  exploring: '探索型',
  combat: '战斗型',
  allround: '全能型'
};

const professionColors: Record<string, string> = {
  mining: 'bg-green-500/20 text-green-400',
  exploring: 'bg-blue-500/20 text-blue-400',
  combat: 'bg-red-500/20 text-red-400',
  allround: 'bg-purple-500/20 text-purple-400'
};

const equipmentTypes = [
  { type: 'drill', name: '钻头', icon: Pickaxe, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { type: 'scanner', name: '扫描仪', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { type: 'shield', name: '护盾', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20' },
  { type: 'battery', name: '电池', icon: Battery, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { type: 'chip', name: '芯片', icon: ChipIcon, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { type: 'navigator', name: '导航仪', icon: Compass, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
];

export default function HangarPage() {
  const { ais, ships, stars, assignAI, buyShip, selectedStar, selectStar, aiUpgradeFailStreak, upgradeAIWithGuarantee, addAIEquipment } = useGameStore();
  const [selectedAI, setSelectedAI] = useState<AI | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'ai' | 'ship' | 'miner'>('ai');

  const handleAIUpgrade = (ai: AI) => {
    if (ai.tier >= 6) return;
    upgradeAIWithGuarantee(ai.id);
  };

  const handleAssignAI = () => {
    if (selectedAI && selectedStar) {
      assignAI(selectedAI.id, selectedStar.id);
      setShowAssignModal(false);
      setSelectedAI(null);
      selectStar(null);
    }
  };

  const getGuaranteeInfo = () => {
    const remaining = 5 - aiUpgradeFailStreak;
    if (remaining <= 0) {
      return { text: '下次必成！', color: 'text-yellow-400' };
    }
    return { text: `连败 ${aiUpgradeFailStreak}/5`, color: aiUpgradeFailStreak > 0 ? 'text-orange-400' : 'text-gray-400' };
  };

  const guaranteeInfo = getGuaranteeInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] rounded-xl">
            <Plane className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">机库</h1>
            <p className="text-gray-400 text-sm">管理AI、飞船和矿机</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-[#16213e]/50 p-1 rounded-xl">
          <button
            onClick={() => setSelectedTab('ai')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'ai'
                ? 'bg-[#FF6B6B]/30 text-[#FF6B6B]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu size={16} />
            AI矿工
          </button>
          <button
            onClick={() => setSelectedTab('ship')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'ship'
                ? 'bg-[#FFE66D]/30 text-[#FFE66D]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plane size={16} />
            飞船
          </button>
          <button
            onClick={() => setSelectedTab('miner')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'miner'
                ? 'bg-[#4ECDC4]/30 text-[#4ECDC4]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Pickaxe size={16} />
            矿机
          </button>
        </div>

        {selectedTab === 'ai' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Cpu className="text-[#FF6B6B]" size={20} />
                AI矿工 ({ais.length})
              </h2>
              <div className="flex items-center gap-2">
                <AlertCircle className={guaranteeInfo.color} size={16} />
                <span className={`text-xs font-medium ${guaranteeInfo.color}`}>{guaranteeInfo.text}</span>
              </div>
            </div>

            <div className="space-y-3">
              {ais.map(ai => {
                const assignedStar = ai.currentStarId ? stars.find(s => s.id === ai.currentStarId) : null;
                
                return (
                  <div
                    key={ai.id}
                    className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460] hover:border-[#FF6B6B]/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#C04040] rounded-xl flex items-center justify-center">
                          <Cpu className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium">{ai.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${professionColors[ai.profession]}`}>
                              {professionNames[ai.profession]}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs">等级 T{ai.tier} · 速度倍率 x{ai.tier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {assignedStar ? (
                          <div className="flex items-center gap-1 text-green-400">
                            <Star size={14} />
                            <span className="text-xs">{assignedStar.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">空闲</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      {equipmentTypes.map(eq => {
                        const hasEquip = ai.equipment.find(e => e.type === eq.type);
                        return (
                          <button
                            key={eq.type}
                            onClick={() => addAIEquipment(ai.id, eq.type)}
                            className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${hasEquip ? eq.bg : 'bg-[#0f3460]'} ${hasEquip ? eq.color : 'text-gray-600'} hover:opacity-80 transition-all`}
                            title={hasEquip ? `${eq.name} Lv.${hasEquip.level} (点击升级)` : `${eq.name} (点击装备)`}
                          >
                            <eq.icon size={16} />
                            {hasEquip && <span className="text-[10px]">Lv.{hasEquip.level}</span>}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAI(ai);
                          setShowAssignModal(true);
                        }}
                        disabled={!!ai.currentStarId}
                        className="flex-1 px-4 py-2 bg-[#0f3460] border border-[#4ECDC4]/30 rounded-xl text-[#4ECDC4] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#4ECDC4] transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowRight size={16} />
                        <span>派遣</span>
                      </button>
                      <button
                        onClick={() => handleAIUpgrade(ai)}
                        disabled={ai.tier >= 6}
                        className="px-4 py-2 bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#9B59B6]/30 transition-all flex items-center gap-2"
                      >
                        <TrendingUp size={16} />
                        <span>升级 ({ai.tier * 1000}星币)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {showAssignModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-[#16213e] rounded-2xl p-6 w-full max-w-md border border-[#4ECDC4]/30">
                  <h3 className="text-white font-bold text-lg mb-4">选择恒星派遣</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stars.filter(s => s.status === 'active').map(star => {
                      const config = STAR_CONFIGS[star.type];
                      const isSelected = selectedStar?.id === star.id;
                      
                      return (
                        <button
                          key={star.id}
                          onClick={() => selectStar(isSelected ? null : star)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            isSelected 
                              ? 'bg-[#4ECDC4]/20 border border-[#4ECDC4]' 
                              : 'bg-[#0f3460]/50 border border-transparent hover:border-[#4ECDC4]/30'
                          }`}
                        >
                          <span className="text-2xl">{config.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{star.name}</p>
                            <p className="text-gray-400 text-xs">剩余资源: {star.remainingResources.toLocaleString()}</p>
                          </div>
                          {isSelected && (
                            <span className="text-[#4ECDC4]">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setSelectedAI(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#0f3460] border border-gray-600 rounded-xl text-gray-400 font-medium hover:text-white hover:border-white/50 transition-all"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAssignAI}
                      disabled={!selectedStar}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4ECDC4]/30 transition-all"
                    >
                      派遣
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {selectedTab === 'ship' && (
          <div className="bg-gradient-to-br from-[#FFE66D]/20 to-[#FFD93D]/10 rounded-2xl p-4 border border-[#FFE66D]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h3 className="text-white font-medium">飞船舰队</h3>
                  <p className="text-gray-400 text-sm">{ships.length} 艘飞船 · {ships.reduce((sum, s) => sum + s.aiSlots, 0)} 个AI槽位</p>
                </div>
              </div>
              <button
                onClick={buyShip}
                className="px-4 py-2 bg-gradient-to-r from-[#FFE66D] to-[#FFD93D] rounded-xl text-black font-medium hover:shadow-lg hover:shadow-[#FFE66D]/30 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                <span>购买飞船 ({(ships.length + 1) * 1000}星币)</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {ships.map(ship => (
                <div
                  key={ship.id}
                  className="bg-[#16213e]/80 rounded-xl p-4 border border-[#FFE66D]/30"
                >
                  <div className="text-center">
                    <span className="text-4xl">🛸</span>
                    <h4 className="text-white text-sm font-medium mt-2 truncate">{ship.name}</h4>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-[#FFE66D]/20 text-[#FFE66D] rounded-full text-xs font-bold">
                        Lv.{ship.level}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {ship.aiSlots}槽位
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">速度倍率 x{ship.level}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-xl border border-blue-500/30">
              <p className="text-blue-400 text-xs">
                💡 提示：高级飞船航程更远，探索范围更广
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'miner' && (
          <MinerPanel />
        )}
      </div>
    </div>
  );
}
