<template>
  <v-container class="d-flex flex-column">
    <content-header>Toasted</content-header>
    <content-body h="200">
      <div style="display: grid; grid-auto-flow: column; gap: 4px; justify-content: left">
        <template v-for="i in arr">
          <ld-button :color="i.color" @click="toast(i.name)">
            <span> call {{ i.name }} toast</span>
          </ld-button>
        </template>
      </div>
      <div class="pt-3">
        <markdown-to-html v-if="!templatesLoading" :template="templates['toast.md']" />
      </div>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      arr: [
        { name: 'success', color: 'success' },
        { name: 'info', color: 'primary' },
        { name: 'error', color: 'error' },
        { name: 'warning', color: 'secondary' },
      ],
    };
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['toast.md'];
    },
  },
  methods: {
    toast(i) {
      this.$toasted[i]('Message Title', 'Message Text');
    },
  },
};
</script>
