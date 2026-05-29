<script setup lang="ts">
import { ref } from 'vue'
import { game } from '../composables/useGame'
import PlayingCard from './PlayingCard.vue'
import { settings } from '../composables/useSettings'

const playAreaEl = ref<HTMLElement | null>(null)
const deckEl = ref<HTMLElement | null>(null)

defineExpose({ playAreaEl, deckEl })

const props = defineProps<{
  centralScore: { chips: number; mult: number; score: number } | null
}>()
</script>

<template>
  <section class="play-area" ref="playAreaEl">
    <!-- Top label -->
    <div class="play-header">
      <span class="play-label font-inter">出牌区</span>
      <span v-if="game.lastHandResult" class="hand-name-display font-inter">{{ game.lastHandResult.type }}</span>
    </div>

    <!-- Played cards or empty state -->
    <div class="played-cards" v-if="game.playedCards.length > 0">
      <PlayingCard
        v-for="card in game.playedCards"
        :key="card.id"
        :card="card"
      />
    </div>
    <div class="empty-hint" v-else>
      <template v-if="settings.showFormulaPreview && game.lastHandResult">
        <span class="formula-preview font-press">
          <span class="chips-color">{{ game.lastHandResult.totalChips }}</span>
          <span class="x-color"> × </span>
          <span class="mult-color">{{ game.lastHandResult.totalMult }}</span>
          <span class="x-color"> = </span>
          <span class="score-color">{{ game.lastHandResult.finalScore }}</span>
        </span>
      </template>
      <template v-else>
        <span class="empty-text font-inter">选择手牌组成牌型（1-5 张）</span>
      </template>
    </div>

    <!-- Central score popup -->
    <div v-if="centralScore" class="central-score">
      <div class="cs-formula font-press">
        <span class="chips-color">{{ centralScore.chips }}</span>
        <span class="x-color"> × </span>
        <span class="mult-color">{{ centralScore.mult }}</span>
        <span class="eq-color"> = </span>
        <span class="score-color">{{ centralScore.score }}</span>
      </div>
    </div>

    <!-- Deck pile (absolute bottom-right) -->
    <div class="deck-pile" ref="deckEl">
      <div class="deck-layer layer-3"></div>
      <div class="deck-layer layer-2"></div>
      <div class="deck-layer layer-1"></div>
      <div class="deck-count font-vt323">{{ game.deck.length }}/52</div>
    </div>
  </section>
</template>

<style scoped>
.play-area {
  flex: 1;
  background: rgba(5, 8, 24, 0.5);
  border-bottom: 1px solid rgba(74,107,255,0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 8px;
  overflow: hidden;
}

.play-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.play-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.hand-name-display {
  font-size: 15px;
  font-weight: 800;
  color: #4dd6ff;
}

.played-cards {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
  padding-top: 8px;
}

.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.empty-text {
  font-size: 13px;
  color: var(--muted);
  opacity: 0.55;
}

.formula-preview {
  font-size: 14px;
}

.chips-color { color: #4dd6ff; }
.mult-color { color: #ff8844; }
.x-color { color: var(--text); }
.eq-color { color: var(--text); }
.score-color { color: var(--gold); }

.central-score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  animation: centralScore 2s ease forwards;
  pointer-events: none;
  text-align: center;
  white-space: nowrap;
}

@keyframes centralScore {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
  15% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  40% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}

.cs-formula {
  font-size: 22px;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(255,200,87,0.5);
  padding: 8px 16px;
  background: rgba(5,8,24,0.85);
  border-radius: 12px;
  border: 1px solid rgba(255,200,87,0.3);
}

/* Deck pile */
.deck-pile {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 60px;
  height: 88px;
  z-index: 2;
  pointer-events: none;
}

.deck-layer {
  position: absolute;
  border-radius: 6px;
  border: 2px solid #1a0f24;
  background: linear-gradient(135deg, #6b3ec9, #2d0d6e);
}

.layer-3 {
  inset: 0;
  transform: translate(-6px, 6px);
  opacity: 0.5;
}

.layer-2 {
  inset: 0;
  transform: translate(-3px, 3px);
  opacity: 0.75;
}

.layer-1 {
  inset: 0;
}

.deck-count {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: var(--gold);
  white-space: nowrap;
}
</style>
