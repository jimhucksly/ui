<template>
  <v-container class="d-flex flex-column">
    <content-header>Utils</content-header>
    <content-body h="300">
      <v-row class="pt-3">
        <v-col cols="12">
          <markdown-to-html v-if="!templatesLoading" :template="templates['utils.md']" />
        </v-col>
      </v-row>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['utils.md'];
    },
  },
};
</script>
