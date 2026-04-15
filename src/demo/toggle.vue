<template>
  <v-container class="d-flex flex-column">
    <content-header>Toggle Buttons</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <ld-toggle-buttons
                    v-model="value"
                    :items="items"
                    :disabled="disabled"
                    :rounded="rounded"
                    :size="size"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <span class="text-body-s">Selected Value: {{ value }}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="rounded" v-model="rounded" hide-details />
              <ld-radiogroup v-model="size" label="size" class="mb-2" label-on-top hide-details>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="m" label="medium"></ld-radiobutton>
                <ld-radiobutton value="l" label="large"></ld-radiobutton>
              </ld-radiogroup>
              <ld-switch label="icon" v-model="icon" hide-details />
              <ld-switch label="text" v-model="text" hide-details />
              <ld-switch label="tooltip" v-model="tooltip" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['toggle.md']" />
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
      value: 0,
      disabled: false,
      rounded: true,
      size: 's',
      icon: true,
      text: true,
      tooltip: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['toggle.md'];
    },
    items() {
      return [
        {
          id: 0,
          tooltip: this.tooltip ? 'item 1 tooltip' : null,
          icon: this.icon ? 'eye-filled' : null,
          text: this.text ? 'Value 1' : null,
          badge: 3,
        },
        {
          id: 1,
          tooltip: this.tooltip ? 'item 2 tooltip' : null,
          icon: this.icon ? 'eye-off' : null,
          text: this.text ? 'Value 2' : null,
        },
      ];
    },
  },
};
</script>
