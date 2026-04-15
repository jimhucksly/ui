<template>
  <v-tab
    v-if="!onlyWindows"
    color="primary"
    v-bind="$props"
    :key="`${index}-v-tab`"
    :style="styles"
    :value="Number(index)"
  >
    <slot name="header">
      <span class="d-block overflow-hidden" style="text-overflow: ellipsis">
        {{ heading }}
      </span>
    </slot>
    <slot name="icon" />
  </v-tab>
  <v-tabs-window-item v-else v-bind="$props" :key="`${index}-v-window`" :value="Number(index)">
    <slot />
  </v-tabs-window-item>
</template>
<script src="./ld-tab.ts"></script>
