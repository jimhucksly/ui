<template>
  <v-container class="d-flex flex-column">
    <content-header>Translation</content-header>
    <content-body h="700">
      <markdown-to-html v-if="!templatesLoading" :template="templates['i18n.md']" />
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['i18n.md'];
    },
  },
};
</script>
