<script setup lang="ts">
import { ref, computed } from 'vue'
import { game, buyJoker, proceedToNextBlind } from '../composables/useGame'
import JokerCard from './JokerCard.vue'
import SideBar from './SideBar.vue'

const recommendedId = ref<string | null>(null)

function getAIRecommendation() {
  if (game.shopJokers.length === 0) return
  // Pick joker with best value-per-dollar (simple heuristic: lower price first among affordable)
  const affordable = game.shopJokers.filter(j =>
    game.gold >= j.price && !game.ownedJokers.find(o => o.id === j.id)
  )
  if (affordable.length === 0) return
  const best = affordable.reduce((a, b) => a.price <= b.price ? a : b)
  recommendedId.value = best.id
}

function canBuy(jokerId: string) {
  const joker = game.shopJokers.find(j => j.id === jokerId)
  if (!joker) return false
  return game.gold >= joker.price && game.ownedJokers.length < 5
}

function btnText(joker: { id: string; price: number }) {
  if (game.ownedJokers.length >= 5) return '槽满了'
  if (game.gold < joker.price) return '钱不够'
  return `购买 $${joker.price}`
}

// Keep a snapshot of shop jokers for display (since bought ones are removed)
const allShopJokers = computed(() => game.shopJokers)
</script>

<template>
  <div class="shop-layout">
    <SideBar />
    <div class="shop-main">
      <div class="shop-header">
        <h1 class="shop-title font-inter">商店</h1>
        <p class="shop-subtitle font-inter">
          通关奖励到账！金币 ${{ game.gold }} · Joker 槽 {{ game.ownedJokers.length }}/5
        </p>
      </div>

      <div class="shop-jokers">
        <div
          v-for="joker in allShopJokers"
          :key="joker.id"
          class="shop-joker-item"
          :class="{ recommended: recommendedId === joker.id }"
        >
          <JokerCard :joker="joker" size="shop" />
          <button
            class="px-btn buy-btn font-inter"
            :disabled="!canBuy(joker.id)"
            @click="buyJoker(joker)"
          >
            {{ btnText(joker) }}
          </button>
        </div>
      </div>

      <div class="shop-footer">
        <button class="px-btn ai-btn font-inter" @click="getAIRecommendation">
          🤖 AI 建议
        </button>
        <button class="px-btn skip-btn font-inter" @click="proceedToNextBlind">
          跳过 →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.shop-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  background: rgba(5,8,24,0.5);
}

.shop-header {
  text-align: center;
}

.shop-title {
  font-size: 32px;
  font-weight: 900;
  color: var(--gold);
  margin-bottom: 8px;
}

.shop-subtitle {
  font-size: 15px;
  color: var(--muted);
  font-weight: 600;
}

.shop-jokers {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.shop-joker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.shop-joker-item.recommended {
  filter: drop-shadow(0 0 12px rgba(255,200,87,0.8));
}

.buy-btn {
  width: 140px;
  min-height: 44px;
  font-size: 13px;
  padding: 10px 12px;
  background: linear-gradient(180deg, #818cf8, #6366f1, #4338ca);
  box-shadow: 0 4px 0 #312e81;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.buy-btn:disabled {
  background: rgba(74,107,255,0.2);
  box-shadow: none;
  color: var(--muted);
  cursor: not-allowed;
  opacity: 0.7;
}

.buy-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.buy-btn:active:not(:disabled) {
  transform: translateY(2px);
}

.shop-footer {
  display: flex;
  gap: 16px;
  align-items: center;
}

.ai-btn {
  background: linear-gradient(180deg, #c084fc, #a855f7, #7e22ce);
  box-shadow: 0 4px 0 #581c87;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.skip-btn {
  background: linear-gradient(180deg, #818cf8, #6366f1, #4338ca);
  box-shadow: 0 5px 0 #312e81;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  min-width: 160px;
  transition: all 0.15s ease;
}

.skip-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.skip-btn:active {
  transform: translateY(2px);
}
</style>
