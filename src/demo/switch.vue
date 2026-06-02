<template>
  <v-container class="d-flex flex-column">
    <content-header>Switch</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6" class="pl-4">
              <b-switch
                label="Ld Switch"
                v-model="value"
                :disabled="disabled"
                :readonly="readonly"
                true-value="+"
                false-value="-"
                :hint="hint ? 'switch hint' : ''"
                :size="size"
                :help="
                  help
                    ? {
                        tooltip: help === 1 ? 'input tooltip' : '',
                        link: help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
              <div class="my-7">Value: {{ value }}</div>
            </v-col>
            <v-col cols="3">
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="hint" v-model="hint" hide-details />
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['switch.md']" />
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
      value: false,
      disabled: false,
      readonly: false,
      help: 0,
      size: 's',
      hint: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['switch.md'];
    },
  },
};
</script>
