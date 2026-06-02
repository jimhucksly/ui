<template>
  <v-container class="d-flex flex-column">
    <content-header>Checkbox</content-header>
    <content-body h="550">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <b-checkbox
                v-for="i in [1, 2, 3]"
                v-model="checkeds"
                class="mb-1"
                :color="color"
                :label="`Ld Checkbox ${i}`"
                :hint="hint ? 'checkbox hint' : ''"
                :initial-value="i"
                :tab-index="i"
                :disabled="disabled"
                :readonly="readonly"
                :label-to-left="labelToLeft"
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
            </v-col>
            <v-col cols="4">
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="color" label="color" label-on-top hide-details>
                <b-radiobutton value="primary" label="primary"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="4" class="flex-column">
              <b-switch label="chekbox hint" v-model="hint" hide-details />
              <b-switch label="label to left" v-model="labelToLeft" hide-details />
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-radiogroup v-model="help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
          <v-row>
            <v-col> Checkeds: {{ checkeds }} </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['checkbox.md']" />
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
      checkeds: [],
      disabled: false,
      readonly: false,
      labelToLeft: false,
      help: 0,
      hint: false,
      size: 'm',
      color: 'primary',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['checkbox.md'];
    },
  },
};
</script>
