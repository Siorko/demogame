import { useState } from 'react';
import { Store, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const resourceInfo = [
  { key: 'iron', name: '铁矿', icon: '⛏️', color: '#94A3B8' },
  { key: 'titanium', name: '钛合金', icon: '🔩', color: '#CBD5E1' },
  { key: 'crystal', name: '能量晶体', icon: '💎', color: '#60A5FA' },
  { key: 'rareOre', name: '稀有矿石', icon: '💠', color: '#A78BFA' },
  { key: 'nano', name: '纳米材料', icon: '⚛️', color: '#F472B6' },
  { key: 'darkMatter', name: '暗物质', icon: '🔮', color: '#7C3AED' },
  { key: 'antiMatter', name: '反物质', icon: '⚡', color: '#F59E0B' },
  { key: 'exoticMatter', name: '奇异物质', icon: '🌀', color: '#EC4899' },
];

export default function MarketPage() {
  const { resources, prices, sellResource } = useGameStore();
  const [sellAmounts, setSellAmounts] = useState<Record<string, number>>({});

  const handleSell = (resourceKey: string) => {
    const amount = sellAmounts[resourceKey] || 0;
    if (amount > 0) {
      sellResource(resourceKey as keyof typeof resources, amount);
      setSellAmounts(prev => ({ ...prev, [resourceKey]: 0 }));
    }
  };

  const handleMaxSell = (resourceKey: string) => {
    setSellAmounts(prev => ({ ...prev, [resourceKey]: Math.floor(resources[resourceKey as keyof typeof resources]) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] pb-32">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] rounded-xl">
            <Store className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">售货区</h1>
            <p className="text-gray-400 text-sm">出售矿石获取星币</p>
          </div>
        </div>

        <div className="bg-[#16213e]/50 rounded-2xl p-4 mb-6 border border-[#0f3460]">
          <h2 className="text-white font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="text-green-400" size={18} />
            当前价格
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {resourceInfo.map(resource => (
              <div key={resource.key} className="bg-[#0f3460]/50 rounded-xl p-2 text-center">
                <span className="text-2xl">{resource.icon}</span>
                <p className="text-gray-400 text-xs mt-1">{resource.name}</p>
                <p className="text-white text-sm font-mono">
                  {prices[resource.key as keyof typeof prices]}星币
                </p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-white font-bold text-lg mb-4">我的资源</h2>
        
        <div className="space-y-3">
          {resourceInfo.map(resource => {
            const amount = resources[resource.key as keyof typeof resources];
            const sellAmount = sellAmounts[resource.key] || 0;
            const totalValue = Math.floor(amount * prices[resource.key as keyof typeof prices]);
            
            return (
              <div
                key={resource.key}
                className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460] hover:border-[#4ECDC4]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{resource.name}</h3>
                      <p className="text-gray-400 text-xs">库存: {Math.floor(amount).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">{totalValue.toLocaleString()} 星币</p>
                    <p className="text-gray-400 text-xs">单价: {prices[resource.key as keyof typeof prices]}</p>
                  </div>
                </div>
                
                {amount > 0 && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={Math.floor(amount)}
                      value={sellAmount}
                      onChange={(e) => setSellAmounts(prev => ({ ...prev, [resource.key]: Math.min(Math.floor(amount), parseInt(e.target.value) || 0) }))}
                      className="flex-1 bg-[#0f3460] border border-[#4ECDC4]/30 rounded-xl px-4 py-2 text-white text-center font-mono focus:outline-none focus:border-[#4ECDC4]"
                      placeholder="数量"
                    />
                    <button
                      onClick={() => handleMaxSell(resource.key)}
                      className="px-3 py-2 bg-[#0f3460] border border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-white/50 transition-all text-sm"
                    >
                      最大
                    </button>
                    <button
                      onClick={() => handleSell(resource.key)}
                      disabled={sellAmount <= 0}
                      className="px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4ECDC4]/30 transition-all"
                    >
                      出售
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFE66D]/20 rounded-xl p-4 border border-[#FF6B6B]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6B6B]/30 rounded-lg">
              <TrendingDown className="text-[#FF6B6B]" size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium">价格波动提醒</h3>
              <p className="text-gray-400 text-sm">市场价格每小时波动一次，把握最佳出售时机！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
