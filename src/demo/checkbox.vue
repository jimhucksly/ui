<template>
  <v-container class="d-flex flex-column">
    <content-header>Checkbox</content-header>
    <content-body h="550">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <ld-checkbox
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
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="m" label="medium"></ld-radiobutton>
                <ld-radiobutton value="l" label="large"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup v-model="color" label="color" label-on-top hide-details>
                <ld-radiobutton value="primary" label="primary"></ld-radiobutton>
                <ld-radiobutton value="error" label="error"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
            <v-col cols="4" class="flex-column">
              <ld-switch label="chekbox hint" v-model="hint" hide-details />
              <ld-switch label="label to left" v-model="labelToLeft" hide-details />
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-radiogroup v-model="help" label="help" label-on-top hide-details>
                <ld-radiobutton :value="0" label="None"></ld-radiobutton>
                <ld-radiobutton :value="1" label="Tooltip"></ld-radiobutton>
                <ld-radiobutton :value="2" label="Link"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
          <v-row>
            <v-col> Checkeds: {{ checkeds }} </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['checkbox.md']" />
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
