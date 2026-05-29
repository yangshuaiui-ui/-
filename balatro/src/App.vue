<script setup lang="ts">
import { ref } from 'vue'
import { game, selectedCards, handlePlay, handleDiscard, aiBestPlay } from './composables/useGame'
import { sleep, flyElementToTarget, flyTextTo } from './composables/useAnimation'
import { speedMultiplier } from './composables/useSettings'
import SideBar from './components/SideBar.vue'
import JokerArea from './components/JokerArea.vue'
import PlayArea from './components/PlayArea.vue'
import HandArea from './components/HandArea.vue'
import ShopView from './components/ShopView.vue'
import EndView from './components/EndView.vue'
import SettingsModal from './components/SettingsModal.vue'

// Component refs
const sidebarComp = ref<InstanceType<typeof SideBar>>()
const playAreaComp = ref<InstanceType<typeof PlayArea>>()
const handAreaComp = ref<InstanceType<typeof HandArea>>()
const jokerAreaComp = ref<InstanceType<typeof JokerArea>>()

// UI state
const showSettings = ref(false)
const aiThinking = ref(false)
const centralScore = ref<{ chips: number; mult: number; score: number } | null>(null)

// ─── Play handler ────────────────────────────────────────────────────────────

async function onPlay() {
  if (game.animating || game.phase !== 'playing') return
  const sel = selectedCards.value
  if (sel.length === 0) return

  await handlePlay(async (result, played) => {
    const playAreaEl = playAreaComp.value?.playAreaEl
    const chipsEl = sidebarComp.value?.chipsEl
    const multEl = sidebarComp.value?.multEl

    // Step 1: Fly selected cards to play area (cards are already moved in game state)
    // We animate via GSAP flying of card wrappers
    const cardEls = (handAreaComp.value?.cardRefs ?? []).filter((el): el is HTMLElement => !!el)

    // At this point game.handCards no longer has the played cards, so we approximate
    // by flying the first N visible card positions
    if (playAreaEl && cardEls.length > 0) {
      const flyPromises = cardEls.slice(0, Math.min(played.length, cardEls.length)).map(el =>
        flyElementToTarget(el, playAreaEl, 0.35 * speedMultiplier.value)
      )
      await Promise.all(flyPromises)
    } else {
      await sleep(350)
    }

    // Step 2: Show hand type
    await sleep(200)

    // Step 3: Fly chips score text to chips block
    if (chipsEl) {
      const playAreaEl2 = playAreaComp.value?.playAreaEl
      if (playAreaEl2) {
        const chipsVal = result.baseChips + result.cardSum
        flyTextTo(`+${chipsVal}`, playAreaEl2, chipsEl, '#4dd6ff')
      }
    }
    await sleep(150 * played.length)

    // Step 4: Joker triggers
    const jokerRefs = jokerAreaComp.value?.jokerRefs ?? []
    for (let i = 0; i < game.ownedJokers.length; i++) {
      const jokerEl = jokerRefs[i]
      if (!jokerEl) continue

      // Add trigger class
      jokerEl.classList.add('joker-trigger')
      setTimeout(() => jokerEl.classList.remove('joker-trigger'), 800 * speedMultiplier.value)

      // Fly mult text
      if (multEl) {
        flyTextTo(`+mult`, jokerEl, multEl, '#ff8844')
      }
      await sleep(300)
    }

    // Step 5: Show central score formula
    centralScore.value = {
      chips: result.totalChips,
      mult: result.totalMult,
      score: result.finalScore,
    }
    await sleep(1800)
    centralScore.value = null

    // Step 6: blindScore counter will be updated by game state after this callback
  })
}

// ─── Discard handler ─────────────────────────────────────────────────────────

async function onDiscard() {
  if (game.animating || game.phase !== 'playing') return
  const sel = selectedCards.value
  if (sel.length === 0 || game.discardsLeft === 0) return

  await handleDiscard(async () => {
    await sleep(200)
  })
}

// ─── AI play handler ──────────────────────────────────────────────────────────

async function onAIPlay() {
  if (game.animating || aiThinking.value) return
  aiThinking.value = true

  await sleep(800)

  const best = aiBestPlay(game.handCards, game.ownedJokers)

  // Set selection
  game.handCards.forEach(c => { c.selected = false })
  best.forEach(c => { c.selected = true })

  await sleep(200)
  aiThinking.value = false
  await onPlay()
}
</script>

<template>
  <div id="app-root">
    <!-- Settings button (always visible) -->
    <button
      class="px-btn btn-settings settings-float"
      @click="showSettings = true"
      title="设置"
    >⚙️</button>

    <!-- Settings modal -->
    <SettingsModal v-if="showSettings" @close="showSettings = false" />

    <!-- Playing phase -->
    <template v-if="game.phase === 'playing'">
      <div class="game-layout">
        <SideBar ref="sidebarComp" />
        <div class="main-area">
          <JokerArea ref="jokerAreaComp" />
          <PlayArea ref="playAreaComp" :centralScore="centralScore" />
          <HandArea
            ref="handAreaComp"
            :aiThinking="aiThinking"
            @play="onPlay"
            @discard="onDiscard"
            @aiPlay="onAIPlay"
          />
        </div>
      </div>
    </template>

    <!-- Shop phase -->
    <template v-else-if="game.phase === 'shop'">
      <ShopView />
    </template>

    <!-- End phase -->
    <template v-else>
      <EndView />
    </template>
  </div>
</template>

<style>
#app-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.settings-float {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 900;
  cursor: pointer;
}

.game-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: grid;
  grid-template-rows: 230px 1fr 280px;
  height: 100vh;
  overflow: hidden;
  min-width: 0;
}
</style>
