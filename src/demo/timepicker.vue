<template>
  <v-container class="d-flex flex-column">
    <content-header>Time picker</content-header>
    <content-body h="500">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <ld-timepicker
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
              <ld-switch label="required" v-model="required" hide-details />
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="clearable" v-model="clearable" hide-details />
              <ld-switch label="24-hr format" v-model="is24hr" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['timepicker.md']" />
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
