<template>
  <v-container class="d-flex flex-column">
    <content-header>Markdown editor</content-header>
    <content-body h="350">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <b-text-markup
                v-model="value"
                label="Ld Text Markup"
                persistent-hint
                input-hint="Markup input hint"
                :enable-preview="preview"
                :readonly="readonly"
                :disabled="disabled"
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
            <v-col cols="3" class="d-flex flex-column">
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="preview" v-model="preview" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['textmarkup.md']" />
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
      value: '',
      disabled: false,
      readonly: false,
      preview: false,
      help: 0,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['textmarkup.md'];
    },
  },
};
</script>
