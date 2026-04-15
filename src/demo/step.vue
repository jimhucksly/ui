<template>
  <v-container class="d-flex flex-column">
    <content-header>Stepper</content-header>
    <content-body h="800">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="7" class="pl-4">
              <ld-step :items="items" :direction="direction" />
            </v-col>
            <v-col cols="5">
              <ld-radiogroup v-model="direction" label="direction" label-on-top class="mb-1" hide-details>
                <ld-radiobutton value="v" label="vertical" />
                <ld-radiobutton value="h" label="horizontal" />
              </ld-radiogroup>
              <ld-switch label="disabled" v-model="disabled" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['step.md']" />
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
      disabled: false,
      direction: 'h',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['step.md'];
    },
    items() {
      return [
        {
          type: 'completed',
          result: 'success',
          title: 'Step 1',
          tooltip:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium officia, ab ad vero suscipit facilis, distinctio voluptas ipsum accusantium nemo assumenda laborum, minima mollitia quos expedita dolore aliquid voluptates quis.',
          tooltipProps: {
            location: 'right',
            'max-width': 300,
          },
          subtitle:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium officia, ab ad vero suscipit facilis, distinctio voluptas ipsum accusantium nemo assumenda laborum, minima mollitia quos expedita dolore aliquid voluptates quis.',
          disabled: this.disabled,
        },
        {
          type: 'completed',
          result: 'warning',
          title: 'Step 2',
          subtitle: 'step description',
          disabled: this.disabled,
        },
        {
          type: 'completed',
          result: 'error',
          title: 'Step 3',
          subtitle: 'step description',
          disabled: this.disabled,
        },
        {
          type: 'active',
          title: 'Step 4',
          subtitle: 'step description',
          disabled: this.disabled,
        },
        {
          type: 'scheduled',
          title: 'Step 5',
          subtitle: 'step description',
          disabled: this.disabled,
        },
        {
          type: 'scheduled',
          title: 'Step 6',
          subtitle: 'step description',
          disabled: this.disabled,
        },
      ];
    },
  },
};
</script>
