<template>
  <v-container class="d-flex flex-column">
    <content-header>Upgrade Guide</content-header>
    <content-body>
      <v-container>
        <v-row>
          <v-col cols="12">
            <markdown-to-html v-if="!templatesLoading" :template="templates['upgrade.md']" />
          </v-col>
        </v-row>
      </v-container>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['upgrade.md'];
    },
  },
};
</script>
