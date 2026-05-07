import { Trophy, Star, Rocket, Cpu, Gem, Zap, Crown, Target, Gift } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const achievementIcons: Record<string, any> = {
  firstStar: Star,
  tenStars: Crown,
  t5AI: Cpu,
  lv5Ship: Rocket,
  millionaire: Gem,
  arenaWinner: Trophy,
  dysonSphere: Zap,
  techMaster: Target,
};

export default function Achievements() {
  const { achievements: storeAchievements, claimAchievement } = useGameStore();

  return (
    <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400" size={20} />
        <h3 className="text-white font-bold">成就系统</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {storeAchievements.map(achievement => {
          const Icon = achievementIcons[achievement.id] || Star;
          
          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-xl border transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' 
                  : 'bg-[#0f3460]/50 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-500/30' : 'bg-gray-700/50'
                }`}>
                  <Icon size={16} className={achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  {achievement.claimed && (
                    <p className="text-green-400 text-xs">已领取</p>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-2">{achievement.description}</p>
              {achievement.unlocked && !achievement.claimed && (
                <button
                  onClick={() => claimAchievement(achievement.id)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs py-1.5 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-1"
                >
                  <Gift size={12} />
                  领取
                  {achievement.rewardType === 'starcoins' ? ` ${achievement.rewardAmount}星币` : '奖励'}
                </button>
              )}
              {achievement.claimed && (
                <p className="text-green-400 text-xs mt-1">✓ 奖励已领取</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
