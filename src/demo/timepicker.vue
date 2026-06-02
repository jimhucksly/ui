<template>
  <v-container class="d-flex flex-column">
    <content-header>Time picker</content-header>
    <content-body h="500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <b-timepicker
                    v-model="value"
                    label="Ld Timepicker"
                    input-hint="Timepicker input hint"
                    persistent-hint
                    :required="required"
                    :readonly="readonly"
                    :disabled="disabled"
                    :clearable="clearable"
                    :is24hr="is24hr"
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                    :size="size"
                    :color="color"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"> Input Value: {{ value }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column">
              <b-switch label="required" v-model="required" hide-details />
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="clearable" v-model="clearable" hide-details />
              <b-switch label="24-hr format" v-model="is24hr" hide-details />
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="color" label="color" label-on-top hide-details>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['timepicker.md']" />
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
      required: false,
      readonly: false,
      disabled: false,
      clearable: false,
      is24hr: true,
      help: 0,
      size: 's',
      color: 'grey',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['timepicker.md'];
    },
  },
};
</script>
