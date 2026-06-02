<template>
  <v-container class="d-flex flex-column">
    <content-header>Textarea</content-header>
    <content-body h="600">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <b-textarea
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
              <b-switch label="resizable" v-model="resizable" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="clearable" v-model="clearable" hide-details />
              <b-switch label="lable on top" v-model="labelOnTop" hide-details />
              <b-switch label="max length" v-model="maxLen" hide-details />
              <b-switch label="hide details" v-model="hideDetails" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['textarea.md']" />
        </b-tab>
      </b-tabs>
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
