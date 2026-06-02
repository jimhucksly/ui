<template>
  <v-container class="d-flex flex-column">
    <content-header>Calendar</content-header>
    <content-body h="900">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <b-calendar
                    v-model="value"
                    v-model:month="month"
                    v-model:year="year"
                    :disabled="disabled"
                    :readonly="readonly"
                    :min-date="minDate ? getMinDate : null"
                    :max-date="maxDate ? getMaxDate : null"
                    :view-mode="viewMode"
                    :disabled-dates="disabledDates"
                    :allowed-dates="allowedDates"
                    :scrolling="scrolling"
                    :static="static"
                    :events="events"
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
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="min date enable (-1 month)" v-model="minDate" hide-details />
              <b-switch label="max date enable (+1 month)" v-model="maxDate" hide-details class="mb-1" />
              <b-switch label="scrolling months by mouse wheel" v-model="scrolling" hide-details class="mb-1" />
              <b-switch label="static" v-model="static" hide-details class="mb-1" />
              <b-radiogroup v-model="viewMode" label="view mode" label-on-top hide-details class="mb-1">
                <b-radiobutton value="month" label="month"></b-radiobutton>
                <b-radiobutton value="months" label="months"></b-radiobutton>
                <b-radiobutton value="year" label="year"></b-radiobutton>
              </b-radiogroup>

              <div class="mb-1">
                <b-button @click="month--">
                  <b-icon>arrow-left</b-icon>
                  Prev month
                </b-button>
                <b-button
                  @click="
                    () => {
                      month = null;
                      year = null;
                    }
                  "
                >
                  Current date
                </b-button>
                <b-button @click="month++">
                  Next month
                  <b-icon>arrow-right</b-icon>
                </b-button>
              </div>
              <div class="mb-1">
                <b-button @click="year--">
                  <b-icon>arrow-left</b-icon>
                  Prev year
                </b-button>
                <b-button
                  @click="
                    () => {
                      month = null;
                      year = null;
                    }
                  "
                >
                  Current date
                </b-button>
                <b-button @click="year++">
                  Next year
                  <b-icon>arrow-right</b-icon>
                </b-button>
              </div>
              <div class="mb-1">
                <b-button @click="setModelValue">set model value (today + 2 mon)</b-button>
              </div>
              <div class="mb-1">
                <b-button @click="setDisabledDates">set disabled dates</b-button>
              </div>
              <div class="mb-1">
                <b-button @click="setAllowedDates">set allowed dates</b-button>
              </div>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['calendar.md']" />
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
      value: null,
      readonly: false,
      disabled: false,
      minDate: false,
      maxDate: false,
      viewMode: 'month',
      disabledDates: [],
      allowedDates: [],
      month: 0,
      year: new Date().getFullYear(),
      scrolling: true,
      static: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  watch: {
    static(value) {
      if (value) {
        this.scrolling = false;
      }
    },
  },
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
    events(item) {
      return false;
    },
  },
};
</script>
