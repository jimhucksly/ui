<template>
  <v-container class="d-flex flex-column">
    <content-header>Textarea</content-header>
    <content-body h="600">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <ld-textarea
                v-model="comment"
                label="Ld Textarea"
                required
                :size="size"
                :color="color"
                :label-on-top="labelOnTop"
                :resizable="resizable"
                :disabled="disabled"
                :readonly="readonly"
                :clearable="clearable"
                :maxlength="maxLen ? 100 : null"
                :hide-details="hideDetails"
                persistent-hint
                input-hint="Textarea input hint"
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
            <v-col cols="3">
              <ld-switch label="resizable" v-model="resizable" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="clearable" v-model="clearable" hide-details />
              <ld-switch label="lable on top" v-model="labelOnTop" hide-details />
              <ld-switch label="max length" v-model="maxLen" hide-details />
              <ld-switch label="hide details" v-model="hideDetails" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['textarea.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      comment: '',
      resizable: false,
      labelOnTop: false,
      help: 0,
      size: 's',
      color: 'grey',
      disabled: false,
      readonly: false,
      clearable: false,
      maxLen: false,
      hideDetails: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['textarea.md'];
    },
  },
};
</script>
