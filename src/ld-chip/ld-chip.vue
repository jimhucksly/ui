<template>
  <v-btn
    class="ld-chip"
    :class="{ 'ld-chip--focused': isFocused && !disabled }"
    :variant="active ? 'flat' : variant"
    :size="mySize"
    :color="color"
    :tabindex="tabindex"
    :disabled="disabled"
    @click="onClick"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template #prepend v-if="$slots['prepend']">
      <slot name="prepend"></slot>
    </template>
    <span class="ld-chip__content">
      <slot></slot>
    </span>
    <template v-if="canClose" #append>
      <button @click="onClose" aria-label="close">
        <svg-icon>close</svg-icon>
      </button>
    </template>
  </v-btn>
</template>
<script src="./ld-chip.ts"></script>
