import { Compass, Rocket, Clock, Zap, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const exploreResults = [
  { id: 'star', name: '新恒星', probability: 30, icon: '⭐', color: '#FFE66D', description: '发现一颗全新的恒星' },
  { id: 'abandoned', name: '废弃恒星', probability: 25, icon: '🪨', color: '#6B7280', description: '资源已枯竭的废弃恒星' },
  { id: 'meteor', name: '陨石群', probability: 20, icon: '☄️', color: '#9CA3AF', description: '危险的陨石群区域' },
  { id: 'ruins', name: '古代遗迹', probability: 15, icon: '🏛️', color: '#A78BFA', description: '失落文明的遗迹' },
  { id: 'pirates', name: '宇宙海盗', probability: 10, icon: '👾', color: '#EF4444', description: '遭遇海盗袭击' },
];

export default function ExplorePage() {
  const { exploring, explorationProgress, startExploration, techTree } = useGameStore();
  
  const explorationUnlocked = techTree.some(t => t.id === 'exploration' && t.unlocked);
  const starScanUnlocked = techTree.some(t => t.id === 'starScan' && t.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] rounded-xl">
            <Compass className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">探索中心</h1>
            <p className="text-gray-400 text-sm">派遣飞船探索未知星域</p>
          </div>
        </div>

        {!explorationUnlocked ? (
          <div className="bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/10 rounded-2xl p-6 border border-[#EF4444]/30 text-center">
            <AlertTriangle className="text-[#EF4444] mx-auto mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">功能未解锁</h3>
            <p className="text-gray-400 mb-4">需要先解锁"探索技术"科技</p>
            <button
              onClick={() => useGameStore.getState().setCurrentPage('tech')}
              className="px-6 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-xl text-white font-medium hover:shadow-lg hover:shadow-[#A78BFA]/30 transition-all"
            >
              前往科技实验室
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#A78BFA]/20 to-[#8B5CF6]/10 rounded-2xl p-6 mb-6 border border-[#A78BFA]/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg mb-1">探索任务</h2>
                  <p className="text-gray-400 text-sm">派遣飞船探索宇宙深处</p>
                </div>
                {starScanUnlocked && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    扫描强化
                  </span>
                )}
              </div>

              {exploring ? (
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-[#A78BFA]/30" />
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-[#A78BFA]"
                      style={{ clipPath: `polygon(0 0, ${explorationProgress}% 0, ${explorationProgress}% 100%, 0 100%)` }}
                    />
                    <div className="absolute inset-2 rounded-full bg-[#16213e] flex items-center justify-center">
                      <Rocket className="text-[#A78BFA] animate-pulse" size={48} />
                    </div>
                  </div>
                  <div className="w-full bg-[#0f3460] rounded-full h-3 mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-full transition-all duration-300"
                      style={{ width: `${explorationProgress}%` }}
                    />
                  </div>
                  <p className="text-white font-medium">{explorationProgress}%</p>
                  <p className="text-gray-400 text-sm mt-2">飞船正在探索中...</p>
                </div>
              ) : (
                <button
                  onClick={startExploration}
                  className="w-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#A78BFA]/30 hover:shadow-[#A78BFA]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Rocket size={24} />
                  <span>开始探索 (消耗反物质燃料)</span>
                  <Zap size={20} className="text-yellow-300" />
                </button>
              )}
            </div>

            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              探索概率
            </h2>

            <div className="space-y-3">
              {exploreResults.map(result => (
                <div
                  key={result.id}
                  className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460] hover:border-[#A78BFA]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{result.icon}</span>
                      <div>
                        <h3 className="text-white font-medium">{result.name}</h3>
                        <p className="text-gray-400 text-xs">{result.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 bg-[#0f3460] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${result.probability}%`,
                            background: result.color
                          }}
                        />
                      </div>
                      <p className="text-white text-xs font-mono mt-1">{result.probability}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-[#4ECDC4]/20 to-[#45B7AA]/10 rounded-xl p-4 border border-[#4ECDC4]/30">
              <h3 className="text-white font-medium mb-2">探索提示</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 探索需要消耗反物质燃料</li>
                <li>• 探索时间随机，通常需要1-24小时</li>
                <li>• AI探索属性越高，发现稀有恒星概率越大</li>
                <li>• 飞船航程越远，探索范围越广</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
