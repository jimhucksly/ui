<template>
  <v-container class="d-flex flex-column">
    <content-header>Breadcrumbs</content-header>
    <content-body h="600">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pa-3">
            <v-col cols="6" :style="{ 'background-color': theme === 'dark' ? 'white' : 'var(--grey-d-1)' }">
              <b-breadcrumbs
                :label="label ? 'Home' : ''"
                :breadcrumbs="breadcrumbs"
                :size="size"
                :theme="theme"
                @open="onOpen"
              />
            </v-col>
            <v-col cols="6">
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton label="small" value="s" />
                <b-radiobutton label="medium" value="m" />
                <b-radiobutton label="large" value="l" />
              </b-radiogroup>
              <b-radiogroup v-model="theme" label="theme" label-on-top hide-details>
                <b-radiobutton label="dark" value="dark" />
                <b-radiobutton label="light" value="light" />
              </b-radiogroup>
              <b-switch v-model="label" label="label" hide-details />
              <b-switch v-model="overflow" label="overflow items" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['breadcrumbs.md']" />
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
