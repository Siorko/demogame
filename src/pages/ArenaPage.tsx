import { useState } from 'react';
import { Trophy, Swords, Star, AlertTriangle, Clock, Flame } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';

const stakeOptions = [
  { percentage: 10, label: '10%', color: 'bg-green-500' },
  { percentage: 30, label: '30%', color: 'bg-yellow-500' },
  { percentage: 50, label: '50%', color: 'bg-red-500' },
];

export default function ArenaPage() {
  const { stars, arenaMatches, startArenaMatch, techTree, selectedStar, selectStar } = useGameStore();
  const [selectedStake, setSelectedStake] = useState(10);
  
  const arenaUnlocked = techTree.some(t => t.id === 'arena' && t.unlocked);
  const playableStars = stars.filter(s => s.status === 'active' && s.type !== 'red');

  const handleStartMatch = () => {
    if (!selectedStar) {
      alert('请选择一颗恒星！');
      return;
    }
    startArenaMatch(selectedStar.id, selectedStake);
    selectStar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#FF6B6B] to-[#C04040] rounded-xl">
            <Trophy className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">竞技场</h1>
            <p className="text-gray-400 text-sm">对赌采矿收益</p>
          </div>
        </div>

        {!arenaUnlocked ? (
          <div className="bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/10 rounded-2xl p-6 border border-[#EF4444]/30 text-center">
            <AlertTriangle className="text-[#EF4444] mx-auto mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">功能未解锁</h3>
            <p className="text-gray-400 mb-4">需要先解锁"竞技场"科技</p>
            <button
              onClick={() => useGameStore.getState().setCurrentPage('tech')}
              className="px-6 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#C04040] rounded-xl text-white font-medium hover:shadow-lg hover:shadow-[#FF6B6B]/30 transition-all"
            >
              前往科技实验室
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#FF6B6B]/20 to-[#C04040]/10 rounded-2xl p-4 mb-6 border border-[#FF6B6B]/30">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="text-[#FF6B6B]" size={20} />
                <h2 className="text-white font-bold">规则说明</h2>
              </div>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• 拿出恒星未来采矿收益进行对赌</li>
                <li>• 赢：获得对方未来7天50%收益</li>
                <li>• 输：自身收益减半7天</li>
                <li>• 每天最多3次</li>
                <li>• 系统赠送的红矮星不可对赌</li>
              </ul>
            </div>

            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-[#FFE66D]" size={20} />
              选择恒星
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {playableStars.length > 0 ? (
                playableStars.map(star => {
                  const config = STAR_CONFIGS[star.type];
                  const isSelected = selectedStar?.id === star.id;
                  
                  return (
                    <button
                      key={star.id}
                      onClick={() => selectStar(isSelected ? null : star)}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-br from-[#FF6B6B]/30 to-[#C04040]/20 border-[#FF6B6B]' 
                          : 'bg-[#16213e]/50 border-[#0f3460] hover:border-[#FF6B6B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="text-white font-medium truncate">{star.name.split(' ')[0]}</span>
                      </div>
                      <p className="text-gray-400 text-xs">剩余资源: {star.remainingResources.toLocaleString()}</p>
                      {isSelected && (
                        <span className="mt-2 inline-block px-2 py-0.5 bg-[#FF6B6B]/30 text-[#FF6B6B] rounded-full text-xs">
                          已选择
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <Star className="text-gray-600 mx-auto mb-2" size={48} />
                  <p className="text-gray-400">没有可对赌的恒星</p>
                  <p className="text-gray-500 text-sm">红矮星不可用于对赌</p>
                </div>
              )}
            </div>

            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Swords className="text-[#FF6B6B]" size={20} />
              对赌比例
            </h2>

            <div className="flex gap-3 mb-6">
              {stakeOptions.map(option => (
                <button
                  key={option.percentage}
                  onClick={() => setSelectedStake(option.percentage)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    selectedStake === option.percentage
                      ? `${option.color} text-white shadow-lg`
                      : 'bg-[#16213e] text-gray-400 border border-[#0f3460] hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleStartMatch}
              disabled={!selectedStar || playableStars.length === 0}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#C04040] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF6B6B]/30 hover:shadow-[#FF6B6B]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Swords size={24} />
              <span>开始对赌</span>
            </button>

            {arenaMatches.length > 0 && (
              <>
                <h2 className="text-white font-bold text-lg mt-8 mb-4 flex items-center gap-2">
                  <Clock className="text-gray-400" size={20} />
                  历史记录
                </h2>
                <div className="space-y-2">
                  {arenaMatches.slice().reverse().slice(0, 5).map(match => (
                    <div
                      key={match.id}
                      className={`bg-[#16213e]/50 rounded-xl p-3 border ${
                        match.result === 'player1' 
                          ? 'border-green-500/30' 
                          : 'border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">对赌 {match.stakePercentage}%</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(match.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          match.result === 'player1' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {match.result === 'player1' ? '胜利' : '失败'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
