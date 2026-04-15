<template>
  <v-container class="d-flex flex-column">
    <content-header>Date range</content-header>
    <content-body h="700">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <ld-daterange
                    v-model="value"
                    label="Ld Daterange"
                    persistent-hint
                    input-hint="Daterange input hint"
                    :label-on-top="labelOnTop"
                    :readonly="readonly"
                    :disabled="disabled"
                    :datepicker-props="{
                      minDate: minDate ? getMinDate() : null,
                      maxDate: maxDate ? getMaxDate() : null,
                    }"
                    :required="required"
                    :size="size"
                    :color="color"
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  />
                </v-col>
                <v-col cols="12">
                  <v-col cols="12"> Input Value: {{ value }} </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <ld-switch label="label on top" v-model="labelOnTop" hide-details />
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="minDate (-1 month)" v-model="minDate" hide-details />
              <ld-switch label="maxDate (+1 month)" v-model="maxDate" hide-details />
              <ld-switch label="required" v-model="required" hide-details />
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="help" label="help" label-on-top hide-details>
                <ld-radiobutton :value="0" label="None"></ld-radiobutton>
                <ld-radiobutton :value="1" label="Tooltip"></ld-radiobutton>
                <ld-radiobutton :value="2" label="Link"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="m" label="medium"></ld-radiobutton>
                <ld-radiobutton value="l" label="large"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup v-model="color" label="color" label-on-top hide-details>
                <ld-radiobutton value="grey" label="grey"></ld-radiobutton>
                <ld-radiobutton value="success" label="success"></ld-radiobutton>
                <ld-radiobutton value="error" label="error"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['daterange.md']" />
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
      labelOnTop: false,
      readonly: false,
      disabled: false,
      minDate: false,
      maxDate: false,
      required: true,
      help: 0,
      size: 's',
      color: 'grey',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['daterange.md'];
    },
  },
  methods: {
    getMinDate() {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d;
    },
    getMaxDate() {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d;
    },
  },
};
</script>
