<template>
  <v-container class="d-flex flex-column">
    <content-header>Progress Bar</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <b-progress
                :label="showLabel ? ' ' : null"
                :value="Number(counter)"
                :counter="showCounter"
                :view="view"
                :size="size"
                :error="error"
                @complete="onComplete"
              >
                {{ label }}
              </b-progress>
            </v-col>
            <v-col cols="4">
              <b-switch v-model="showLabel" label="label" hide-details />
              <b-switch v-model="showCounter" label="counter" hide-details />
              <div style="width: 250px">
                <b-edit-text v-model="counter" label="value" hide-details />
              </div>
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton value="xs" label="x-small"></b-radiobutton>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="sm" label="medium"></b-radiobutton>
                <b-radiobutton value="m" label="large"></b-radiobutton>
                <b-radiobutton value="l" label="x-large"></b-radiobutton>
                <b-radiobutton value="xl" label="extra-large"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="4">
              <b-radiogroup v-model="view" label="view" label-on-top hide-details>
                <b-radiobutton value="linear" label="linear"></b-radiobutton>
                <b-radiobutton value="circular" label="circular"></b-radiobutton>
                <b-radiobutton value="half-circle" label="half-circle"></b-radiobutton>
              </b-radiogroup>
              <b-switch v-model="error" label="error" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['progress.md']" />
        </b-tab>
      </b-tabs>
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
