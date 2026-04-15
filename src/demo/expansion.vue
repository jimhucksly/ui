<template>
  <v-container class="d-flex flex-column">
    <content-header>Expansion Panels</content-header>
    <content-body h="500">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col class="px-4" cols="6">
              <ld-expansion-panels :multiple="multiple">
                <ld-expansion-panel title="Expansion panel title">
                  <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
                </ld-expansion-panel>
                <ld-expansion-panel title="Expansion panel title">
                  <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
                </ld-expansion-panel>
                <ld-expansion-panel title="Expansion panel title">
                  <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
                </ld-expansion-panel>
              </ld-expansion-panels>
            </v-col>
            <v-col cols="6">
              <ld-switch v-model="multiple" label="multiple" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['expansion.md']" />
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
      multiple: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['expansion.md'];
    },
  },
};
</script>
