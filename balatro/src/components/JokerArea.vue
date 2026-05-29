<script setup lang="ts">
import { ref } from 'vue'
import { game } from '../composables/useGame'
import JokerCard from './JokerCard.vue'

const jokerRefs = ref<(HTMLElement | null)[]>([])

function setJokerRef(el: HTMLElement | null, idx: number) {
  jokerRefs.value[idx] = el
}

defineExpose({ jokerRefs })

const MAX_JOKERS = 5
</script>

<template>
  <section class="joker-area">
    <div class="joker-header">
      <span class="font-press joker-title">JOKERS · {{ game.ownedJokers.length }}/{{ MAX_JOKERS }}</span>
    </div>
    <div class="joker-row">
      <template v-for="(joker, i) in game.ownedJokers" :key="joker.id">
        <div
          :ref="(el) => setJokerRef(el as HTMLElement, i)"
          class="joker-wrapper"
        >
          <JokerCard :joker="joker" />
        </div>
      </template>
      <template v-for="i in (MAX_JOKERS - game.ownedJokers.length)" :key="`empty-${i}`">
        <div class="joker-slot-empty">
          <span class="empty-plus font-inter">+</span>
          <span class="empty-label font-inter">空槽</span>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.joker-area {
  height: 230px;
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid rgba(74,107,255,0.2);
  display: flex;
  flex-direction: column;
  padding: 10px 16px 8px;
  overflow: hidden;
}

.joker-header {
  margin-bottom: 10px;
}

.joker-title {
  font-size: 12px;
  color: var(--gold);
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #000;
}

.joker-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  flex: 1;
  overflow-x: auto;
}

.joker-wrapper {
  flex-shrink: 0;
}

.joker-slot-empty {
  flex-shrink: 0;
}

.empty-plus {
  font-size: 22px;
  color: var(--muted);
  opacity: 0.6;
}

.empty-label {
  font-size: 11px;
  color: var(--muted);
  opacity: 0.6;
}
</style>
