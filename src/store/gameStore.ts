import { create } from 'zustand';
import { Player, Star, AI, Spaceship, Miner, Trade, ArenaMatch, PlayerResources, ResourcePrice, TechNode, STAR_CONFIGS, TECH_TREE, AI_NAMES, SHIP_NAMES } from '../types/game';

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
  startArenaMatch: (starId: string, stakePercentage: number) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createInitialPlayer = (): Player => ({
  id: generateId(),
  username: '星际矿业主',
  starcoins: 500,
  createdAt: new Date(),
  lastOnline: new Date(),
  mooncardExpires: null,
  techLevel: 1,
  techResetCount: 0
});

const createInitialStar = (playerId: string): Star => {
  const now = new Date();
  const activeUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    id: generateId(),
    type: 'red',
    name: '红矮星 #0001',
    discovererId: playerId,
    ownerId: playerId,
    totalResources: 100000,
    remainingResources: 100000,
    status: 'active',
    activeUntil,
    dormantUntil: new Date(activeUntil.getTime() + 15 * 24 * 60 * 60 * 1000),
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
  createdAt: new Date()
});

const createInitialShip = (playerId: string): Spaceship => ({
  id: generateId(),
  playerId,
  name: SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)],
  level: 1,
  aiSlots: 1,
  currentMission: null,
  createdAt: new Date()
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

export const useGameStore = create<GameState>((set, get) => ({
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

  initializeGame: () => {
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
      techTree: [...TECH_TREE]
    });
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  selectStar: (star) => set({ selectedStar: star }),

  collectResources: () => {
    const { stars, ais, ships, resources, player, techTree } = get();
    const techMultiplier = techTree.filter(t => t.unlocked).length * 0.1 + 1;
    const deepMiningUnlocked = techTree.some(t => t.id === 'deepMining' && t.unlocked);
    
    let newResources = { ...resources };
    
    stars.forEach(star => {
      if (star.status !== 'active' || star.remainingResources <= 0) return;
      
      const assignedAIs = ais.filter(ai => ai.currentStarId === star.id);
      if (assignedAIs.length === 0) return;
      
      const aiTierSum = assignedAIs.reduce((sum, ai) => sum + ai.tier, 0);
      const shipBonus = ships.length * 0.5;
      const minerBonus = get().miners.filter(m => m.starId === star.id).length * 0.2;
      
      let baseRate = aiTierSum * shipBonus * (1 + minerBonus);
      if (deepMiningUnlocked) {
        baseRate *= 1.3;
      }
      
      baseRate *= techMultiplier;
      
      const config = STAR_CONFIGS[star.type];
      const dailyRate = Math.floor(baseRate * 100);
      const amountToMine = Math.min(dailyRate, star.remainingResources);
      
      config.resources.forEach(resource => {
        newResources[resource as keyof PlayerResources] += amountToMine / config.resources.length;
      });
      
      const newRemaining = star.remainingResources - amountToMine;
      star.remainingResources = newRemaining;
      
      if (newRemaining <= 0) {
        star.status = 'depleted';
      }
    });
    
    const maintenanceCost = stars.reduce((sum, s) => sum + s.maintenanceFee, 0);
    const newStarcoins = player.starcoins - maintenanceCost + Math.floor(newResources.iron * 0.1);
    
    set({ 
      resources: newResources, 
      stars: [...stars],
      player: { ...player, starcoins: Math.max(0, newStarcoins) }
    });
  },

  sellResource: (resource, amount) => {
    const { resources, prices, player } = get();
    if (resources[resource] < amount) return;
    
    const newResources = { ...resources };
    newResources[resource] -= amount;
    
    const earnings = amount * prices[resource];
    const newStarcoins = player.starcoins + earnings;
    
    set({ resources: newResources, player: { ...player, starcoins: newStarcoins } });
  },

  assignAI: (aiId, starId) => {
    const { ais } = get();
    const newAIs = ais.map(ai => 
      ai.id === aiId ? { ...ai, currentStarId: starId } : ai
    );
    set({ ais: newAIs });
  },

  startExploration: () => {
    set({ exploring: true, explorationProgress: 0 });
    
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
    const { player, stars } = get();
    const rand = Math.random();
    
    let newStar: Star | null = null;
    let message = '';
    
    if (rand < 0.3) {
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
      const now = new Date();
      const activeUntil = new Date(now.getTime() + config.activeDays * 24 * 60 * 60 * 1000);
      
      newStar = {
        id: generateId(),
        type: selectedType,
        name: `${config.name} #${String(stars.length + 1).padStart(4, '0')}`,
        discovererId: player.id,
        ownerId: player.id,
        totalResources: config.totalResources,
        remainingResources: config.totalResources,
        status: 'active',
        activeUntil,
        dormantUntil: new Date(activeUntil.getTime() + config.dormantDays * 24 * 60 * 60 * 1000),
        maintenanceFee: config.maintenanceFee,
        createdAt: now
      };
      
      message = `🎉 发现新恒星: ${newStar.name}!`;
    } else if (rand < 0.55) {
      message = '🪨 发现废弃恒星，资源已枯竭';
    } else if (rand < 0.75) {
      message = '☄️ 遭遇陨石群，飞船受损';
    } else if (rand < 0.9) {
      message = '🏛️ 发现古代遗迹，获得神秘奖励！';
    } else {
      message = '👾 遭遇宇宙海盗，损失部分资源';
    }
    
    if (newStar) {
      set(state => ({ stars: [...state.stars, newStar] }));
    }
    
    set({ exploring: false, explorationProgress: 0 });
    alert(message);
  },

  unlockTech: (techId) => {
    const { player, techTree } = get();
    const tech = techTree.find(t => t.id === techId);
    if (!tech || tech.unlocked) return;
    
    const prereqsMet = tech.prerequisites.every(prereqId => 
      techTree.find(t => t.id === prereqId)?.unlocked
    );
    
    if (!prereqsMet || player.starcoins < tech.cost) return;
    
    const newTechTree = techTree.map(t => 
      t.id === techId ? { ...t, unlocked: true } : t
    );
    
    set({ 
      techTree: newTechTree,
      player: { ...player, starcoins: player.starcoins - tech.cost }
    });
  },

  buyShip: () => {
    const { player, ships } = get();
    const nextLevel = Math.min(5, ships.length + 1) as 1 | 2 | 3 | 4 | 5;
    const cost = nextLevel * 1000;
    
    if (player.starcoins < cost) return;
    
    const newShip: Spaceship = {
      id: generateId(),
      playerId: player.id,
      name: SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)],
      level: nextLevel,
      aiSlots: nextLevel,
      currentMission: null,
      createdAt: new Date()
    };
    
    set({ 
      ships: [...ships, newShip],
      player: { ...player, starcoins: player.starcoins - cost }
    });
  },

  upgradeAI: (aiId) => {
    const { player, ais } = get();
    const ai = ais.find(a => a.id === aiId);
    if (!ai || ai.tier >= 6) return;
    
    const cost = ai.tier * 500;
    if (player.starcoins < cost) return;
    
    const newAIs = ais.map(a => 
      a.id === aiId ? { ...a, tier: (a.tier + 1) as AI['tier'] } : a
    );
    
    set({ 
      ais: newAIs,
      player: { ...player, starcoins: player.starcoins - cost }
    });
  },

  startArenaMatch: (starId, stakePercentage) => {
    const { player, stars } = get();
    const star = stars.find(s => s.id === starId);
    if (!star || star.type === 'red') {
      alert('红矮星不可用于对赌！');
      return;
    }
    
    const simulatedOpponent = {
      id: generateId(),
      name: '神秘矿主',
      star: { ...star, id: generateId(), remainingResources: star.remainingResources * (0.8 + Math.random() * 0.4) }
    };
    
    const playerDaily = star.remainingResources / 30 * stakePercentage / 100;
    const opponentDaily = simulatedOpponent.star.remainingResources / 30 * stakePercentage / 100;
    
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
      createdAt: new Date(),
      resolvedAt: new Date()
    };
    
    set(state => ({ arenaMatches: [...state.arenaMatches, newMatch] }));
    alert(message);
  }
}));
