<template>
  <v-container class="d-flex flex-column">
    <content-header>Markdown editor</content-header>
    <content-body h="350">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <ld-text-markup
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
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="preview" v-model="preview" hide-details />
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="help" label="help" label-on-top hide-details>
                <ld-radiobutton :value="0" label="None"></ld-radiobutton>
                <ld-radiobutton :value="1" label="Tooltip"></ld-radiobutton>
                <ld-radiobutton :value="2" label="Link"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['textmarkup.md']" />
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
