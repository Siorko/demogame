import { TrendingUp, Star, Wallet, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { STAR_CONFIGS } from '../types/game';

export default function ExchangePage() {
  const { stars, techTree } = useGameStore();
  
  const exchangeUnlocked = techTree.some(t => t.id === 'starExchange' && t.unlocked);

  const ownedStars = stars.filter(s => s.ownerId === useGameStore.getState().player.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] rounded-xl">
            <TrendingUp className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">恒星交易所</h1>
            <p className="text-gray-400 text-sm">买卖恒星开采权</p>
          </div>
        </div>

        {!exchangeUnlocked ? (
          <div className="bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/10 rounded-2xl p-6 border border-[#EF4444]/30 text-center">
            <AlertTriangle className="text-[#EF4444] mx-auto mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">功能未解锁</h3>
            <p className="text-gray-400 mb-4">需要先解锁"恒星交易所"科技</p>
            <button
              onClick={() => useGameStore.getState().setCurrentPage('tech')}
              className="px-6 py-2 bg-gradient-to-r from-[#FFE66D] to-[#FFD93D] rounded-xl text-black font-medium hover:shadow-lg hover:shadow-[#FFE66D]/30 transition-all"
            >
              前往科技实验室
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#FFE66D]/20 to-[#FFD93D]/10 rounded-2xl p-4 mb-6 border border-[#FFE66D]/30">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="text-[#FFE66D]" size={20} />
                <h2 className="text-white font-bold">交易规则</h2>
              </div>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• 发现权永久绑定，每次交易收取2.5%版税</li>
                <li>• 开采权可自由买卖</li>
                <li>• 委托租赁：将开采权委托给佃户挖矿，按比例分成</li>
                <li>• 买方赌剩余资源能回本</li>
              </ul>
            </div>

            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-[#FFE66D]" size={20} />
              我的恒星
            </h2>

            <div className="space-y-3">
              {ownedStars.map(star => {
                const config = STAR_CONFIGS[star.type];
                const progress = (star.remainingResources / star.totalResources) * 100;
                
                return (
                  <div
                    key={star.id}
                    className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460] hover:border-[#FFE66D]/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                          <h3 className="text-white font-medium">{star.name}</h3>
                          <p className="text-gray-400 text-xs">
                            {config.name} · 发现者: {useGameStore.getState().player.username}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        star.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        star.status === 'depleted' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {star.status === 'active' ? '活跃' : star.status === 'depleted' ? '枯竭' : '休眠'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-[#0f3460] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-400 text-xs">剩余资源</span>
                          <span className="text-white text-xs font-mono">
                            {star.remainingResources.toLocaleString()} / {star.totalResources.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-[#0f3460] border border-[#FFE66D]/30 rounded-xl text-[#FFE66D] font-medium hover:border-[#FFE66D] transition-all">
                        出售开采权
                      </button>
                      <button className="flex-1 px-4 py-2 bg-[#0f3460] border border-gray-600 rounded-xl text-gray-400 font-medium hover:text-white hover:border-white/50 transition-all">
                        委托租赁
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {ownedStars.length === 0 && (
              <div className="text-center py-12">
                <Star className="text-gray-600 mx-auto mb-4" size={64} />
                <p className="text-gray-400">还没有恒星</p>
              </div>
            )}

            <h2 className="text-white font-bold text-lg mt-8 mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#FFE66D]" size={20} />
              市场挂单
            </h2>

            <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
              <div className="text-center py-8">
                <TrendingUp className="text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-400">暂无挂单</p>
                <p className="text-gray-500 text-sm">其他玩家还未上架恒星开采权</p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-[#4ECDC4]/20 to-[#45B7AA]/10 rounded-xl p-4 border border-[#4ECDC4]/30">
              <h3 className="text-white font-medium mb-2">交易提示</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 出售开采权时，请合理定价</li>
                <li>• 作为发现者，每次交易可获得2.5%版税</li>
                <li>• 委托租赁可获得稳定分成收入</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
