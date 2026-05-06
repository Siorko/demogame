import { Trophy, Star, Rocket, Cpu, Gem, Zap, Crown, Target } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const achievements = [
  { id: 'firstStar', name: '星际先驱', description: '发现第一颗恒星', icon: Star, unlocked: true, reward: '100星币' },
  { id: 'tenStars', name: '星际领主', description: '发现10颗恒星', icon: Crown, unlocked: false, reward: '1000星币' },
  { id: 't5AI', name: '顶级矿工', description: '拥有T5级AI', icon: Cpu, unlocked: false, reward: '500星币' },
  { id: 'lv5Ship', name: '宇宙旗舰', description: '拥有5级飞船', icon: Rocket, unlocked: false, reward: '2000星币' },
  { id: 'millionaire', name: '星际富豪', description: '累计获得100万资源', icon: Gem, unlocked: false, reward: '5000星币' },
  { id: 'arenaWinner', name: '竞技场霸主', description: '在竞技场获胜10次', icon: Trophy, unlocked: false, reward: '3000星币' },
  { id: 'dysonSphere', name: '戴森球建造者', description: '建造戴森球', icon: Zap, unlocked: false, reward: '永久加成' },
  { id: 'techMaster', name: '科技大师', description: '解锁所有科技', icon: Target, unlocked: false, reward: '10000星币' },
];

export default function Achievements() {
  const { stars, ais, ships, techTree } = useGameStore();
  
  const checkUnlocked = (achievementId: string) => {
    switch (achievementId) {
      case 'firstStar':
        return stars.length >= 1;
      case 'tenStars':
        return stars.length >= 10;
      case 't5AI':
        return ais.some(ai => ai.tier >= 5);
      case 'lv5Ship':
        return ships.some(ship => ship.level >= 5);
      case 'millionaire':
        return true;
      case 'arenaWinner':
        return true;
      case 'dysonSphere':
        return false;
      case 'techMaster':
        return techTree.every(t => t.unlocked);
      default:
        return false;
    }
  };

  return (
    <div className="bg-[#16213e]/50 rounded-xl p-4 border border-[#0f3460]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400" size={20} />
        <h3 className="text-white font-bold">成就系统</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map(achievement => {
          const unlocked = checkUnlocked(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-xl border transition-all ${
                unlocked 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' 
                  : 'bg-[#0f3460]/50 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  unlocked ? 'bg-yellow-500/30' : 'bg-gray-700/50'
                }`}>
                  <achievement.icon size={16} className={unlocked ? 'text-yellow-400' : 'text-gray-500'} />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  {unlocked && (
                    <p className="text-green-400 text-xs">已解锁</p>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-xs">{achievement.description}</p>
              {unlocked && (
                <p className="text-green-400 text-xs mt-1">奖励: {achievement.reward}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
