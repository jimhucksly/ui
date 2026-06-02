<template>
  <v-container class="d-flex flex-column">
    <content-header>Pager</content-header>
    <content-body h="800">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3 overflow-hidden" style="height: 500px">
            <v-col cols="8" class="d-flex flex-column h-100 overflow-hidden">
              <div class="overflow-hidden" style="flex-basis: 100%">
                <ld-datatable
                  id="datatable"
                  ref="table"
                  class="material ngx-flex elevation-0 scroll-s"
                  column-mode="flex"
                  selection-type="multiClick"
                  :loading-indicator="loading"
                  :rows="currentRows"
                  :columns="columns"
                  :count="pagerOptions.total"
                  :offset="offset"
                  :selected="selected"
                  :scrollbar-h="true"
                  :scrollbar-v="true"
                  :external-paging="true"
                  @page="onPage"
                />
              </div>
              <b-pager
                class="my-2 py-2"
                style="border-top: 1px solid var(--grey-l-5)"
                :options="pagerOptions"
                :to-first="toFirst"
                :to-last="toLast"
                :show-total="countSlot"
                :show-select-counter="selectionSlot"
                :show-page="page"
                :rounded="rounded"
                :fluid="fluid"
                :prev-text="prevText ? 'Previous' : ''"
                :next-text="nextText ? 'Next' : ''"
                :lastPageUnknown="lastPageUnknown"
                :unlimited="unlimited"
                :sizes="selectPage ? [4, 8, 16, 25, 50] : null"
                @change="onPager"
              >
                <template #total="{ total }">
                  <span>Всего {{ total }} человек</span>
                </template>
                <template #selection>
                  <span>Выбрано элементов: {{ selected.length }}</span>
                </template>
              </b-pager>
            </v-col>
            <v-col cols="4">
              <b-switch v-model="toFirst" label="toFist" hide-details />
              <b-switch v-model="toLast" label="toLast" hide-details />
              <b-switch v-model="lastPageUnknown" label="lastPageUnknown" hide-details />
              <b-switch v-model="unlimited" label="unlimited" hide-details />
              <b-switch v-model="countSlot" label="count slot" hide-details />
              <b-switch v-model="selectionSlot" label="selection slot" hide-details />
              <b-switch v-model="rounded" label="rounded" hide-details />
              <b-switch v-model="fluid" label="fluid" hide-details />
              <b-switch v-model="prevText" label="prevText" hide-details />
              <b-switch v-model="nextText" label="nextText" hide-details />
              <b-switch v-model="page" label="show page number" hide-details />
              <b-switch v-model="selectPage" label="select page" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['pager.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      loading: true,
      rows: [],
      columns: [
        {
          name: 'id',
          prop: 'id',
          flexGrow: 1,
        },
        {
          name: 'first_name',
          prop: 'first_name',
          flexGrow: 2,
        },
        {
          name: 'last_name',
          prop: 'last_name',
          flexGrow: 2,
        },
      ],
      selected: [],
      offset: 0,
      currentPage: 1,
      pagerOptions: {
        page: 1,
        pageSize: 8,
        total: 150,
      },
      toFirst: true,
      toLast: true,
      countSlot: true,
      selectionSlot: true,
      rounded: false,
      fluid: false,
      prevText: false,
      nextText: false,
      lastPageUnknown: false,
      unlimited: true,
      page: false,
      selectPage: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  mounted() {
    fetch('/mock.json')
      .then(res => res.json())
      .then(rows => {
        this.rows = rows;
        this.pagerOptions.total = rows.length;
        this.loading = false;
        return true;
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  },
  computed: {
    library() {
      return ['pager.md'];
    },
    currentRows() {
      if (!this.unlimited) {
        return this.rows;
      }
      const offset = this.offset * this.pagerOptions.pageSize;
      return this.rows.filter((_, i) => i >= offset && i < offset + this.pagerOptions.pageSize);
    },
  },
  methods: {
    onPage({ count, pageSize, limit, offset }) {
      if (this.unlimited) {
        return;
      }
      this.pagerOptions.page = offset + 1;
      this.pagerOptions.pageSize = pageSize;
    },
    onPager({ page, size }) {
      this.offset = page - 1;
      this.currentPage = page;
      this.pagerOptions.page = page;
      this.pagerOptions.pageSize = size;
    },
  },
};
</script>
