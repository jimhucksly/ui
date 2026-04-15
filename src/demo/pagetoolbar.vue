<template>
  <v-container class="d-flex flex-column">
    <content-header>Page Toolbar</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col>
              <ld-page-toolbar :preview="preview" :no-back-action="noBackAction" @back-click="back">
                <template #breadcrumbs> breadcrumbs </template>
                <template #content> page header </template>
                <template #action-panel> action panel </template>
              </ld-page-toolbar>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pl-4" cols="3">
              <ld-switch v-model="preview" label="Preview mode" />
            </v-col>
            <v-col class="pl-4" cols="3">
              <ld-switch v-model="noBackAction" label="Disable back action" />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['pagetoolbar.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      preview: false,
      noBackAction: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['pagetoolbar.md'];
    },
  },
  methods: {
    back() {
      /* eslint-disable no-alert */
      alert('back click!!');
    },
  },
};
</script>
