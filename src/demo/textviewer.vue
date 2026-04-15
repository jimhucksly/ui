<template>
  <v-container class="d-flex flex-column">
    <content-header>Text Viewer</content-header>
    <content-body h="300">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="8">
              <ld-text-viewer :text="'Яндекс http://yandex.ru'" :active-links="activeLinks" label="Ld TextViewer" />
              <ld-text-viewer :active-links="activeLinks" label="Ld TextViewer">
                Яндекс http://yandex.ru
              </ld-text-viewer>
              <ld-text-viewer label="Ld TextViewer"> <ld-icon>user</ld-icon> <span>Username</span> </ld-text-viewer>
            </v-col>
            <v-col cols="4" class="d-flex flex-column">
              <ld-switch label="active links" v-model="activeLinks" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['textviewer.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      activeLinks: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['textviewer.md'];
    },
  },
};
</script>
