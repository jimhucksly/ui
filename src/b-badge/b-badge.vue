<template>
  <v-btn
    class="b-badge"
    :class="[`b-badge--${rounded ? 'rounded' : 'square'}`, { 'b-badge--circle': circle }, `b-badge--size-${mySize}`]"
    :color="color"
    :variant="variant"
    :readonly="true"
  >
    <i v-if="dot && !circle" class="b-badge-dot"></i>
    <slot />
  </v-btn>
</template>
<script src="./b-badge.ts"></script>
