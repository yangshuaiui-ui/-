<script setup lang="ts">
import { computed, ref } from 'vue'
import { game, currentBlind, progressPct, BLINDS, restartGame } from '../composables/useGame'

const chipsEl = ref<HTMLElement | null>(null)
const multEl = ref<HTMLElement | null>(null)

defineExpose({ chipsEl, multEl })

const blindTypeName = computed(() => {
  const idx = game.currentBlindIndex
  return ['小盲注', '中盲注', '大盲注'][idx] ?? '小盲注'
})

const reward = computed(() => currentBlind.value.reward + game.handsLeft)
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="logo font-press">🃏 小丑牌</div>

    <!-- Blind panel -->
    <div class="sb-panel">
      <div class="sb-label font-inter">盲注 {{ game.currentBlindIndex + 1 }}/{{ BLINDS.length }}</div>
      <div class="blind-info">
        <span class="blind-icon">{{ currentBlind.icon }}</span>
        <div>
          <div class="blind-name font-inter">{{ blindTypeName }}</div>
          <div class="blind-reward font-inter">通关奖励 +${{ reward }}</div>
        </div>
      </div>
      <div class="inset-box">
        <div class="sb-label font-inter">目标至少</div>
        <div class="target-score font-vt323">{{ currentBlind.target }}</div>
      </div>
    </div>

    <!-- Round Score -->
    <div class="sb-panel">
      <div class="sb-label font-inter">Round score</div>
      <div class="round-score font-vt323">{{ game.roundScore }}</div>
      <div class="progress-bar" style="margin-top:6px">
        <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
    </div>

    <!-- HAND score block -->
    <div class="sb-panel hand-score-panel">
      <div class="hand-type-name font-inter" :class="{ empty: !game.lastHandResult }">
        {{ game.lastHandResult?.type ?? '— 选牌出牌 —' }}
      </div>
      <div class="score-row">
        <div class="chips-block" ref="chipsEl">
          <div class="score-num font-press">{{ game.lastHandResult?.totalChips ?? 0 }}</div>
          <div class="score-unit font-inter">筹码</div>
        </div>
        <div class="score-x font-press">×</div>
        <div class="mult-block" ref="multEl">
          <div class="score-num font-press">{{ game.lastHandResult?.totalMult ?? 0 }}</div>
          <div class="score-unit font-inter">倍率</div>
        </div>
      </div>
    </div>

    <!-- Hands / Discards -->
    <div class="hands-row">
      <div class="sb-panel hand-panel">
        <div class="sb-label font-inter">手数</div>
        <div class="hand-num font-vt323 green">{{ game.handsLeft }}</div>
      </div>
      <div class="sb-panel hand-panel">
        <div class="sb-label font-inter">弃牌</div>
        <div class="hand-num font-vt323 red">{{ game.discardsLeft }}</div>
      </div>
    </div>

    <!-- Gold -->
    <div class="sb-panel gold-panel">
      <span class="dollar font-press">$</span>
      <span class="gold-num font-vt323">{{ game.gold }}</span>
    </div>

    <!-- Ante / Round -->
    <div class="ante-row font-inter">
      <span class="ante-text">底注 {{ game.currentBlindIndex + 1 }}/3</span>
      <span class="sep">·</span>
      <span class="round-text">回合 {{ game.currentBlindIndex + 1 }}</span>
    </div>

    <!-- Restart -->
    <button class="px-btn btn-restart font-inter" @click="restartGame">重新开始</button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: min(28vw, 480px);
  min-width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1a2a5a, #111e44);
  border-right: 2px solid rgba(74,107,255,0.4);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 10px 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.logo {
  font-size: 13px;
  color: var(--gold);
  letter-spacing: 1px;
  text-shadow: 2px 2px 0 #000;
  text-align: center;
  padding: 4px 0;
}

.sb-panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(74,107,255,0.25);
  border-radius: 10px;
  padding: 8px 10px;
}

.sb-label {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.5px;
  margin-bottom: 3px;
  font-weight: 600;
}

.blind-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.blind-icon { font-size: 20px; }

.blind-name {
  font-size: 14px;
  font-weight: 800;
  color: white;
}

.blind-reward {
  font-size: 11px;
  color: var(--gold);
  font-weight: 600;
}

.inset-box {
  background: #050818;
  border: 1px solid rgba(74,107,255,0.3);
  border-radius: 6px;
  padding: 5px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.target-score {
  font-size: 26px;
  color: var(--gold);
  line-height: 1;
}

.round-score {
  font-size: 42px;
  color: #4dd6ff;
  line-height: 1;
}

.hand-score-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hand-type-name {
  font-size: 13px;
  font-weight: 800;
  color: #4dd6ff;
  text-align: center;
}

.hand-type-name.empty { color: var(--muted); font-weight: 600; }

.score-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chips-block {
  flex: 1;
  background: linear-gradient(135deg, var(--chips-from), var(--chips-to));
  border-radius: 8px;
  padding: 6px 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 0 #0d4a80;
  border: 1px solid #1a7bd4;
}

.mult-block {
  flex: 1;
  background: linear-gradient(135deg, var(--mult-from), var(--mult-to));
  border-radius: 8px;
  padding: 6px 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3px 0 #8b1a1a;
  border: 1px solid #cc2233;
}

.score-num {
  font-size: 20px;
  color: rgba(0,5,20,0.9);
  line-height: 1;
}

.score-unit {
  font-size: 8px;
  color: rgba(0,0,0,0.55);
  font-weight: 700;
  margin-top: 2px;
}

.score-x {
  font-size: 12px;
  color: var(--text);
  flex-shrink: 0;
}

.hands-row {
  display: flex;
  gap: 6px;
}

.hand-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hand-num {
  font-size: 32px;
  line-height: 1;
}

.hand-num.green { color: #62d18b; }
.hand-num.red { color: #ff5544; }

.gold-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #050818;
  border: 1px solid rgba(74,107,255,0.3);
}

.dollar {
  font-size: 13px;
  color: var(--gold);
}

.gold-num {
  font-size: 40px;
  color: var(--money, #ffb030);
  line-height: 1;
}

.ante-row {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
}

.ante-text { color: var(--gold); }
.sep { color: var(--muted); margin: 0 5px; }
.round-text { color: #4dd6ff; }
</style>
