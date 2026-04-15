<template>
  <v-container class="d-flex flex-column">
    <content-header>Slider</content-header>
    <content-body h="450">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-container>
            <v-row class="pt-5">
              <v-col cols="6">
                <v-row>
                  <v-col>
                    <ld-slider
                      v-model="value"
                      :disabled="disabled"
                      :range="range"
                      :min="Number(min)"
                      :max="Number(max)"
                      :step="Number(step)"
                      :ticks="showTicksLabels ? ticksLabels : ticks"
                      :thumb-label="showTicksPopup"
                    >
                      <template #thumb-label="{ value }">
                        {{ `${value}%` }}
                      </template>
                      <template v-if="showTicksLabels" #tick-label="{ value, label }">
                        {{ `Progress ${value}%` }}
                      </template>
                    </ld-slider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col> Input Value: {{ value }} </v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <ld-switch label="disabled" v-model="disabled" hide-details />
                <ld-edit-text v-model="value" label="value" hide-details :debounced="500" class="mb-1" />
                <ld-edit-text onlyNumbers v-model="min" label="Min" hide-details class="mb-1" />
                <ld-edit-text onlyNumbers v-model="max" label="Max" hide-details class="mb-1" />
                <ld-edit-text onlyNumbers v-model="step" label="Step" hide-details class="mb-1" />
                <ld-switch label="ticks" v-model="showTicks" hide-details />
                <ld-switch label="ticks labels" v-model="showTicksLabels" hide-details />
                <ld-switch label="ticks popup" v-model="showTicksPopup" hide-details />
                <ld-switch label="range mode" v-model="range" hide-details />
              </v-col>
            </v-row>
          </v-container>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['slider.md']" />
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
      value: 55,
      min: 0,
      max: 100,
      step: 1,
      showTicks: false,
      showTicksLabels: false,
      showTicksPopup: false,
      disabled: false,
      range: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['slider.md'];
    },
    ticks() {
      if (!this.showTicks) {
        return null;
      }
      return [0, 25, 50, 75, 100];
    },
    ticksLabels() {
      return {
        0: 'Progress: 0%',
        25: 'Progress: 25%',
        50: 'Progress: 50%',
        75: 'Progress: 75%',
        100: 'Progress: 100%',
      };
    },
  },
  watch: {
    showTicks(value) {
      if (value) {
        this.min = 0;
        this.max = 100;
        this.step = 25;
      } else {
        this.min = 0;
        this.max = 100;
        this.step = 1;
      }
    },
    range(value) {
      if (value) {
        this.value = [25, 75];
      } else {
        this.value = 55;
      }
    },
  },
};
</script>
