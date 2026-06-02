<template>
  <v-container class="d-flex flex-column">
    <content-header>Radiobutton</content-header>
    <content-body h="500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6" class="pl-4">
              <v-row>
                <v-col cols="12">
                  <b-radiogroup
                    v-model="value"
                    :row="!column"
                    :column="column"
                    :label-on-top="labelOnTop"
                    label="Ld Radiogroup"
                    :required="required"
                    :disabled="disabled"
                    :readonly="readonly"
                    :size="size"
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  >
                    <template v-for="i in [1, 2]">
                      <b-radiobutton
                        :label="`Radio Button ${i}`"
                        :labelToLeft="labelToLeft"
                        :value="i"
                        :color="color"
                        :tabindex="i"
                        :hint="hint ? 'radiobutton hint' : ''"
                        :help="
                          help
                            ? {
                                tooltip: help === 1 ? 'input tooltip' : '',
                                link: help === 2 ? 'yandex.ru' : '',
                              }
                            : null
                        "
                      />
                    </template>
                  </b-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  Radio Value: <b>{{ value }}</b>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
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
            <v-col cols="3">
              <b-switch v-model="column" label="column" hide-details />
              <b-switch v-model="labelOnTop" label="label on top" hide-details />
              <b-switch v-model="labelToLeft" label="label to left" hide-details />
              <b-switch v-model="required" label="required" hide-details />
              <b-switch v-model="readonly" label="readonly" hide-details />
              <b-switch v-model="disabled" label="disabled" hide-details />
              <b-switch v-model="hint" label="radiobutton hint" hide-details />
              <b-radiogroup v-model="help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['radiobutton.md']" />
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
      column: false,
      help: 0,
      hint: false,
      labelOnTop: false,
      required: true,
      readonly: false,
      disabled: false,
      size: 's',
      color: 'primary',
      labelToLeft: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['radiobutton.md'];
    },
  },
};
</script>
