<template>
  <v-expansion-panels
    v-model="internalValue"
    variant="accordion"
    :multiple="multiple"
    @update:model-value="onUpdateModelValue"
  >
    <slot></slot>
  </v-expansion-panels>
</template>
<script src="./b-expansion-panels.ts"></script>
