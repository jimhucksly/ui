<template>
  <v-container class="d-flex flex-column">
    <content-header>Splitter</content-header>
    <content-body h="450">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3 h-100">
            <v-col cols="8">
              <ld-splitter
                class="h-100 grey--border"
                style="border-width: 1px; border-style: solid"
                :resize-disabled="resizeDisabled"
                :left-size-min="leftSizeMin ? '30' : '5'"
                :right-size-min="rightSizeMin ? '30' : '5'"
                :left-visibled="leftVisibled"
                :right-visibled="rightVisibled"
                :horizontal="horizontal"
              >
                <template #left-pane>
                  <div>{{ horizontal ? 'Top' : 'Left' }} Panel</div>
                </template>
                <template #right-pane>
                  <div>{{ horizontal ? 'Bottom' : 'Right' }} Panel</div>
                </template>
              </ld-splitter>
            </v-col>
            <v-col cols="4" class="d-flex flex-column">
              <ld-switch label="resizeDisabled" v-model="resizeDisabled" hide-details />
              <ld-switch label="leftSizeMin (30%)" v-model="leftSizeMin" hide-details />
              <ld-switch label="rightSizeMin (30%)" v-model="rightSizeMin" hide-details />
              <ld-switch label="leftVisibled" v-model="leftVisibled" hide-details />
              <ld-switch label="rightVisibled" v-model="rightVisibled" hide-details />
              <ld-switch label="horizontal" v-model="horizontal" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['splitter.md']" />
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
      resizeDisabled: false,
      leftSizeMin: false,
      rightSizeMin: false,
      leftVisibled: true,
      rightVisibled: true,
      horizontal: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['splitter.md'];
    },
  },
};
</script>
