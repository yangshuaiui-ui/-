import { reactive, computed } from 'vue'

interface Settings {
  bgmVolume: number
  sfxVolume: number
  animSpeed: 'slow' | 'normal' | 'fast'
  showFormulaPreview: boolean
}

const STORAGE_KEY = 'balatro.settings'

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings(), ...JSON.parse(raw) }
  } catch {}
  return defaultSettings()
}

function defaultSettings(): Settings {
  return { bgmVolume: 50, sfxVolume: 70, animSpeed: 'normal', showFormulaPreview: true }
}

export const settings = reactive<Settings>(loadSettings())

export const speedMultiplier = computed(() => {
  if (settings.animSpeed === 'slow') return 1.5
  if (settings.animSpeed === 'fast') return 0.6
  return 1
})

export function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings }))
}
