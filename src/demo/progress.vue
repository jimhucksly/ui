<template>
  <v-container class="d-flex flex-column">
    <content-header>Progress Bar</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <ld-progress
                :label="showLabel ? ' ' : null"
                :value="Number(counter)"
                :counter="showCounter"
                :view="view"
                :size="size"
                :error="error"
                @complete="onComplete"
              >
                {{ label }}
              </ld-progress>
            </v-col>
            <v-col cols="4">
              <ld-switch v-model="showLabel" label="label" hide-details />
              <ld-switch v-model="showCounter" label="counter" hide-details />
              <div style="width: 250px">
                <ld-edit-text v-model="counter" label="value" hide-details />
              </div>
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="xs" label="x-small"></ld-radiobutton>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="sm" label="medium"></ld-radiobutton>
                <ld-radiobutton value="m" label="large"></ld-radiobutton>
                <ld-radiobutton value="l" label="x-large"></ld-radiobutton>
                <ld-radiobutton value="xl" label="extra-large"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
            <v-col cols="4">
              <ld-radiogroup v-model="view" label="view" label-on-top hide-details>
                <ld-radiobutton value="linear" label="linear"></ld-radiobutton>
                <ld-radiobutton value="circular" label="circular"></ld-radiobutton>
                <ld-radiobutton value="half-circle" label="half-circle"></ld-radiobutton>
              </ld-radiogroup>
              <ld-switch v-model="error" label="error" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['progress.md']" />
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
      showLabel: true,
      showCounter: true,
      label: 'In progress..',
      counter: 15,
      view: 'linear',
      size: 'sm',
      error: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['progress.md'];
    },
  },
  methods: {
    onComplete() {
      this.label = 'Completed';
    },
  },
};
</script>
