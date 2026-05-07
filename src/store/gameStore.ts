import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Star, AI, Spaceship, Miner, Trade, ArenaMatch, PlayerResources, ResourcePrice, TechNode, STAR_CONFIGS, TECH_TREE, AI_NAMES, SHIP_NAMES, RESOURCE_PRICE_CONFIGS, Achievement, ACHIEVEMENTS } from '../types/game';

interface GameState {
  player: Player;
  stars: Star[];
  ais: AI[];
  ships: Spaceship[];
  miners: Miner[];
  trades: Trade[];
  arenaMatches: ArenaMatch[];
  resources: PlayerResources;
  prices: ResourcePrice;
  techTree: TechNode[];
  currentPage: string;
  selectedStar: Star | null;
  exploring: boolean;
  explorationProgress: number;
  lastCollectTime: number;
  lastSaveTime: number;
  lastOnlineTime: number;
  lastPriceUpdateTime: number;
  priceHistory: Record<string, { time: number; price: number }[]>;
  aiUpgradeFailStreak: number;
  dysonSphereBuilt: boolean;
  dysonSphereProgress: number;
  achievements: Achievement[];
  totalResourcesEarned: number;
  
  initializeGame: () => void;
  setCurrentPage: (page: string) => void;
  selectStar: (star: Star | null) => void;
  collectResources: () => void;
  sellResource: (resource: keyof PlayerResources, amount: number) => void;
  assignAI: (aiId: string, starId: string) => void;
  startExploration: () => void;
  completeExploration: () => void;
  unlockTech: (techId: string) => void;
  buyShip: () => void;
  upgradeAI: (aiId: string) => void;
  upgradeAIWithGuarantee: (aiId: string) => void;
  startArenaMatch: (starId: string, stakePercentage: number) => void;
  addMiner: (starId: string) => void;
  upgradeMiner: (minerId: string) => void;
  toggleDeepMiner: (minerId: string) => void;
  addAIEquipment: (aiId: string, equipmentType: string) => void;
  buildDysonSphere: () => void;
  contributeToDysonSphere: (resourceType: keyof PlayerResources, amount: number) => void;
  calculateHourlyRate: () => number;
  tick: () => void;
  saveGame: () => void;
  loadOfflineProgress: () => void;
  checkAchievements: () => void;
  claimAchievement: (achievementId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createInitialPlayer = (): Player => ({
  id: generateId(),
  username: '星际矿业主',
  starcoins: 500,
  createdAt: Date.now(),
  lastOnline: Date.now(),
  mooncardExpires: null,
  techLevel: 1,
  techResetCount: 0
});

const createInitialStar = (playerId: string): Star => {
  const now = Date.now();
  return {
    id: generateId(),
    type: 'red',
    name: '红矮星 #0001',
    discovererId: playerId,
    ownerId: playerId,
    totalResources: 100000,
    remainingResources: 100000,
    status: 'active',
    activeUntil: now + 30 * 24 * 60 * 60 * 1000,
    dormantUntil: now + 45 * 24 * 60 * 60 * 1000,
    maintenanceFee: 50,
    createdAt: now
  };
};

const createInitialAI = (playerId: string): AI => ({
  id: generateId(),
  playerId,
  name: AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)],
  tier: 1,
  profession: 'mining',
  equipment: [],
  currentStarId: null,
  createdAt: Date.now()
});

const createInitialShip = (playerId: string): Spaceship => ({
  id: generateId(),
  playerId,
  name: SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)],
  level: 1,
  aiSlots: 1,
  currentMission: null,
  createdAt: Date.now()
});

const createInitialResources = (): PlayerResources => ({
  iron: 0,
  titanium: 0,
  crystal: 0,
  rareOre: 0,
  nano: 0,
  darkMatter: 0,
  antiMatter: 0,
  exoticMatter: 0
});

const createInitialPrices = (): ResourcePrice => ({
  iron: 1,
  titanium: 5,
  crystal: 15,
  rareOre: 50,
  nano: 200,
  darkMatter: 1000,
  antiMatter: 5000,
  exoticMatter: 20000
});

const createInitialPriceHistory = (): Record<string, { time: number; price: number }[]> => ({
  iron: [],
  titanium: [],
  crystal: [],
  rareOre: [],
  nano: [],
  darkMatter: [],
  antiMatter: [],
  exoticMatter: []
});

const updatePrices = (currentPrices: ResourcePrice, now: number): ResourcePrice => {
  const newPrices: ResourcePrice = { ...currentPrices };
  
  Object.keys(RESOURCE_PRICE_CONFIGS).forEach(resource => {
    const config = RESOURCE_PRICE_CONFIGS[resource];
    const currentPrice = currentPrices[resource as keyof ResourcePrice];
    
    const change = (Math.random() - 0.5) * 2 * config.volatility * currentPrice;
    let newPrice = currentPrice + change;
    
    const minPrice = config.basePrice * config.minMultiplier;
    const maxPrice = config.basePrice * config.maxMultiplier;
    
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
    newPrices[resource as keyof ResourcePrice] = Math.floor(newPrice * 100) / 100;
  });
  
  return newPrices;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: createInitialPlayer(),
      stars: [],
      ais: [],
      ships: [],
      miners: [],
      trades: [],
      arenaMatches: [],
      resources: createInitialResources(),
      prices: createInitialPrices(),
      techTree: [...TECH_TREE],
      currentPage: 'home',
      selectedStar: null,
      exploring: false,
      explorationProgress: 0,
      lastCollectTime: Date.now(),
      lastSaveTime: Date.now(),
      lastOnlineTime: Date.now(),
      lastPriceUpdateTime: Date.now(),
      priceHistory: createInitialPriceHistory(),
      aiUpgradeFailStreak: 0,
      dysonSphereBuilt: false,
      dysonSphereProgress: 0,
      achievements: [...ACHIEVEMENTS],
      totalResourcesEarned: 0,

      initializeGame: () => {
        const state = get();
        
        const fullyUnlockedTechTree = TECH_TREE.map(tech => ({
          ...tech,
          unlocked: true
        }));
        
        if (state.stars.length > 0) {
          get().loadOfflineProgress();
          set({ techTree: fullyUnlockedTechTree });
          get().checkAchievements();
          return;
        }
        
        const player = createInitialPlayer();
        const star = createInitialStar(player.id);
        const ai = createInitialAI(player.id);
        const ship = createInitialShip(player.id);
        
        set({
          player,
          stars: [star],
          ais: [ai],
          ships: [ship],
          miners: [],
          trades: [],
          arenaMatches: [],
          resources: createInitialResources(),
          prices: createInitialPrices(),
          techTree: fullyUnlockedTechTree,
          lastCollectTime: Date.now(),
          lastSaveTime: Date.now(),
          lastOnlineTime: Date.now(),
          achievements: [...ACHIEVEMENTS],
          totalResourcesEarned: 0
        });
      },

      setCurrentPage: (page) => set({ currentPage: page }),

      selectStar: (star) => set({ selectedStar: star }),

      calculateHourlyRate: () => {
        const { stars, ais, ships, techTree, miners, dysonSphereBuilt } = get();
        const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
        const dysonMultiplier = dysonSphereBuilt ? 2 : 1;
        
        let totalRate = 0;
        
        stars.forEach(star => {
          if (star.status !== 'active' || star.remainingResources <= 0) return;
          
          const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
          if (assignedAIs.length === 0) return;
          
          const starMiners = miners.filter(m => m.starId === star.id);
          const deepMiners = starMiners.filter(m => m.isDeep).length;
          
          const aiTierSum = assignedAIs.reduce((sum, ai) => {
            let tier = ai.tier;
            ai.equipment.forEach(eq => {
              if (eq.type === 'drill') tier += eq.level * 0.5;
              if (eq.type === 'chip') tier += eq.level * 0.3;
            });
            return sum + tier;
          }, 0);
          
          const shipBonus = ships.reduce((sum, ship) => sum + ship.level * 0.5, 0);
          const minerBonus = deepMiners * 0.4;
          
          let baseRate = aiTierSum * shipBonus * (1 + minerBonus);
          baseRate *= techMultiplier;
          baseRate *= dysonMultiplier;
          baseRate *= dysonMultiplier;
          
          let dailyRate = Math.floor(baseRate * 100);
          
          if (deepMiners > 0) {
            dailyRate *= (1 + deepMiners * 0.3);
          }
          
          totalRate += dailyRate;
        });
        
        return totalRate;
      },

      collectResources: () => {
        const { stars, ais, ships, resources, player, techTree, miners, lastCollectTime, dysonSphereBuilt } = get();
        const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
        const dysonMultiplier = dysonSphereBuilt ? 2 : 1;
        
        const now = Date.now();
        const timeDiff = now - lastCollectTime;
        const secondsSinceLastCollect = Math.min(timeDiff / 1000, 72 * 60 * 60);
        const collectMultiplier = secondsSinceLastCollect / (24 * 60 * 60);
        
        let newResources = { ...resources };
        
        stars.forEach(star => {
          if (star.status !== 'active' || star.remainingResources <= 0) return;
          
          const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
          if (assignedAIs.length === 0) return;
          
          const starMiners = miners.filter(m => m.starId === star.id);
          const deepMiners = starMiners.filter(m => m.isDeep).length;
          
          const aiTierSum = assignedAIs.reduce((sum, ai) => {
            let tier = ai.tier;
            ai.equipment.forEach(eq => {
              if (eq.type === 'drill') tier += eq.level * 0.5;
              if (eq.type === 'chip') tier += eq.level * 0.3;
            });
            return sum + tier;
          }, 0);
          
          const shipBonus = ships.reduce((sum, ship) => sum + ship.level * 0.5, 0);
          const minerBonus = deepMiners * 0.4;
          
          let baseRate = aiTierSum * shipBonus * (1 + minerBonus);
          baseRate *= techMultiplier;
          baseRate *= dysonMultiplier;
          
          const config = STAR_CONFIGS[star.type];
          let dailyRate = Math.floor(baseRate * 100);
          
          if (deepMiners > 0) {
            dailyRate *= (1 + deepMiners * 0.3);
          }
          
          const amountToMine = Math.min(Math.floor(dailyRate * collectMultiplier), star.remainingResources);
          
          const resourceAmount = amountToMine / config.resources.length;
          config.resources.forEach(resource => {
            newResources[resource as keyof PlayerResources] += resourceAmount;
          });
          
          const newRemaining = star.remainingResources - amountToMine;
          star.remainingResources = Math.max(0, newRemaining);
          
          if (star.remainingResources <= 0) {
            star.status = 'depleted';
          }
        });
        
        const activeStars = stars.filter(s => s.status === 'active');
        const maintenanceCost = activeStars.reduce((sum, s) => sum + s.maintenanceFee * collectMultiplier, 0);
        const ironEarnings = Math.floor(newResources.iron * 0.1);
        const newStarcoins = player.starcoins - maintenanceCost + ironEarnings;
        
        set({ 
          resources: newResources, 
          stars: [...stars],
          player: { ...player, starcoins: Math.max(0, newStarcoins) },
          lastCollectTime: now
        });
      },

      tick: () => {
        const { stars, ais, ships, resources, player, techTree, miners, lastCollectTime, lastSaveTime, lastPriceUpdateTime, prices, priceHistory, dysonSphereBuilt } = get();
        const now = Date.now();
        
        const tickSeconds = 1;
        const collectMultiplier = tickSeconds / (24 * 60 * 60);
        const dysonMultiplier = dysonSphereBuilt ? 2 : 1;
        
        let newResources = { ...resources };
        let changed = false;
        
        if (now - lastPriceUpdateTime > 30 * 1000) {
          const newPrices = updatePrices(prices, now);
          
          const newPriceHistory = { ...priceHistory };
          Object.keys(newPrices).forEach(resource => {
            if (!newPriceHistory[resource]) newPriceHistory[resource] = [];
            newPriceHistory[resource].push({
              time: now,
              price: newPrices[resource as keyof ResourcePrice]
            });
            if (newPriceHistory[resource].length > 50) {
              newPriceHistory[resource] = newPriceHistory[resource].slice(-50);
            }
          });
          
          set({ 
            prices: newPrices, 
            lastPriceUpdateTime: now, 
            priceHistory: newPriceHistory 
          });
        }
        
        const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
        
        stars.forEach(star => {
          if (star.status !== 'active' || star.remainingResources <= 0) return;
          
          const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
          if (assignedAIs.length === 0) return;
          
          const starMiners = miners.filter(m => m.starId === star.id);
          const deepMiners = starMiners.filter(m => m.isDeep).length;
          
          const aiTierSum = assignedAIs.reduce((sum, ai) => {
            let tier = ai.tier;
            ai.equipment.forEach(eq => {
              if (eq.type === 'drill') tier += eq.level * 0.5;
              if (eq.type === 'chip') tier += eq.level * 0.3;
            });
            return sum + tier;
          }, 0);
          
          const shipBonus = ships.reduce((sum, ship) => sum + ship.level * 0.5, 0);
          const minerBonus = deepMiners * 0.4;
          
          let baseRate = aiTierSum * shipBonus * (1 + minerBonus);
          baseRate *= techMultiplier;
          baseRate *= dysonMultiplier;
          
          const config = STAR_CONFIGS[star.type];
          let dailyRate = Math.floor(baseRate * 100);
          
          if (deepMiners > 0) {
            dailyRate *= (1 + deepMiners * 0.3);
          }
          
          const amountToMine = Math.min(Math.floor(dailyRate * collectMultiplier), star.remainingResources);
          
          if (amountToMine > 0) {
            changed = true;
            const resourceAmount = amountToMine / config.resources.length;
            config.resources.forEach(resource => {
              newResources[resource as keyof PlayerResources] += resourceAmount;
            });
            
            const newRemaining = star.remainingResources - amountToMine;
            star.remainingResources = Math.max(0, newRemaining);
            
            if (star.remainingResources <= 0) {
              star.status = 'depleted';
              star.dormantUntil = now + STAR_CONFIGS[star.type].dormantDays * 24 * 60 * 60 * 1000;
            }
            
            if (star.status === 'depleted' && now > star.dormantUntil) {
              star.status = 'active';
              star.remainingResources = star.totalResources;
              star.activeUntil = now + STAR_CONFIGS[star.type].activeDays * 24 * 60 * 60 * 1000;
              star.dormantUntil = now + (STAR_CONFIGS[star.type].activeDays + STAR_CONFIGS[star.type].dormantDays) * 24 * 60 * 60 * 1000;
            }
          }
        });
        
        if (now - lastSaveTime > 3 * 60 * 1000) {
          get().saveGame();
          set({ lastSaveTime: now });
        }
        
        if (changed) {
          const ironEarnings = Math.floor(newResources.iron * 0.1);
          const activeStars = stars.filter(s => s.status === 'active');
          const maintenanceCost = activeStars.reduce((sum, s) => sum + s.maintenanceFee * collectMultiplier, 0);
          const newStarcoins = player.starcoins - maintenanceCost + ironEarnings;
          
          const resourceDelta = Object.values(newResources).reduce((sum, val) => sum + val, 0) - 
                               Object.values(resources).reduce((sum, val) => sum + val, 0);
          
          set({
            resources: newResources,
            stars: [...stars],
            player: { ...player, starcoins: Math.max(0, newStarcoins) },
            lastOnlineTime: now,
            totalResourcesEarned: get().totalResourcesEarned + Math.max(0, resourceDelta)
          });
          
          get().checkAchievements();
        }
      },

      saveGame: () => {
        const state = get();
        localStorage.setItem('spaceMinerGame', JSON.stringify({
          player: state.player,
          stars: state.stars,
          ais: state.ais,
          ships: state.ships,
          miners: state.miners,
          trades: state.trades,
          arenaMatches: state.arenaMatches,
          resources: state.resources,
          prices: state.prices,
          techTree: state.techTree,
          lastCollectTime: state.lastCollectTime,
          lastSaveTime: Date.now()
        }));
      },

      loadOfflineProgress: () => {
        const { lastCollectTime } = get();
        const now = Date.now();
        const timeDiff = now - lastCollectTime;
        
        if (timeDiff > 5000) {
          get().collectResources();
        }
      },

      sellResource: (resource, amount) => {
        const { resources, prices, player } = get();
        if (resources[resource] < amount) return;
        
        const newResources = { ...resources };
        newResources[resource] -= amount;
        
        const earnings = amount * prices[resource];
        const newStarcoins = player.starcoins + earnings;
        
        set({ resources: newResources, player: { ...player, starcoins: newStarcoins } });
        get().saveGame();
      },

      assignAI: (aiId, starId) => {
        const { ais } = get();
        const newAIs = ais.map(ai => 
          ai.id === aiId ? { ...ai, currentStarId: ai.currentStarId === starId ? null : starId } : ai
        );
        set({ ais: newAIs });
        get().saveGame();
      },

      startExploration: () => {
        const { player } = get();
        if (player.starcoins < 100) {
          alert('星币不足！探索需要消耗100星币');
          return;
        }
        
        set(state => ({ 
          exploring: true, 
          explorationProgress: 0,
          player: { ...state.player, starcoins: state.player.starcoins - 100 }
        }));
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2;
          set({ explorationProgress: progress });
          
          if (progress >= 100) {
            clearInterval(interval);
            get().completeExploration();
          }
        }, 200);
      },

      completeExploration: () => {
        const { player, stars, techTree } = get();
        const rand = Math.random();
        
        let newStar: Star | null = null;
        let message = '';
        let reward = 0;
        
        const explorationBonus = techTree.some(t => t.id === 'exploration' && t.unlocked) ? 1.2 : 1;
        
        const effectiveRand = Math.pow(rand, explorationBonus);
        
        if (effectiveRand < 0.3) {
          const types: ('red' | 'yellow' | 'blue' | 'white' | 'neutron' | 'pulsar' | 'blackhole')[] = 
            ['red', 'yellow', 'blue', 'white', 'neutron', 'pulsar', 'blackhole'];
          const weights = [0.5, 0.25, 0.15, 0.05, 0.03, 0.015, 0.005];
          
          let r = Math.random();
          let selectedType: Star['type'] = 'red';
          for (let i = 0; i < weights.length; i++) {
            if (r < weights[i]) {
              selectedType = types[i];
              break;
            }
            r -= weights[i];
          }
          
          const config = STAR_CONFIGS[selectedType];
          const now = Date.now();
          
          newStar = {
            id: generateId(),
            type: selectedType,
            name: `${config.name} #${String(stars.length + 1).padStart(4, '0')}`,
            discovererId: player.id,
            ownerId: player.id,
            totalResources: config.totalResources,
            remainingResources: config.totalResources,
            status: 'active',
            activeUntil: now + config.activeDays * 24 * 60 * 60 * 1000,
            dormantUntil: now + (config.activeDays + config.dormantDays) * 24 * 60 * 60 * 1000,
            maintenanceFee: config.maintenanceFee,
            createdAt: now
          };
          
          reward = config.totalResources / 100;
          message = `🎉 发现新恒星: ${newStar.name}! 获得 ${Math.floor(reward)} 星币奖励！`;
        } else if (effectiveRand < 0.55) {
          message = '🪨 发现废弃恒星，资源已枯竭';
        } else if (effectiveRand < 0.75) {
          message = '☄️ 遭遇陨石群，飞船受损';
        } else if (effectiveRand < 0.9) {
          reward = 500 + Math.floor(Math.random() * 500);
          message = `🏛️ 发现古代遗迹，获得 ${reward} 星币奖励！`;
        } else {
          const loss = Math.floor(player.starcoins * 0.1);
          message = `👾 遭遇宇宙海盗，损失 ${loss} 星币！`;
          set(state => ({ player: { ...state.player, starcoins: Math.max(0, state.player.starcoins - loss) } }));
        }
        
        if (newStar) {
          set(state => ({ stars: [...state.stars, newStar] }));
        }
        
        if (reward > 0) {
          set(state => ({ player: { ...state.player, starcoins: state.player.starcoins + reward } }));
        }
        
        set({ exploring: false, explorationProgress: 0 });
        get().saveGame();
        alert(message);
      },

      unlockTech: (techId) => {
        const { player, techTree } = get();
        const tech = techTree.find(t => t.id === techId);
        if (!tech || tech.unlocked) return;
        
        const prereqsMet = tech.prerequisites.every(prereqId => 
          techTree.find(t => t.id === prereqId)?.unlocked
        );
        
        if (!prereqsMet) {
          alert('请先解锁前置科技！');
          return;
        }
        
        if (player.starcoins < tech.cost) {
          alert('星币不足！');
          return;
        }
        
        const newTechTree = techTree.map(t => 
          t.id === techId ? { ...t, unlocked: true } : t
        );
        
        set({ 
          techTree: newTechTree,
          player: { ...player, starcoins: player.starcoins - tech.cost }
        });
        get().saveGame();
      },

      buyShip: () => {
        const { player, ships } = get();
        if (ships.length >= 5) {
          alert('最多拥有5艘飞船！');
          return;
        }
        
        const nextLevel = (ships.length + 1) as 1 | 2 | 3 | 4 | 5;
        const cost = nextLevel * 1000;
        
        if (player.starcoins < cost) {
          alert('星币不足！');
          return;
        }
        
        const newShip: Spaceship = {
          id: generateId(),
          playerId: player.id,
          name: SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)],
          level: nextLevel,
          aiSlots: nextLevel,
          currentMission: null,
          createdAt: Date.now()
        };
        
        set({ 
          ships: [...ships, newShip],
          player: { ...player, starcoins: player.starcoins - cost }
        });
        get().saveGame();
      },

      upgradeAI: (aiId) => {
        const { player, ais } = get();
        const ai = ais.find(a => a.id === aiId);
        if (!ai || ai.tier >= 6) return;
        
        const cost = ai.tier * 500;
        if (player.starcoins < cost) {
          alert('星币不足！');
          return;
        }
        
        const newAIs = ais.map(a => 
          a.id === aiId ? { ...a, tier: (a.tier + 1) as AI['tier'] } : a
        );
        
        set({ 
          ais: newAIs,
          player: { ...player, starcoins: player.starcoins - cost }
        });
        get().saveGame();
      },

      startArenaMatch: (starId, stakePercentage) => {
        const { stars, arenaMatches, player } = get();
        const star = stars.find(s => s.id === starId);
        
        if (!star) {
          alert('找不到指定的恒星！');
          return;
        }
        
        if (star.type === 'red') {
          alert('红矮星不可用于对赌！');
          return;
        }
        
        const todayMatches = arenaMatches.filter(m => {
          const matchDate = new Date(m.createdAt);
          const today = new Date();
          return matchDate.toDateString() === today.toDateString() && 
                 (m.player1Id === player.id || m.player2Id === player.id);
        });
        
        if (todayMatches.length >= 3) {
          alert('每天最多进行3次对赌！');
          return;
        }
        
        const simulatedOpponent = {
          id: generateId(),
          name: '神秘矿主',
          star: { 
            ...star, 
            id: generateId(), 
            remainingResources: star.remainingResources * (0.6 + Math.random() * 0.8)
          }
        };
        
        const playerDaily = star.remainingResources / STAR_CONFIGS[star.type].activeDays * stakePercentage / 100;
        const opponentDaily = simulatedOpponent.star.remainingResources / STAR_CONFIGS[star.type].activeDays * stakePercentage / 100;
        
        const win = playerDaily > opponentDaily;
        let message = '';
        
        if (win) {
          const reward = opponentDaily * 7;
          set(state => ({ player: { ...state.player, starcoins: state.player.starcoins + reward } }));
          message = `🏆 胜利！获得 ${Math.floor(reward)} 星币！`;
        } else {
          message = `💔 失败！未来7天收益减半`;
        }
        
        const newMatch: ArenaMatch = {
          id: generateId(),
          player1Id: player.id,
          player2Id: simulatedOpponent.id,
          stakePercentage,
          player1StarId: starId,
          player2StarId: simulatedOpponent.star.id,
          result: win ? 'player1' : 'player2',
          createdAt: Date.now(),
          resolvedAt: Date.now()
        };
        
        set(state => ({ arenaMatches: [...state.arenaMatches, newMatch] }));
        get().saveGame();
        alert(message);
      },

      addMiner: (starId) => {
        const { player, stars, miners } = get();
        const star = stars.find(s => s.id === starId);
        
        if (!star) {
          alert('找不到指定的恒星！');
          return;
        }
        
        if (star.status !== 'active') {
          alert('只能在活跃的恒星上安装矿机！');
          return;
        }
        
        const starMiners = miners.filter(m => m.starId === starId);
        if (starMiners.length >= 10) {
          alert('每颗恒星最多安装10台矿机！');
          return;
        }
        
        const cost = 200 * (starMiners.length + 1);
        if (player.starcoins < cost) {
          alert('星币不足！');
          return;
        }
        
        const newMiner: Miner = {
          id: generateId(),
          starId,
          level: 1,
          isDeep: false,
          installedAt: Date.now()
        };
        
        set({ 
          miners: [...miners, newMiner],
          player: { ...player, starcoins: player.starcoins - cost }
        });
        get().saveGame();
      },

      upgradeMiner: (minerId) => {
        const { player, miners } = get();
        const miner = miners.find(m => m.id === minerId);
        
        if (!miner || miner.level >= 5) return;
        
        const cost = miner.level * 300;
        if (player.starcoins < cost) {
          alert('星币不足！');
          return;
        }
        
        const newMiners = miners.map(m => 
          m.id === minerId ? { ...m, level: m.level + 1 } : m
        );
        
        set({ 
          miners: newMiners,
          player: { ...player, starcoins: player.starcoins - cost }
        });
        get().saveGame();
      },

      toggleDeepMiner: (minerId) => {
        const { miners } = get();
        const newMiners = miners.map(m => 
          m.id === minerId ? { ...m, isDeep: !m.isDeep } : m
        );
        set({ miners: newMiners });
        get().saveGame();
      },

      addAIEquipment: (aiId, equipmentType) => {
        const { player, ais } = get();
        const ai = ais.find(a => a.id === aiId);
        
        if (!ai) return;
        
        const existingEquip = ai.equipment.find(e => e.type === equipmentType);
        if (existingEquip) {
          if (existingEquip.level >= 5) {
            alert('装备已达最高等级！');
            return;
          }
          
          const cost = existingEquip.level * 200;
          if (player.starcoins < cost) {
            alert('星币不足！');
            return;
          }
          
          const newAIs = ais.map(a => {
            if (a.id === aiId) {
              const newEquipment = a.equipment.map(e => 
                e.type === equipmentType ? { ...e, level: e.level + 1 } : e
              );
              return { ...a, equipment: newEquipment };
            }
            return a;
          });
          
          set({ 
            ais: newAIs,
            player: { ...player, starcoins: player.starcoins - cost }
          });
        } else {
          const cost = 100;
          if (player.starcoins < cost) {
            alert('星币不足！');
            return;
          }
          
          const newAIs = ais.map(a => {
            if (a.id === aiId) {
              return { ...a, equipment: [...a.equipment, { type: equipmentType as any, level: 1 }] };
            }
            return a;
          });
          
          set({ 
            ais: newAIs,
            player: { ...player, starcoins: player.starcoins - cost }
          });
        }
        get().saveGame();
      },

      upgradeAIWithGuarantee: (aiId: string) => {
        const { player, ais, aiUpgradeFailStreak } = get();
        const ai = ais.find(a => a.id === aiId);
        
        if (!ai || ai.tier >= 6) return;
        
        const cost = ai.tier * 1000;
        if (player.starcoins < cost) {
          alert('星币不足！');
          return;
        }
        
        let success = false;
        const guaranteedSuccess = aiUpgradeFailStreak >= 5;
        
        if (guaranteedSuccess) {
          success = true;
        } else {
          const successChance = 0.5 + aiUpgradeFailStreak * 0.1;
          success = Math.random() < successChance;
        }
        
        if (success) {
          const newAIs = ais.map(a => 
            a.id === aiId ? { ...a, tier: (a.tier + 1) as AI['tier'] } : a
          );
          
          set({ 
            ais: newAIs,
            player: { ...player, starcoins: player.starcoins - cost },
            aiUpgradeFailStreak: 0
          });
          
          alert(`🎉 升级成功！AI 等级提升到 ${ai.tier + 1}`);
        } else {
          set({ 
            player: { ...player, starcoins: player.starcoins - cost },
            aiUpgradeFailStreak: aiUpgradeFailStreak + 1
          });
          
          const attemptsLeft = 5 - aiUpgradeFailStreak - 1;
          if (attemptsLeft > 0) {
            alert(`💔 升级失败！再失败 ${attemptsLeft} 次后下一次必成功`);
          } else {
            alert(`💔 升级失败！下次必成功！`);
          }
        }
        
        get().saveGame();
      },

      buildDysonSphere: () => {
        const { player, resources, stars } = get();
        
        const requiredResources = {
          iron: 100000,
          titanium: 50000,
          crystal: 20000,
          rareOre: 10000,
          nano: 5000,
          darkMatter: 1000,
          antiMatter: 500,
          exoticMatter: 100
        };
        
        const canBuild = Object.entries(requiredResources).every(
          ([resource, amount]) => resources[resource as keyof PlayerResources] >= amount
        );
        
        if (!canBuild) {
          alert('资源不足！无法建造戴森球');
          return;
        }
        
        if (player.starcoins < 1000000) {
          alert('星币不足！需要 100 万星币');
          return;
        }
        
        if (stars.length < 3) {
          alert('需要至少拥有 3 颗恒星才能建造戴森球');
          return;
        }
        
        const newResources = { ...resources };
        Object.entries(requiredResources).forEach(([resource, amount]) => {
          newResources[resource as keyof PlayerResources] -= amount;
        });
        
        set({
          resources: newResources,
          player: { ...player, starcoins: player.starcoins - 1000000 },
          dysonSphereBuilt: true
        });
        
        get().saveGame();
        alert('🎊 恭喜！戴森球建造成功！所有恒星产出翻倍！');
      },

      contributeToDysonSphere: (resourceType: keyof PlayerResources, amount: number) => {
        const { resources, dysonSphereProgress } = get();
        
        if (resources[resourceType] < amount) {
          alert('资源不足！');
          return;
        }
        
        const contributionValue = amount * (RESOURCE_PRICE_CONFIGS[resourceType]?.basePrice || 1);
        const newProgress = Math.min(100, dysonSphereProgress + contributionValue / 1000);
        
        const newResources = { ...resources };
        newResources[resourceType] -= amount;
        
        set({
          resources: newResources,
          dysonSphereProgress: newProgress
        });
        
        get().saveGame();
      },

      checkAchievements: () => {
        const { stars, ais, ships, techTree, dysonSphereBuilt, arenaMatches, totalResourcesEarned, achievements } = get();
        let updated = false;
        
        const newAchievements = achievements.map(achievement => {
          if (achievement.unlocked) return achievement;
          
          let unlocked = false;
          switch (achievement.id) {
            case 'firstStar':
              unlocked = stars.length >= 1;
              break;
            case 'tenStars':
              unlocked = stars.length >= 10;
              break;
            case 't5AI':
              unlocked = ais.some(ai => ai.tier >= 5);
              break;
            case 'lv5Ship':
              unlocked = ships.some(ship => ship.level >= 5);
              break;
            case 'millionaire':
              unlocked = totalResourcesEarned >= 1000000;
              break;
            case 'arenaWinner':
              unlocked = arenaMatches.filter(m => m.result === 'player1').length >= 10;
              break;
            case 'dysonSphere':
              unlocked = dysonSphereBuilt;
              break;
            case 'techMaster':
              unlocked = techTree.every(t => t.unlocked);
              break;
          }
          
          if (unlocked && !achievement.unlocked) {
            updated = true;
            return { ...achievement, unlocked: true };
          }
          
          return achievement;
        });
        
        if (updated) {
          set({ achievements: newAchievements });
        }
      },

      claimAchievement: (achievementId: string) => {
        const { achievements, player, resources } = get();
        const achievement = achievements.find(a => a.id === achievementId);
        
        if (!achievement || !achievement.unlocked || achievement.claimed) {
          return;
        }
        
        let updatedPlayer = { ...player };
        let updatedResources = { ...resources };
        
        switch (achievement.rewardType) {
          case 'starcoins':
            updatedPlayer.starcoins += achievement.rewardAmount;
            break;
          case 'resource':
            if (achievement.rewardResource) {
              updatedResources[achievement.rewardResource] += achievement.rewardAmount;
            }
            break;
        }
        
        const newAchievements = achievements.map(a => 
          a.id === achievementId ? { ...a, claimed: true } : a
        );
        
        set({
          achievements: newAchievements,
          player: updatedPlayer,
          resources: updatedResources
        });
        
        get().saveGame();
        alert(`🎉 成就领取成功！获得 ${achievement.rewardType === 'starcoins' ? achievement.rewardAmount + ' 星币' : '奖励'}`);
      }
    }),
    {
      name: 'spaceMinerGame',
      partialize: (state) => ({
        player: state.player,
        stars: state.stars,
        ais: state.ais,
        ships: state.ships,
        miners: state.miners,
        trades: state.trades,
        arenaMatches: state.arenaMatches,
        resources: state.resources,
        prices: state.prices,
        techTree: state.techTree,
        lastCollectTime: state.lastCollectTime,
        lastSaveTime: Date.now(),
        lastPriceUpdateTime: state.lastPriceUpdateTime,
        priceHistory: state.priceHistory,
        aiUpgradeFailStreak: state.aiUpgradeFailStreak,
        dysonSphereBuilt: state.dysonSphereBuilt,
        dysonSphereProgress: state.dysonSphereProgress,
        achievements: state.achievements,
        totalResourcesEarned: state.totalResourcesEarned
      })
    }
  )
);
