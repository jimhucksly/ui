<template>
  <div class="ld-label" :class="{ 'justify-end': alignLabelToRight, 'ld-label--hint': hint }">
    <v-tooltip location="top" :disabled="!labelHint">
      <template #activator="{ props }">
        <span class="ld-label-content" :class="{ 'cursor-help': labelHint }" v-bind="props" @click.stop="onClick">
          <span>{{ label }}</span>
          <span v-if="required" class="ld-label-reqiured mx-1"></span>
        </span>
      </template>
      <span class="text-body">{{ labelHint }}</span>
    </v-tooltip>
    <span v-if="hint" class="caption" style="color: var(--grey-d-1); font-family: var(--regular)">{{ hint }}</span>
  </div>
</template>
<script lang="ts" src="./label.ts"></script>
