<template>
  <v-container class="d-flex flex-column">
    <content-header>
      <template #default> Edit List Box </template>
      <template #description>
        Компонент предназначен для добавления в поле ввода произвольных значений определенного типа
      </template>
    </content-header>
    <content-body h="950">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <ld-edit-list-box
                    v-model="value"
                    :autofocus="true"
                    :type="type"
                    label="ld edit list box"
                    :readonly="readonly"
                    :disabled="disabled"
                    :required="required"
                    :format="format ? /^\d\d\d$/ : null"
                    :only-unique="onlyUnique"
                    input-hint="Input Hint"
                    :persistent-hint="true"
                    :size="size"
                    :color="color"
                    prefix="Prefix"
                    suffix="Suffix"
                    :calendar-props="{
                      minDate: new Date('2025-05-11'),
                    }"
                    :mask-props="{
                      mask: '00-00-00',
                      inputHint: 'Mask: 00-00-00',
                      beautify: true,
                    }"
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
              </v-row>
              <v-row>
                <v-col cols="12"> Input: {{ JSON.stringify(value) }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="type" :column="true" hide-details label="type:" label-on-top>
                <ld-radiobutton label="text" value="text" />
                <ld-radiobutton label="number" value="number" />
                <ld-radiobutton label="date" value="date" />
                <ld-radiobutton label="datetime" value="datetime" />
                <ld-radiobutton label="mask" value="mask" />
              </ld-radiogroup>
              <ld-switch label="format (/\d\d\d/)" v-model="format" hide-details />
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="required" v-model="required" hide-details />
              <ld-switch label="only unique" v-model="onlyUnique" hide-details />
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
          <v-row class="pt-3">
            <v-col>
              <markdown-to-html v-if="!templatesLoading" :template="templates['editlistbox.md']" />
            </v-col>
          </v-row>
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script lang="ts">
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data(): {
    value: Array<unknown>;
    type: string;
    format: boolean;
    readonly: boolean;
    disabled: boolean;
    required: boolean;
    onlyUnique: boolean;
    help: number;
    size: string;
    color: string;
  } {
    return {
      value: [],
      type: 'text',
      format: false,
      readonly: false,
      disabled: false,
      required: false,
      onlyUnique: false,
      help: 0,
      size: 's',
      color: 'grey',
    };
  },
  inject: {
    tabProps: {
      type: Object,
    },
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['editlistbox.md'];
    },
  },
};
</script>
