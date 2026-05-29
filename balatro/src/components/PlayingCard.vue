<script setup lang="ts">
import type { Card } from '../composables/useGame'

const props = defineProps<{
  card: Card
  size?: 'normal' | 'small'
}>()

const isRed = (card: Card) => card.suit === '♥' || card.suit === '♦'

function rankDisplay(rank: string) {
  return rank
}
</script>

<template>
  <div
    class="playing-card"
    :class="{
      selected: card.selected,
      'red-suit': isRed(card),
      'black-suit': !isRed(card),
      small: size === 'small',
    }"
  >
    <div class="card-corner top-left">
      <div class="card-rank">{{ rankDisplay(card.rank) }}</div>
      <div class="card-suit-sm">{{ card.suit }}</div>
    </div>
    <div class="card-center-suit">{{ card.suit }}</div>
    <div class="card-corner bottom-right">
      <div class="card-rank">{{ rankDisplay(card.rank) }}</div>
      <div class="card-suit-sm">{{ card.suit }}</div>
    </div>
  </div>
</template>

<style scoped>
.playing-card.small {
  width: 70px;
  height: 100px;
}

.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  font-weight: 800;
}

.top-left { top: 5px; left: 6px; }

.bottom-right {
  bottom: 5px;
  right: 6px;
  transform: rotate(180deg);
}

.card-rank {
  font-size: 14px;
  font-weight: 900;
  font-family: 'Inter', 'PingFang SC', sans-serif;
  line-height: 1;
}

.small .card-rank { font-size: 10px; }

.card-suit-sm {
  font-size: 11px;
  line-height: 1;
}

.small .card-suit-sm { font-size: 8px; }

.card-center-suit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  line-height: 1;
  opacity: 0.25;
  pointer-events: none;
}

.small .card-center-suit { font-size: 24px; }
</style>
