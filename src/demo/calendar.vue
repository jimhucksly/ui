<template>
  <v-container class="d-flex flex-column">
    <content-header>Calendar</content-header>
    <content-body h="800">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <ld-calendar
                    v-model="value"
                    :disabled="disabled"
                    :readonly="readonly"
                    :min-date="minDate ? getMinDate : null"
                    :max-date="maxDate ? getMaxDate : null"
                    :view-mode="viewMode"
                    :disabled-dates="disabledDates"
                    :allowed-dates="allowedDates"
                    v-model:month="month"
                    v-model:year="year"
                    :scrolling="scrolling"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>{{ 'Selected: ' + String(value) }}</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="min date enable (-1 month)" v-model="minDate" hide-details />
              <ld-switch label="max date enable (+1 month)" v-model="maxDate" hide-details class="mb-1" />
              <ld-switch label="scrolling months by mouse wheel" v-model="scrolling" hide-details class="mb-1" />
              <ld-radiogroup v-model="viewMode" label="view mode" label-on-top hide-details class="mb-1">
                <ld-radiobutton value="month" label="month"></ld-radiobutton>
                <ld-radiobutton value="months" label="months"></ld-radiobutton>
                <ld-radiobutton value="year" label="year"></ld-radiobutton>
              </ld-radiogroup>

              <div class="mb-1">
                <ld-button @click="month--">
                  <ld-icon>arrow-left</ld-icon>
                  Prev month
                </ld-button>
                <ld-button
                  @click="
                    () => {
                      month = null;
                      year = null;
                    }
                  "
                >
                  Current date
                </ld-button>
                <ld-button @click="month++">
                  Next month
                  <ld-icon>arrow-right</ld-icon>
                </ld-button>
              </div>
              <div class="mb-1">
                <ld-button @click="year--">
                  <ld-icon>arrow-left</ld-icon>
                  Prev year
                </ld-button>
                <ld-button
                  @click="
                    () => {
                      month = null;
                      year = null;
                    }
                  "
                >
                  Current date
                </ld-button>
                <ld-button @click="year++">
                  Next year
                  <ld-icon>arrow-right</ld-icon>
                </ld-button>
              </div>
              <div class="mb-1">
                <ld-button @click="setModelValue">set model value (today + 2 mon)</ld-button>
              </div>
              <div class="mb-1">
                <ld-button @click="setDisabledDates">set disabled dates</ld-button>
              </div>
              <div class="mb-1">
                <ld-button @click="setAllowedDates">set allowed dates</ld-button>
              </div>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['calendar.md']" />
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
      value: null,
      readonly: false,
      disabled: false,
      minDate: false,
      maxDate: false,
      viewMode: 'month',
      disabledDates: [],
      allowedDates: [],
      month: null,
      year: null,
      scrolling: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['calendar.md'];
    },
    getMinDate() {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      return d;
    },
    getMaxDate() {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d;
    },
  },
  methods: {
    setModelValue() {
      const d = new Date();
      d.setMonth(d.getMonth() + 2);
      this.value = d;
    },
    setDisabledDates() {
      const year = this.value ? this.value.getFullYear() : new Date().getFullYear();
      const mon = this.value ? this.value.getMonth() : new Date().getMonth();
      const arr = [];
      let value = 0;
      while (value < 1 || arr.length < 10) {
        value = Math.floor(Math.random() * 30);
        if (value) {
          arr.push(value);
        }
      }
      this.disabledDates = arr.map(el => new Date(year, mon, el));
    },
    setAllowedDates() {
      const year = this.value ? this.value.getFullYear() : new Date().getFullYear();
      const mon = this.value ? this.value.getMonth() : new Date().getMonth();
      const arr = [];
      let value = 0;
      while (value < 1 || arr.length < 10) {
        value = Math.floor(Math.random() * 30);
        if (value) {
          arr.push(value);
        }
      }
      this.allowedDates = arr.map(el => new Date(year, mon, el));
    },
  },
};
</script>
