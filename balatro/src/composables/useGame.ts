import { reactive, computed } from 'vue'

// ─── Types ───────────────────────────────────────────────────────────────────

export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type Rarity = 'common' | 'rare' | 'legendary'
export type GamePhase = 'playing' | 'shop' | 'won' | 'lost'

export interface Card {
  id: string
  suit: Suit
  rank: Rank
  selected: boolean
}

export interface JokerDef {
  id: string
  name: string
  rarity: Rarity
  price: number
  art: string
  description: string
  // Apply effect after base score is computed. Returns { chips, mult }
  apply: (ctx: { chips: number; mult: number; playedCards: Card[]; handType: HandType }) => { chips: number; mult: number }
}

export type HandType =
  | '同花顺'
  | '四条'
  | '葫芦'
  | '同花'
  | '顺子'
  | '三条'
  | '两对'
  | '对子'
  | '高牌'

export interface HandResult {
  type: HandType
  baseChips: number
  baseMult: number
  cardSum: number
  totalChips: number
  totalMult: number
  finalScore: number
  jokerLogs: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const RANK_VALUE: Record<Rank, number> = {
  A: 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, J: 10, Q: 10, K: 10
}

export const HAND_BASE: Record<HandType, { chips: number; mult: number }> = {
  '同花顺': { chips: 100, mult: 8 },
  '四条':   { chips: 60,  mult: 7 },
  '葫芦':   { chips: 40,  mult: 4 },
  '同花':   { chips: 35,  mult: 4 },
  '顺子':   { chips: 30,  mult: 4 },
  '三条':   { chips: 30,  mult: 3 },
  '两对':   { chips: 20,  mult: 2 },
  '对子':   { chips: 10,  mult: 2 },
  '高牌':   { chips: 5,   mult: 1 },
}

export const BLINDS = [
  { name: '小盲注', icon: '🔵', target: 300, reward: 5 },
  { name: '中盲注', icon: '🟡', target: 500, reward: 5 },
  { name: '大盲注', icon: '🔴', target: 800, reward: 5 },
]

// Joker definitions — exactly 6
export const JOKER_POOL: JokerDef[] = [
  {
    id: 'jester',
    name: '小丑',
    rarity: 'common',
    price: 3,
    art: '🃏',
    description: '每手 +4 mult',
    apply({ chips, mult }) {
      return { chips, mult: mult + 4 }
    },
  },
  {
    id: 'scholar',
    name: '学者',
    rarity: 'common',
    price: 3,
    art: '📖',
    description: '打出的牌每张A：+4 mult',
    apply({ chips, mult, playedCards }) {
      const aces = playedCards.filter(c => c.rank === 'A').length
      return { chips, mult: mult + aces * 4 }
    },
  },
  {
    id: 'heart_collector',
    name: '红心收藏家',
    rarity: 'rare',
    price: 5,
    art: '❤️',
    description: '打出含♥时，mult ×4',
    apply({ chips, mult, playedCards }) {
      const hasHeart = playedCards.some(c => c.suit === '♥')
      return { chips, mult: hasHeart ? mult * 4 : mult }
    },
  },
  {
    id: 'club_lover',
    name: '梅花爱好者',
    rarity: 'rare',
    price: 5,
    art: '♣',
    description: '打出含♣时，mult ×4',
    apply({ chips, mult, playedCards }) {
      const hasClub = playedCards.some(c => c.suit === '♣')
      return { chips, mult: hasClub ? mult * 4 : mult }
    },
  },
  {
    id: 'royal_face',
    name: '皇家头牌',
    rarity: 'rare',
    price: 5,
    art: '👑',
    description: '打出含J/Q/K时，mult ×10',
    apply({ chips, mult, playedCards }) {
      const hasFace = playedCards.some(c => ['J', 'Q', 'K'].includes(c.rank))
      return { chips, mult: hasFace ? mult * 10 : mult }
    },
  },
  {
    id: 'sf_master',
    name: '同花顺大师',
    rarity: 'legendary',
    price: 8,
    art: '🔥',
    description: '打出同花顺时 +50 mult',
    apply({ chips, mult, handType }) {
      return { chips, mult: handType === '同花顺' ? mult + 50 : mult }
    },
  },
]

// ─── Hand evaluation ──────────────────────────────────────────────────────────

function rankCount(cards: Card[]): Record<string, number> {
  const cnt: Record<string, number> = {}
  for (const c of cards) cnt[c.rank] = (cnt[c.rank] || 0) + 1
  return cnt
}

function isFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false
  return cards.every(c => c.suit === cards[0].suit)
}

function isStraight(cards: Card[]): boolean {
  if (cards.length < 5) return false
  const rankOrder: Record<Rank, number> = {
    A: 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13
  }
  const vals = cards.map(c => rankOrder[c.rank]).sort((a, b) => a - b)
  // Check normal straight
  const isNormal = vals.every((v, i) => i === 0 || v === vals[i - 1] + 1)
  // Check A-2-3-4-5 (wheel)
  const isWheel = JSON.stringify(vals) === JSON.stringify([2, 3, 4, 5, 14])
  return isNormal || isWheel
}

export function evaluateHand(cards: Card[]): HandType {
  if (cards.length === 0) return '高牌'
  const cnt = rankCount(cards)
  const counts = Object.values(cnt).sort((a, b) => b - a)
  const flush = isFlush(cards)
  const straight = isStraight(cards)

  if (flush && straight) return '同花顺'
  if (counts[0] === 4) return '四条'
  if (counts[0] === 3 && counts[1] === 2) return '葫芦'
  if (flush) return '同花'
  if (straight) return '顺子'
  if (counts[0] === 3) return '三条'
  if (counts[0] === 2 && counts[1] === 2) return '两对'
  if (counts[0] === 2) return '对子'
  return '高牌'
}

export function scoreHand(cards: Card[], ownedJokers: JokerDef[]): HandResult {
  const type = evaluateHand(cards)
  const base = HAND_BASE[type]
  const cardSum = cards.reduce((s, c) => s + RANK_VALUE[c.rank], 0)

  let chips = base.chips + cardSum
  let mult = base.mult
  const jokerLogs: string[] = []

  // Apply jokers in order
  for (const joker of ownedJokers) {
    const before = { chips, mult }
    const after = joker.apply({ chips, mult, playedCards: cards, handType: type })
    chips = after.chips
    mult = after.mult
    if (chips !== before.chips || mult !== before.mult) {
      jokerLogs.push(joker.name)
    }
  }

  return {
    type,
    baseChips: base.chips,
    baseMult: base.mult,
    cardSum,
    totalChips: chips,
    totalMult: mult,
    finalScore: chips * mult,
    jokerLogs,
  }
}

// ─── Deck creation & shuffle ──────────────────────────────────────────────────

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}${suit}`, suit, rank, selected: false })
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Game state ───────────────────────────────────────────────────────────────

interface GameState {
  phase: GamePhase
  currentBlindIndex: number
  currentRound: number // 1-based round within blind
  roundScore: number
  gold: number
  handsLeft: number
  discardsLeft: number
  handCards: Card[]
  playedCards: Card[]
  ownedJokers: JokerDef[]
  deck: Card[]
  shopJokers: JokerDef[]
  lastHandResult: HandResult | null
  animating: boolean
  triggeredJokerIndex: number // -1 means none
  currentBlindScore: number // alias for roundScore display clarity
}

const MAX_SELECTED = 5
const HAND_SIZE = 8
const MAX_HANDS = 4
const MAX_DISCARDS = 3

function pickShopJokers(owned: JokerDef[]): JokerDef[] {
  const ownedIds = new Set(owned.map(j => j.id))
  const available = JOKER_POOL.filter(j => !ownedIds.has(j.id))
  const shuffled = shuffle(available)
  return shuffled.slice(0, Math.min(3, shuffled.length))
}

function freshBlindState(state: GameState) {
  const deck = shuffle(createDeck())
  const handCards = deck.splice(0, HAND_SIZE)
  state.deck = deck
  state.handCards = handCards
  state.playedCards = []
  state.handsLeft = MAX_HANDS
  state.discardsLeft = MAX_DISCARDS
  state.roundScore = 0
  state.lastHandResult = null
  state.animating = false
}

export const game = reactive<GameState>({
  phase: 'playing',
  currentBlindIndex: 0,
  currentRound: 1,
  roundScore: 0,
  gold: 0,
  handsLeft: MAX_HANDS,
  discardsLeft: MAX_DISCARDS,
  handCards: [],
  playedCards: [],
  ownedJokers: [],
  deck: [],
  shopJokers: [],
  lastHandResult: null,
  animating: false,
  triggeredJokerIndex: -1,
  currentBlindScore: 0,
})

// Initialise
;(() => {
  const deck = shuffle(createDeck())
  game.handCards = deck.splice(0, HAND_SIZE)
  game.deck = deck
})()

// ─── Computed helpers ─────────────────────────────────────────────────────────

export const selectedCards = computed(() => game.handCards.filter(c => c.selected))
export const currentBlind = computed(() => BLINDS[game.currentBlindIndex])
export const progressPct = computed(() =>
  Math.min(100, Math.floor((game.roundScore / currentBlind.value.target) * 100))
)
export const previewResult = computed(() => {
  const sel = selectedCards.value
  if (sel.length === 0) return null
  return scoreHand(sel, game.ownedJokers)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

export function toggleCard(card: Card) {
  if (game.animating || game.phase !== 'playing') return
  if (card.selected) {
    card.selected = false
  } else if (selectedCards.value.length < MAX_SELECTED) {
    card.selected = true
  }
}

export function sortByRank() {
  const rankOrder: Record<Rank, number> = {
    A: 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13
  }
  game.handCards.sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])
}

export function sortBySuit() {
  const suitOrder: Record<Suit, number> = { '♠': 0, '♥': 1, '♦': 2, '♣': 3 }
  game.handCards.sort((a, b) => {
    const sd = suitOrder[a.suit] - suitOrder[b.suit]
    if (sd !== 0) return sd
    const rankOrder: Record<Rank, number> = {
      A: 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
      '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13
    }
    return rankOrder[b.rank] - rankOrder[a.rank]
  })
}

// Returns the dealt cards (for animation)
function dealNewCards(count: number): Card[] {
  const newCards: Card[] = []
  for (let i = 0; i < count; i++) {
    if (game.deck.length === 0) {
      // Reshuffle discard back into deck
      const newDeck = shuffle(createDeck())
      game.deck = newDeck
    }
    const card = game.deck.splice(0, 1)[0]
    if (card) {
      card.selected = false
      newCards.push(card)
    }
  }
  return newCards
}

export async function handlePlay(onAnimate?: (result: HandResult, played: Card[]) => Promise<void>) {
  if (game.animating) return
  const sel = selectedCards.value
  if (sel.length === 0) return

  game.animating = true
  game.playedCards = [...sel]

  // Remove selected from hand
  game.handCards = game.handCards.filter(c => !c.selected)

  const result = scoreHand(game.playedCards, game.ownedJokers)
  game.lastHandResult = result
  game.handsLeft--

  // Run animation if provided
  if (onAnimate) {
    await onAnimate(result, game.playedCards)
  }

  game.roundScore += result.finalScore

  // Deal replacement cards
  const newCards = dealNewCards(sel.length)
  game.handCards = [...game.handCards, ...newCards]
  // Clear selections
  game.handCards.forEach(c => c.selected = false)

  game.animating = false

  // Check win/lose
  checkEndCondition()
}

export async function handleDiscard(onAnimate?: (discarded: Card[]) => Promise<void>) {
  if (game.animating) return
  if (game.discardsLeft === 0) return
  const sel = selectedCards.value
  if (sel.length === 0) return

  game.animating = true
  const discarded = [...sel]
  game.handCards = game.handCards.filter(c => !c.selected)
  game.discardsLeft--

  if (onAnimate) {
    await onAnimate(discarded)
  }

  const newCards = dealNewCards(discarded.length)
  game.handCards = [...game.handCards, ...newCards]
  game.handCards.forEach(c => c.selected = false)
  game.animating = false
}

function checkEndCondition() {
  const blind = BLINDS[game.currentBlindIndex]
  if (game.roundScore >= blind.target) {
    // Win this blind
    const reward = blind.reward + game.handsLeft
    game.gold += reward

    if (game.currentBlindIndex >= BLINDS.length - 1) {
      // Beat the last blind
      game.phase = 'won'
    } else {
      // Go to shop
      game.shopJokers = pickShopJokers(game.ownedJokers)
      game.phase = 'shop'
    }
  } else if (game.handsLeft <= 0) {
    // Out of hands
    game.phase = 'lost'
  }
}

export function buyJoker(joker: JokerDef) {
  if (game.gold < joker.price) return
  if (game.ownedJokers.length >= 5) return
  game.gold -= joker.price
  game.ownedJokers.push(joker)
  // Remove from shop
  game.shopJokers = game.shopJokers.filter(j => j.id !== joker.id)
}

export function proceedToNextBlind() {
  game.currentBlindIndex++
  game.currentRound++
  game.phase = 'playing'
  freshBlindState(game)
}

export function restartGame() {
  game.phase = 'playing'
  game.currentBlindIndex = 0
  game.currentRound = 1
  game.roundScore = 0
  game.gold = 4
  game.ownedJokers = []
  game.shopJokers = []
  game.lastHandResult = null
  game.animating = false
  game.triggeredJokerIndex = -1

  const deck = shuffle(createDeck())
  game.handCards = deck.splice(0, HAND_SIZE)
  game.deck = deck
  game.playedCards = []
  game.handsLeft = MAX_HANDS
  game.discardsLeft = MAX_DISCARDS
}

// ─── AI helper ────────────────────────────────────────────────────────────────

// Enumerate all subsets size 1..5, find the highest scoring one
export function aiBestPlay(hand: Card[], ownedJokers: JokerDef[]): Card[] {
  let bestScore = -1
  let bestSubset: Card[] = []

  function enumerate(start: number, current: Card[]) {
    if (current.length > 0) {
      const { finalScore } = scoreHand(current, ownedJokers)
      if (finalScore > bestScore) {
        bestScore = finalScore
        bestSubset = [...current]
      }
    }
    if (current.length === MAX_SELECTED) return
    for (let i = start; i < hand.length; i++) {
      enumerate(i + 1, [...current, hand[i]])
    }
  }

  enumerate(0, [])
  return bestSubset
}
