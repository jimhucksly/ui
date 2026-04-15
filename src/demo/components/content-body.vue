<template>
  <v-row :style="{ height }">
    <v-col cols="12" :class="{ 'h-100': h100 }" style="padding-top: 12px; padding-bottom: 12px">
      <v-card height="100%" elevation="2" class="pa-2" style="border-radius: 20px">
        <slot></slot>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    h: String,
    h100: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    height() {
      if (!isNaN(Number(this.h))) {
        return `${this.h}px`;
      }
      return this.h;
    },
  },
};
</script>
