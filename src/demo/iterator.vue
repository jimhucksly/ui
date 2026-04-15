<template>
  <v-container class="d-flex flex-column">
    <content-header>Data Iterator</content-header>
    <content-body h="1000">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row>
            <v-col cols="8" style="position: relative">
              <loader transparent :visible="loading" />
              <template v-if="ready">
                <v-card
                  height="400px"
                  elevation="0"
                  rounded="0"
                  class="grey--bg grey--border overflow-hidden"
                  style="border: 1px solid"
                >
                  <ld-data-iterator
                    key="iterator"
                    ref="iterator"
                    key-prop="id"
                    row-height="auto"
                    :items="rows"
                    :removed-item="removedItem"
                    :page="page"
                    :to-last-page="toLastPage"
                    :sort-field="sortField"
                    :selected-indices="selectedIndices"
                    :first-item-select-counter="firstItemSelectCounter"
                    :next-item-select-counter="nextItemSelectCounter"
                    :min-row-height="minRowHeight"
                    :active-item="iteratorActiveItem"
                    :fix-top-active-item="showActiveItem"
                    :padding="iteratorPadding"
                    :item-gap="iteratorItemGap"
                    :scroll-to-active-item="scrollToActiveItem"
                    @loading-update="onIteratorLoadingUpdate"
                    @select="onItemSelect"
                    @click="onClick"
                    @dblclick="onDblClick"
                    @page="onIteratorPage"
                    @total-pages="onIteratorTotalPage"
                  >
                    <template v-slot="{ item, itemContext }">
                      <v-card
                        elevation="0"
                        class="grey--border"
                        :class="{
                          'secondary--bg': itemContext.index === selectedIndex,
                        }"
                        :style="{
                          border: '1px solid',
                        }"
                      >
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col>
                                <strong>{{ `${itemContext.index + 1}. ${item.first_name} ${item.last_name}` }}</strong>
                              </v-col>
                              <v-col class="d-flex justify-end">
                                {{ item.email }}
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </template>
                  </ld-data-iterator>
                </v-card>
                <div>Page:</div>
                <div class="d-flex flex-wrap">
                  <ld-button
                    v-for="(i, index) in new Array(pages).fill(null)"
                    :key="index"
                    :icon="true"
                    color="primary"
                    :variant="page === index + 1 ? 'flat' : 'outlined'"
                    class="ma-1"
                    @click="toPage(index + 1)"
                  >
                    {{ index + 1 }}
                  </ld-button>
                </div>
              </template>
            </v-col>
            <v-col cols="4" class="d-flex flex-column">
              <div class="mb-2">
                <ld-button @click="remove">Remove First Element</ld-button>
              </div>
              <div class="mb-2">Selected: {{ iteratorActiveItem }}</div>
              <div class="mb-2">
                <div class="d-flex">
                  <ld-edit-text v-model="iteratorPadding" label="padding" only-numbers style="min-width: 50%" />
                </div>
                <div class="d-flex">
                  <ld-edit-text v-model="gap" label="gap" only-numbers style="min-width: 50%" />
                </div>
                <div class="d-flex">
                  <ld-edit-text v-model="selectedIndex" label="selected index" only-numbers style="min-width: 50%" />
                </div>
                <ld-switch v-model="scrollToActiveItem" label="scroll to active item" />
                <ld-button @click="reload">Reload</ld-button>
              </div>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['iterator.md']" />
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
      ready: true,
      loading: false,
      selectedIndex: 0,
      rows: [],
      removedItem: null,
      toLastPage: false,
      page: 1,
      pages: 0,
      sortField: {},
      firstItemSelectCounter: 0,
      nextItemSelectCounter: 0,
      minRowHeight: 30,
      showActiveItem: false,
      iteratorPadding: 10,
      iteratorItemGap: 5,
      gap: 5,
      scrollToActiveItem: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  created() {
    this.iteratorItemGap = this.gap;
    fetch('/mock.json')
      .then(res => res.json())
      .then(data => {
        this.rows = data.splice(0, 50);
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  },
  computed: {
    library() {
      return ['iterator.md'];
    },
    iteratorActiveItem() {
      return this.rows[this.selectedIndex];
    },
    selectedIndices() {
      return [this.selectedIndex];
    },
  },
  methods: {
    onIteratorLoadingUpdate(flag) {
      this.loading = flag;
    },
    onItemSelect(item, index) {
      this.selectedIndex = index;
    },
    onClick(item) {
      //
    },
    onDblClick(item) {
      //
    },
    onIteratorPage(page) {
      this.page = page;
    },
    onIteratorTotalPage(count) {
      this.pages = count;
    },
    remove() {
      this.removedItem = {
        id: this.rows[0].id,
        item: this.rows[0],
        index: 0,
      };
      this.rows.splice(0, 1);
    },
    toPage(page) {
      this.page = page;
    },
    reload() {
      this.ready = false;
      this.loading = true;
      this.iteratorItemGap = Number(this.gap);
      setTimeout(() => {
        this.ready = true;
      }, 2000);
    },
  },
};
</script>
