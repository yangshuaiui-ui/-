<script setup lang="ts">
import { game, restartGame } from '../composables/useGame'
import JokerCard from './JokerCard.vue'
</script>

<template>
  <div class="end-screen">
    <div class="end-card">
      <div v-if="game.phase === 'won'" class="end-title won font-inter">🎉 通关全部</div>
      <div v-else class="end-title lost font-inter">💀 失败</div>

      <div class="end-stats">
        <div class="stat font-inter">
          <span class="stat-label">最终金币</span>
          <span class="stat-value font-vt323">${{ game.gold }}</span>
        </div>
        <div class="stat font-inter">
          <span class="stat-label">到达第</span>
          <span class="stat-value font-vt323">{{ game.currentBlindIndex + 1 }}/3 关</span>
        </div>
      </div>

      <div v-if="game.ownedJokers.length > 0" class="owned-jokers">
        <div class="owned-label font-inter">持有的 Joker</div>
        <div class="joker-list">
          <JokerCard
            v-for="joker in game.ownedJokers"
            :key="joker.id"
            :joker="joker"
          />
        </div>
      </div>

      <button class="px-btn btn-discard restart-btn font-inter" @click="restartGame">
        重新开始
      </button>
    </div>
  </div>
</template>

<style scoped>
.end-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-card {
  background: linear-gradient(180deg, #1a2858, #0a1438);
  border: 2px solid var(--sb-blue);
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  min-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

.end-title {
  font-size: 36px;
  font-weight: 900;
  text-align: center;
}

.end-title.won { color: var(--gold); }
.end-title.lost { color: #ef4444; }

.end-stats {
  display: flex;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.stat-value {
  font-size: 32px;
  color: var(--gold);
  line-height: 1;
}

.owned-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.joker-list {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.restart-btn {
  width: 200px;
  min-height: 52px;
  font-size: 16px;
}
</style>
