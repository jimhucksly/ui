<template>
  <v-btn
    class="ld-badge"
    :class="[`ld-badge--${rounded ? 'rounded' : 'square'}`, { 'ld-badge--circle': circle }]"
    :color="color"
    :variant="variant"
    :readonly="true"
    :size="mySize"
  >
    <i v-if="dot && !circle" class="ld-badge-dot"></i>
    <slot />
  </v-btn>
</template>
<script src="./ld-badge.ts"></script>
