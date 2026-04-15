<template>
  <component
    class="ld-slider"
    :is="range ? 'v-range-slider' : 'v-slider'"
    v-model="internalValue"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    :ticks="ticks"
    :show-ticks="hasTicks ? 'always' : false"
    :thumb-label="thumbLabel ? 'always' : false"
    tick-size="4"
    thumb-size="24"
    elevation="2"
  >
    <template #thumb-label>
      <slot name="thumb-label" :value="internalValue"></slot>
    </template>
    <template #tick-label="{ tick }">
      <slot name="tick-label" :value="tick.value" :label="tick.label">
        <span>{{ tick.label }}</span>
      </slot>
    </template>
  </component>
</template>
<script src="./ld-slider.ts"></script>
