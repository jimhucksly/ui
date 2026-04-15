<template>
  <v-container class="d-flex flex-column">
    <content-header>Editor</content-header>
    <content-body h="900">
      <v-row style="height: 400px">
        <v-col>
          <editor v-model:html="html" v-model:content="delta" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <markdown-to-html v-if="!templatesLoading" :template="templates['editor.md']" />
        </v-col>
      </v-row>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      html: '',
      delta: '',
    };
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['editor.md'];
    },
  },
};
</script>
