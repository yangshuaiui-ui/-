<script setup lang="ts">
import { settings, saveSettings } from '../composables/useSettings'

const emit = defineEmits<{ close: [] }>()

function close() {
  saveSettings()
  emit('close')
}

const speedOptions = [
  { value: 'slow', label: '慢' },
  { value: 'normal', label: '普通' },
  { value: 'fast', label: '快' },
] as const
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <div class="modal-title font-inter">设置</div>

      <div class="settings-list">
        <!-- BGM volume -->
        <div class="setting-row">
          <label class="setting-label font-inter">BGM 音量</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model="settings.bgmVolume"
            @change="saveSettings"
            class="setting-range"
            style="accent-color: #4dd6ff"
          />
        </div>

        <!-- SFX volume -->
        <div class="setting-row">
          <label class="setting-label font-inter">SFX 音量</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model="settings.sfxVolume"
            @change="saveSettings"
            class="setting-range"
            style="accent-color: #ff8844"
          />
        </div>

        <!-- Animation speed -->
        <div class="setting-row">
          <label class="setting-label font-inter">动画速度</label>
          <div class="speed-options">
            <button
              v-for="opt in speedOptions"
              :key="opt.value"
              class="speed-btn font-inter"
              :class="{ active: settings.animSpeed === opt.value }"
              @click="settings.animSpeed = opt.value; saveSettings()"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Formula preview toggle -->
        <div class="setting-row">
          <label class="setting-label font-inter">显示出牌公式预览</label>
          <div
            class="toggle-switch"
            :class="{ active: settings.showFormulaPreview }"
            @click="settings.showFormulaPreview = !settings.showFormulaPreview; saveSettings()"
          >
            <div class="toggle-knob"></div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="close-btn font-inter" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--gold);
  text-align: center;
  margin-bottom: 20px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.setting-label {
  font-size: 13px;
  color: #c9d2e8;
  font-weight: 600;
  flex-shrink: 0;
}

.setting-range {
  width: 140px;
}

.speed-options {
  display: flex;
  gap: 4px;
}

.speed-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(74,107,255,0.3);
  background: rgba(74,107,255,0.1);
  color: var(--muted);
  transition: all 0.15s ease;
}

.speed-btn.active {
  background: var(--sb-blue);
  color: white;
  border-color: var(--sb-blue);
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.close-btn {
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(180deg, #818cf8, #6366f1, #4338ca);
  box-shadow: 0 4px 0 #312e81;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>
