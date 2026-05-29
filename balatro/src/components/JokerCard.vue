<script setup lang="ts">
import type { JokerDef } from '../composables/useGame'

defineProps<{
  joker: JokerDef
  triggered?: boolean
  size?: 'normal' | 'shop'
}>()

const rarityColor: Record<string, string> = {
  common: '#6cb4d3',
  rare: '#e34b6f',
  legendary: '#b577ff',
}

const rarityLabel: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  legendary: '传说',
}
</script>

<template>
  <div
    class="joker-card"
    :class="[joker.rarity, { 'joker-trigger': triggered }, size === 'shop' ? 'shop-size' : '']"
  >
    <div class="rarity-badge" :style="{ color: rarityColor[joker.rarity] }">
      {{ rarityLabel[joker.rarity] }}
    </div>
    <div class="joker-art">{{ joker.art }}</div>
    <div class="joker-name">{{ joker.name }}</div>
    <div class="joker-desc">{{ joker.description }}</div>
    <div class="joker-price">${{ joker.price }}</div>
  </div>
</template>

<style scoped>
.joker-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 6px 6px;
  user-select: none;
}

.shop-size {
  width: 140px;
  height: 200px;
}

.rarity-badge {
  font-size: 8px;
  font-weight: 700;
  font-family: 'Inter', 'PingFang SC', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.joker-art {
  font-size: 52px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.shop-size .joker-art {
  font-size: 52px;
}

.joker-name {
  font-size: 9px;
  font-weight: 800;
  font-family: 'Inter', 'PingFang SC', sans-serif;
  color: #1a0f24;
  text-align: center;
  line-height: 1.2;
}

.joker-desc {
  font-size: 7px;
  color: #4a3a2a;
  text-align: center;
  line-height: 1.3;
  padding: 0 4px;
  font-family: 'Inter', 'PingFang SC', sans-serif;
}

.joker-price {
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  color: #2a6b2a;
  margin-top: 2px;
}
</style>
