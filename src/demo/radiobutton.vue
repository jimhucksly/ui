<template>
  <v-container class="d-flex flex-column">
    <content-header>Radiobutton</content-header>
    <content-body h="500">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6" class="pl-4">
              <v-row>
                <v-col cols="12">
                  <ld-radiogroup
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
                      <ld-radiobutton
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
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  Radio Value: <b>{{ value }}</b>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
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
            <v-col cols="3">
              <ld-switch v-model="column" label="column" hide-details />
              <ld-switch v-model="labelOnTop" label="label on top" hide-details />
              <ld-switch v-model="labelToLeft" label="label to left" hide-details />
              <ld-switch v-model="required" label="required" hide-details />
              <ld-switch v-model="readonly" label="readonly" hide-details />
              <ld-switch v-model="disabled" label="disabled" hide-details />
              <ld-switch v-model="hint" label="radiobutton hint" hide-details />
              <ld-radiogroup v-model="help" label="help" label-on-top hide-details>
                <ld-radiobutton :value="0" label="None"></ld-radiobutton>
                <ld-radiobutton :value="1" label="Tooltip"></ld-radiobutton>
                <ld-radiobutton :value="2" label="Link"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['radiobutton.md']" />
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
