<template>
  <v-expansion-panel static :readonly="readonly" :key="uid" :data-uid="`${panels.uid}-${uid}`" @click="onClick($event)">
    <v-expansion-panel-title :class="{ 'v-expansion-panel-title--no-icon': hideIcon }">
      <template #actions>
        <component :is="$ui.options.aliases['b-button']" icon text aria-label="expansion-panel-icon">
          <svg-icon>arrow right</svg-icon>
        </component>
      </template>
      <template #default>
        <slot name="title">
          {{ title }}
        </slot>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text :eager="eager">
      <slot name="default"></slot>
      <slot name="text"></slot>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<script src="./b-expansion-panel.ts"></script>
