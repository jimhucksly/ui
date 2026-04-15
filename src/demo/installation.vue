<template>
  <v-container class="d-flex flex-column">
    <content-header>Installation and Usage</content-header>
    <content-body h="1300">
      <v-container>
        <v-row>
          <v-col cols="12">
            <markdown-to-html v-if="!templatesLoading" :template="templates['installation.md']" />
          </v-col>
        </v-row>
      </v-container>
    </content-body>
  </v-container>
</template>
<script>
import Content from './components/content-body.vue';
import Header from './components/content-header.vue';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  components: {
    'content-header': Header,
    'content-body': Content,
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['installation.md'];
    },
  },
};
</script>
