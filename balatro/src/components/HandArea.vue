<script setup lang="ts">
import { ref, computed } from 'vue'
import { game, toggleCard, sortByRank, sortBySuit, selectedCards } from '../composables/useGame'
import PlayingCard from './PlayingCard.vue'

const emit = defineEmits<{
  play: []
  discard: []
  aiPlay: []
}>()

const cardRefs = ref<(HTMLElement | null)[]>([])

function setCardRef(el: HTMLElement | null, idx: number) {
  cardRefs.value[idx] = el
}

defineExpose({ cardRefs })

const selectedCount = computed(() => selectedCards.value.length)
const canPlay = computed(() => selectedCount.value > 0 && !game.animating)
const canDiscard = computed(() => selectedCount.value > 0 && game.discardsLeft > 0 && !game.animating)

const props = defineProps<{
  aiThinking: boolean
}>()
</script>

<template>
  <section class="hand-area">
    <!-- Header -->
    <div class="hand-header">
      <span class="hand-title font-inter">手牌</span>
      <span class="selected-count font-inter">已选 {{ selectedCount }} / 5 张</span>
    </div>

    <!-- Hand cards -->
    <div class="hand-cards">
      <div
        v-for="(card, i) in game.handCards"
        :key="card.id"
        :ref="(el) => setCardRef(el as HTMLElement, i)"
        class="card-wrapper"
        @click="toggleCard(card)"
      >
        <PlayingCard :card="card" />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="action-row">
      <button
        class="px-btn btn-play font-inter"
        :disabled="!canPlay"
        @click="emit('play')"
      >
        出牌 ({{ selectedCount }})
      </button>

      <button
        class="px-btn btn-discard font-inter"
        :disabled="!canDiscard"
        @click="emit('discard')"
      >
        弃牌 ({{ game.discardsLeft }})
      </button>

      <button class="px-btn btn-sort font-inter" @click="sortByRank" :disabled="game.animating">
        按点排序
      </button>
      <button class="px-btn btn-sort font-inter" @click="sortBySuit" :disabled="game.animating">
        按花排序
      </button>

      <div class="spacer"></div>

      <button
        class="px-btn btn-ai font-inter"
        :class="{ 'btn-ai-thinking': aiThinking }"
        :disabled="aiThinking || game.animating"
        @click="emit('aiPlay')"
      >
        {{ aiThinking ? '🤔 AI 思考中…' : '🤖 AI 出牌' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.hand-area {
  height: 280px;
  background: rgba(10, 15, 35, 0.4);
  display: flex;
  flex-direction: column;
  padding: 8px 16px 10px;
  overflow: hidden;
}

.hand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.hand-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
}

.selected-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.hand-cards {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: flex-end;
  flex: 1;
  padding-top: 36px;
  overflow: hidden;
}

.card-wrapper {
  cursor: pointer;
  flex-shrink: 0;
}

.action-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  padding-right: 130px;
}

.px-btn {
  font-size: 14px;
  min-height: 44px;
  padding: 10px 14px;
}

.spacer { flex: 1; }
</style>
