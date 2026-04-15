<template>
  <div>Info Window Content</div>
  <div v-if="data"><strong>Model Value:</strong> {{ data }}</div>
  <div style="height: 45px" v-for="i in count" class="my-2">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
  </div>
  <div class="my-2">
    <ld-button @click="count++"> Add div </ld-button>
  </div>
</template>
<script lang="ts">
export default {
  emits: ['external-component-created', 'set-result', 'set-result-and-close', 'cancel'],
  props: {
    data: String,
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
    this.$emit('external-component-created', this);
  },
};
</script>
