<template>
  <v-btn
    class="b-chip"
    :class="{ 'b-chip--focused': isFocused && !disabled }"
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
    <span class="b-chip__content">
      <slot></slot>
    </span>
    <template v-if="canClose" #append>
      <button @click="onClose" aria-label="close">
        <svg-icon>close</svg-icon>
      </button>
    </template>
  </v-btn>
</template>
<script src="./b-chip.ts"></script>
