<template>
  <v-expansion-panel static>
    <v-expansion-panel-title>
      <template #actions>
        <component :is="$ui.options.aliases['ld-button']" icon text>
          <svg-icon>arrow right</svg-icon>
        </component>
      </template>
      <template #default>
        {{ title }}
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <slot></slot>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<script src="./ld-expansion-panel.ts"></script>
