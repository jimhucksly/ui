<template>
  <v-container class="d-flex flex-column">
    <content-header>Breadcrumbs</content-header>
    <content-body h="600">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pa-3">
            <v-col cols="6" :style="{ 'background-color': theme === 'dark' ? 'white' : 'var(--grey-d-1)' }">
              <ld-breadcrumbs
                :label="label ? 'Home' : ''"
                :breadcrumbs="breadcrumbs"
                :size="size"
                :theme="theme"
                @open="onOpen"
              />
            </v-col>
            <v-col cols="6">
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton label="small" value="s" />
                <ld-radiobutton label="medium" value="m" />
                <ld-radiobutton label="large" value="l" />
              </ld-radiogroup>
              <ld-radiogroup v-model="theme" label="theme" label-on-top hide-details>
                <ld-radiobutton label="dark" value="dark" />
                <ld-radiobutton label="light" value="light" />
              </ld-radiogroup>
              <ld-switch v-model="label" label="label" hide-details />
              <ld-switch v-model="overflow" label="overflow items" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['breadcrumbs.md']" />
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
      label: true,
      size: 'm',
      theme: 'dark',
      overflow: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['breadcrumbs.md'];
    },
    breadcrumbs() {
      const o = [
        {
          text: 'LDM UI DEMO',
          route: {
            path: '/',
          },
        },
      ];
      if (this.overflow) {
        o.push(
          {
            text: 'collapsed item 1',
            hidden: true,
            route: {
              path: '/',
            },
          },
          {
            text: 'collapsed item 2',
            hidden: true,
            route: {
              path: '/',
            },
          },
          {
            text: 'collapsed item 3',
            hidden: true,
            route: {
              path: '/',
            },
          }
        );
      }
      o.push({
        text: 'Navigation',
        route: {
          path: '/',
        },
      });
      if (this.overflow) {
        o.push({
          text: 'collapsed item 4',
          hidden: true,
          route: {
            path: '/',
          },
        });
      }
      o.push({
        text: 'Breadcrumbs',
        route: {
          path: '/',
        },
      });
      return o;
    },
  },
  methods: {
    onOpen(item) {
      /* eslint-disable no-console */
      console.log(item);
    },
  },
};
</script>
