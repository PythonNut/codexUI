<template>
  <span
    v-if="usedPercent !== null"
    class="context-usage-ring"
    :title="tooltipText"
    :style="ringStyle"
  >
    <svg class="context-usage-ring-svg" viewBox="0 0 30 30">
      <circle class="context-usage-ring-track" cx="15" cy="15" r="13" />
      <circle
        class="context-usage-ring-progress"
        cx="15"
        cy="15"
        r="13"
        :stroke-dasharray="CONTEXT_RING_CIRCUMFERENCE"
        :stroke-dashoffset="contextUsageRingDashOffset"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ContextUsageTone = 'healthy' | 'warning' | 'danger'

const props = defineProps<{
  usedPercent: number | null
  tone?: ContextUsageTone
  tooltipText?: string
}>()

const CONTEXT_RING_RADIUS = 13
const CONTEXT_RING_CIRCUMFERENCE = 2 * Math.PI * CONTEXT_RING_RADIUS

const normalizedUsedPercent = computed(() => {
  if (typeof props.usedPercent !== 'number' || !Number.isFinite(props.usedPercent)) return null
  return Math.max(0, Math.min(100, props.usedPercent))
})

const ringStyle = computed<Record<string, string>>(() => {
  const tone = props.tone ?? 'healthy'
  const color = tone === 'danger'
    ? 'rgb(239 68 68)'
    : tone === 'warning'
      ? 'rgb(245 158 11)'
      : 'rgb(34 197 94)'

  return {
    '--context-ring-color': color,
  }
})

const contextUsageRingDashOffset = computed(() => {
  if (normalizedUsedPercent.value === null) return `${CONTEXT_RING_CIRCUMFERENCE}`
  return `${CONTEXT_RING_CIRCUMFERENCE * (1 - normalizedUsedPercent.value / 100)}`
})
</script>

<style scoped>
.context-usage-ring {
  @apply pointer-events-none absolute inline-flex items-center justify-center;
  inset: -0.125rem;
}

.context-usage-ring-svg {
  @apply block h-full w-full;
  transform: rotate(-90deg);
}

.context-usage-ring-track {
  fill: none;
  stroke: rgb(113 113 122 / 0.34);
  stroke-width: 2;
}

.context-usage-ring-progress {
  fill: none;
  stroke: var(--context-ring-color);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dashoffset 220ms linear;
}
</style>
