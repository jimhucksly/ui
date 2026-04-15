<template>
  <div
    class="ld-progress"
    :class="[
      `ld-progress--${view}`,
      { 'ld-progress--no-label': !label, 'ld-progress--error': error },
      `ld-progress--${mySize}`,
    ]"
    :style="{
      width: view === 'linear' ? undefined : `${dim}px`,
      height: view === 'linear' ? undefined : `${view === 'circular' ? dim : dim / 2 + 24}px`,
    }"
  >
    <template v-if="isLinear">
      <div v-if="label" class="ld-progress-label">
        <div class="ld-progress-text" :class="{ 'ld-progress-text--complete': internalValue === 100 }">
          <slot>
            {{ label }}
          </slot>
        </div>
        <div v-if="counter" class="ld-progress-counter">{{ percent }}</div>
      </div>
      <div class="ld-progress-bar" :style="{ '--n': internalValue }"></div>
      <div v-if="counter && !label" class="ld-progress-counter">{{ percent }}</div>
    </template>
    <template v-if="isCircular">
      <!--
        circumference = 2 × π × radius
        offset = circumference × ((100 - progress)/100)
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      -->
      <svg :width="dim" :height="dim" :viewBox="`0 0 ${dim} ${dim}`" style="transform: rotate(-90deg)">
        <circle :cx="cx" :cy="cx" :r="r" :stroke-width="strokeWidth" stroke="var(--grey-l-5)" fill="none" />
        <circle
          :cx="Math.floor(dim / 2)"
          :cy="Math.floor(dim / 2)"
          :r="r"
          fill="none"
          :stroke="error ? 'var(--error)' : 'var(--primary)'"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="2 * Math.PI * r"
          :stroke-dashoffset="2 * Math.PI * r * ((100 - internalValue) / 100)"
        />
      </svg>
      <div class="ld-progress-counter">{{ percent }}</div>
      <div v-if="label" class="ld-progress-text" :class="{ 'ld-progress-text--complete': internalValue === 100 }">
        <slot>
          {{ label }}
        </slot>
      </div>
    </template>
    <template v-if="isHalfCircle" v-html="halfCircleSvg">
      <svg
        id="half-circle-svg"
        xmlns="http://www.w3.org/2000/svg"
        :width="dim"
        :height="dim"
        :viewBox="`0 0 ${dim} ${dim}`"
        fill="none"
      >
        <path :d="path_2wk2r_180" stroke="var(--grey-l-5)" stroke-linecap="round" :stroke-width="strokeWidth"></path>
        <path
          :d="path_2wk2r"
          :stroke="error ? 'var(--error)' : 'var(--primary)'"
          stroke-linecap="round"
          :stroke-width="strokeWidth"
        ></path>
      </svg>
      <div class="ld-progress-counter">{{ percent }}</div>
      <div v-if="label" class="ld-progress-text" :class="{ 'ld-progress-text--complete': internalValue === 100 }">
        <slot>
          {{ label }}
        </slot>
      </div>
    </template>
  </div>
</template>
<script src="./ld-progress.ts"></script>
