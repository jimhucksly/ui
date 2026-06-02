<template>
  <v-container class="d-flex flex-column">
    <content-header>Icons</content-header>
    <content-body h="85vh" h-100>
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3 h-100" style="overflow: hidden">
            <v-col col="12" class="d-flex flex-column h-100" style="overflow: hidden">
              <div style="height: 55px; flex-shrink: 0">
                <b-edit-text v-model="search">
                  <template #prepend-inner>
                    <b-icon>search</b-icon>
                  </template>
                </b-edit-text>
              </div>
              <div
                style="display: grid; grid-template-columns: repeat(5, 1fr); grid-gap: 8px 16px; overflow-y: auto"
                v-if="hasIcons"
              >
                <div class="d-flex align-center" style="font-size: var(--font-size)" v-for="icon in filteredIcons">
                  <b-icon>
                    {{ getIconName(icon) }}
                  </b-icon>
                  <span class="px-2">{{ icon }}</span>
                </div>
              </div>
              <div style="height: 55px; flex-shrink: 0" v-if="loading || empty">
                <loader :visible="loading" :transparent="false" />
                <span v-if="empty">not found</span>
              </div>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['icons.md']" />
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
      page: 0,
      limit: 200,
      timeout: null,
      search: '',
      filteredIcons: [],
    };
  },
  inject: ['tabProps', 'iconsList'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['icons.md'];
    },
    icons() {
      return this.iconsList;
    },
    hasIcons() {
      return Array.isArray(this.icons) && this.icons.length > 0;
    },
    interval() {
      return this.search.length ? 600 : 1200;
    },
    offset() {
      return this.page * this.limit;
    },
    hasFilteredIcons() {
      return Boolean(this.filteredIcons.length);
    },
    loading() {
      return this.offset < this.icons.length;
    },
    empty() {
      return !this.loading && !this.hasFilteredIcons;
    },
  },
  watch: {
    hasIcons: {
      immediate: true,
      handler(value) {
        if (value) {
          this.askDisplayIcons();
        }
      },
    },
    search() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.page = 0;
      }, 500);
    },
    page(value) {
      if (value === 0) {
        this.askDisplayIcons();
      }
    },
  },
  methods: {
    getIconName(icon) {
      return icon.replace(/\.svg$/g, '');
    },
    askDisplayIcons() {
      this.filteredIcons = [];
      const interval = setInterval(() => {
        const loadedChunk = this.icons.slice(this.offset, this.offset + this.limit);
        if (this.search) {
          const filteredChunk = loadedChunk.filter(i => i.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
          this.filteredIcons.push(...filteredChunk);
        } else {
          this.filteredIcons.push(...loadedChunk);
        }
        this.page++;
        if (this.offset > this.icons.length) {
          clearInterval(interval);
        }
      }, this.interval);
    },
  },
};
</script>
