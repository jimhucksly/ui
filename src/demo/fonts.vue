<template>
  <v-container class="d-flex flex-column">
    <content-header>Fonts</content-header>
    <content-body h="1400">
      <markdown-to-html v-if="!templatesLoading" :template="templates['fonts.md']" />
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      //
    };
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['fonts.md'];
    },
  },
};
</script>
