export type StarType = 'red' | 'yellow' | 'blue' | 'white' | 'neutron' | 'pulsar' | 'blackhole';

export type StarStatus = 'active' | 'depleted' | 'dormant';

export type AIProfession = 'mining' | 'exploring' | 'combat' | 'allround';

export type EquipmentType = 'drill' | 'scanner' | 'shield' | 'battery' | 'chip' | 'navigator';

export type TradeStatus = 'pending' | 'completed' | 'cancelled';

export interface Player {
  id: string;
  username: string;
  starcoins: number;
  createdAt: number;
  lastOnline: number;
  mooncardExpires: number | null;
  techLevel: number;
  techResetCount: number;
}

export interface Star {
  id: string;
  type: StarType;
  name: string;
  discovererId: string;
  ownerId: string;
  totalResources: number;
  remainingResources: number;
  status: StarStatus;
  activeUntil: number;
  dormantUntil: number;
  maintenanceFee: number;
  createdAt: number;
}

export interface AIEquipment {
  type: EquipmentType;
  level: number;
}

export interface AI {
  id: string;
  playerId: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  profession: AIProfession;
  equipment: AIEquipment[];
  currentStarId: string | null;
  createdAt: number;
}

export interface Mission {
  type: 'exploring' | 'mining';
  targetStarId?: string;
  startTime: number;
  duration: number;
}

export interface Spaceship {
  id: string;
  playerId: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  aiSlots: number;
  currentMission: Mission | null;
  createdAt: number;
}

export interface Miner {
  id: string;
  starId: string;
  level: number;
  isDeep: boolean;
  installedAt: number;
}

export interface Trade {
  id: string;
  starId: string;
  sellerId: string;
  buyerId: string | null;
  price: number;
  shares: number;
  status: TradeStatus;
  createdAt: number;
}

export interface ArenaMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  stakePercentage: number;
  player1StarId: string;
  player2StarId: string;
  result: 'player1' | 'player2' | null;
  createdAt: number;
  resolvedAt: number | null;
}

export interface ResourcePrice {
  iron: number;
  titanium: number;
  crystal: number;
  rareOre: number;
  nano: number;
  darkMatter: number;
  antiMatter: number;
  exoticMatter: number;
}

export interface PlayerResources {
  iron: number;
  titanium: number;
  crystal: number;
  rareOre: number;
  nano: number;
  darkMatter: number;
  antiMatter: number;
  exoticMatter: number;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  prerequisites: string[];
  unlocked: boolean;
  effect: string;
}

export interface StarConfig {
  type: StarType;
  name: string;
  resources: string[];
  totalResources: number;
  activeDays: number;
  dormantDays: number;
  maintenanceFee: number;
  color: string;
  icon: string;
}

export const STAR_CONFIGS: Record<StarType, StarConfig> = {
  red: {
    type: 'red',
    name: '红矮星',
    resources: ['iron', 'titanium'],
    totalResources: 100000,
    activeDays: 30,
    dormantDays: 15,
    maintenanceFee: 50,
    color: '#FF6B6B',
    icon: '⭐'
  },
  yellow: {
    type: 'yellow',
    name: '黄矮星',
    resources: ['crystal'],
    totalResources: 300000,
    activeDays: 50,
    dormantDays: 25,
    maintenanceFee: 200,
    color: '#FFE66D',
    icon: '🌟'
  },
  blue: {
    type: 'blue',
    name: '蓝巨星',
    resources: ['rareOre'],
    totalResources: 800000,
    activeDays: 80,
    dormantDays: 40,
    maintenanceFee: 500,
    color: '#4ECDC4',
    icon: '💎'
  },
  white: {
    type: 'white',
    name: '白矮星',
    resources: ['nano'],
    totalResources: 2000000,
    activeDays: 120,
    dormantDays: 60,
    maintenanceFee: 1500,
    color: '#FFFFFF',
    icon: '⚪'
  },
  neutron: {
    type: 'neutron',
    name: '中子星',
    resources: ['darkMatter'],
    totalResources: 5000000,
    activeDays: 180,
    dormantDays: 90,
    maintenanceFee: 5000,
    color: '#9B59B6',
    icon: '🔮'
  },
  pulsar: {
    type: 'pulsar',
    name: '脉冲星',
    resources: ['antiMatter'],
    totalResources: 15000000,
    activeDays: 250,
    dormantDays: 120,
    maintenanceFee: 15000,
    color: '#E91E63',
    icon: '💫'
  },
  blackhole: {
    type: 'blackhole',
    name: '黑洞',
    resources: ['exoticMatter'],
    totalResources: 50000000,
    activeDays: 365,
    dormantDays: 180,
    maintenanceFee: 50000,
    color: '#000000',
    icon: '🕳️'
  }
};

export const TECH_TREE: TechNode[] = [
  { id: 'basicMining', name: '基础采矿', description: '解锁基础采矿功能', cost: 0, prerequisites: [], unlocked: true, effect: '采矿速度+10%' },
  { id: 'offlineIncome', name: '离线收益', description: '离线时也能获得采矿收益', cost: 0, prerequisites: [], unlocked: true, effect: '离线收益+50%' },
  { id: 'deepMining', name: '深层采矿', description: '开采更深层的矿石', cost: 0, prerequisites: [], unlocked: true, effect: '速度+30%，消耗+20%资源' },
  { id: 'starScan', name: '恒星扫描', description: '扫描附近星域', cost: 0, prerequisites: [], unlocked: true, effect: '探索成功率+10%' },
  { id: 'exploration', name: '探索技术', description: '解锁探索功能', cost: 0, prerequisites: [], unlocked: true, effect: '探索范围+50%' },
  { id: 'arena', name: '竞技场', description: '解锁竞技场对赌', cost: 0, prerequisites: [], unlocked: true, effect: '可参与采矿对赌' },
  { id: 'autoFactory', name: '自动工厂', description: '自动收集资源', cost: 0, prerequisites: [], unlocked: true, effect: '自动收集资源' },
  { id: 'starExchange', name: '恒星交易所', description: '解锁恒星交易', cost: 0, prerequisites: [], unlocked: true, effect: '可交易开采权' },
  { id: 'deepSpace', name: '深空探测', description: '探索更远的星域', cost: 0, prerequisites: [], unlocked: true, effect: '发现稀有恒星概率+20%' },
  { id: 'minerUpgrade', name: '矿机升级', description: '升级矿机效率', cost: 0, prerequisites: [], unlocked: true, effect: '矿机效率+50%' },
  { id: 'dysonFrame', name: '戴森框架', description: '建造戴森球的基础', cost: 0, prerequisites: [], unlocked: true, effect: '解锁戴森球建造' }
];

export const AI_NAMES = [
  '阿尔法', '贝塔', '伽马', '德尔塔', '艾普西隆', '泽塔',
  '艾塔', '西塔', '约塔', '卡帕', '拉姆达', '缪'
];

export const SHIP_NAMES = [
  '探索者号', '先驱者号', '旅行者号', '发现号', '企业号',
  '银河号', '星辰号', '星云号', '彗星号', '猎户号'
];

export interface PriceHistoryItem {
  time: number;
  price: number;
}

export interface PriceConfig {
  basePrice: number;
  minMultiplier: number;
  maxMultiplier: number;
  volatility: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rewardType: 'starcoins' | 'resource' | 'permanent';
  rewardAmount: number;
  rewardResource?: keyof PlayerResources;
  unlocked: boolean;
  claimed: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'firstStar', name: '星际先驱', description: '发现第一颗恒星', rewardType: 'starcoins', rewardAmount: 100, unlocked: false, claimed: false },
  { id: 'tenStars', name: '星际领主', description: '发现10颗恒星', rewardType: 'starcoins', rewardAmount: 1000, unlocked: false, claimed: false },
  { id: 't5AI', name: '顶级矿工', description: '拥有T5级AI', rewardType: 'starcoins', rewardAmount: 500, unlocked: false, claimed: false },
  { id: 'lv5Ship', name: '宇宙旗舰', description: '拥有5级飞船', rewardType: 'starcoins', rewardAmount: 2000, unlocked: false, claimed: false },
  { id: 'millionaire', name: '星际富豪', description: '累计获得100万资源', rewardType: 'starcoins', rewardAmount: 5000, unlocked: false, claimed: false },
  { id: 'arenaWinner', name: '竞技场霸主', description: '在竞技场获胜10次', rewardType: 'starcoins', rewardAmount: 3000, unlocked: false, claimed: false },
  { id: 'dysonSphere', name: '戴森球建造者', description: '建造戴森球', rewardType: 'permanent', rewardAmount: 1, unlocked: false, claimed: false },
  { id: 'techMaster', name: '科技大师', description: '解锁所有科技', rewardType: 'starcoins', rewardAmount: 10000, unlocked: false, claimed: false },
];

export const RESOURCE_PRICE_CONFIGS: Record<string, PriceConfig> = {
  iron: { basePrice: 1, minMultiplier: 0.5, maxMultiplier: 1.5, volatility: 0.1 },
  titanium: { basePrice: 5, minMultiplier: 0.6, maxMultiplier: 1.4, volatility: 0.15 },
  crystal: { basePrice: 15, minMultiplier: 0.7, maxMultiplier: 1.3, volatility: 0.2 },
  rareOre: { basePrice: 50, minMultiplier: 0.7, maxMultiplier: 1.3, volatility: 0.2 },
  nano: { basePrice: 200, minMultiplier: 0.8, maxMultiplier: 1.2, volatility: 0.15 },
  darkMatter: { basePrice: 1000, minMultiplier: 0.9, maxMultiplier: 1.1, volatility: 0.1 },
  antiMatter: { basePrice: 5000, minMultiplier: 0.85, maxMultiplier: 1.15, volatility: 0.12 },
  exoticMatter: { basePrice: 20000, minMultiplier: 0.9, maxMultiplier: 1.1, volatility: 0.08 }
};
