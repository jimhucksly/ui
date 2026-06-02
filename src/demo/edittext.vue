<template>
  <v-container class="d-flex flex-column">
    <content-header>Edit Text</content-header>
    <content-body h="500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col col="6">
              <v-row>
                <v-col>
                  <b-edit-text
                    v-model="editText.value"
                    label="Ld Edit Text"
                    input-hint="edit text input hint"
                    persistentHint
                    placeholder="Placeholder"
                    :label-on-top="editText.labelonTop"
                    :prefix="editText.setPrefix ? 'Prefix:' : null"
                    :suffix="editText.setSuffix ? 'Suffix' : null"
                    :disabled="editText.disabled"
                    :readonly="editText.readonly"
                    :required="editText.required"
                    :hide-details="editText.hideDetails"
                    :debounced="editText.debounced ? 500 : null"
                    :clearable="editText.clearable"
                    :size="editText.size"
                    :color="editText.color"
                    :help="
                      editText.help
                        ? {
                            tooltip: editText.help === 1 ? 'input tooltip' : '',
                            link: editText.help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  >
                    <template #prepend-inner v-if="editText.setIcon">
                      <b-icon>search</b-icon>
                    </template>
                  </b-edit-text>
                </v-col>
              </v-row>
              <v-row>
                <v-col> Input Value: {{ editText.value }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <b-switch v-model="editText.disabled" label="disabled" hide-details />
              <b-switch v-model="editText.readonly" label="readonly" hide-details />
              <b-switch v-model="editText.required" label="required" hide-details />
              <b-switch v-model="editText.setPrefix" label="setPrefix" hide-details />
              <b-switch v-model="editText.setSuffix" label="setSuffix" hide-details />
              <b-switch v-model="editText.hideDetails" label="hideDetails" hide-details />
              <b-switch v-model="editText.debounced" label="debounced (500ms)" hide-details />
              <b-switch v-model="editText.clearable" label="clearable" hide-details />
              <b-switch v-model="editText.setIcon" label="prepend inner icon" hide-details />
              <b-switch v-model="editText.labelonTop" label="label on top" hide-details />
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="editText.size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="editText.help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="editText.color" label="color" label-on-top hide-details>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['edittext.main.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
    <content-header>Edit Text: Only Numbers</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6" class="flex-column">
              <b-edit-text
                v-model="editNumbers.value"
                :only-numbers="true"
                label="Ld Edit Numbers"
                label-size="4"
                :size="editNumbers.size"
                :disabled="editNumbers.disabled"
                :readonly="editNumbers.readonly"
                :required="editNumbers.required"
                :suffix="editNumbers.setSuffix ? 'Suffix' : undefined"
                :color="editNumbers.color"
                :help="
                  editNumbers.help
                    ? {
                        tooltip: editNumbers.help === 1 ? 'input tooltip' : '',
                        link: editNumbers.help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
              <b-edit-text
                v-model="editNumbers.maskedValue"
                :only-numbers="true"
                label="Ld Edit Numbers: minValue, maxValue"
                input-hint="min 100, max 1000"
                persistentHint
                :min-value="100"
                :max-value="1000"
                label-size="4"
                :size="editNumbers.size"
                :disabled="editNumbers.disabled"
                :readonly="editNumbers.readonly"
                :required="editNumbers.required"
                :suffix="editNumbers.setSuffix ? 'Suffix' : undefined"
                :color="editNumbers.color"
                :help="
                  editNumbers.help
                    ? {
                        tooltip: editNumbers.help === 1 ? 'input tooltip' : '',
                        link: editNumbers.help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
              <b-edit-text
                v-model="editNumbers.signedValue"
                :only-numbers="true"
                label="Ld Edit Numbers: signed"
                input-hint="input a negative numbers"
                persistentHint
                :signed="true"
                label-size="4"
                :size="editNumbers.size"
                :disabled="editNumbers.disabled"
                :readonly="editNumbers.readonly"
                :required="editNumbers.required"
                :suffix="editNumbers.setSuffix ? 'Suffix' : undefined"
                :color="editNumbers.color"
                :help="
                  editNumbers.help
                    ? {
                        tooltip: editNumbers.help === 1 ? 'input tooltip' : '',
                        link: editNumbers.help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
            </v-col>
            <v-col cols="3">
              <b-switch v-model="editNumbers.disabled" label="disabled" hide-details />
              <b-switch v-model="editNumbers.readonly" label="readonly" hide-details />
              <b-switch v-model="editNumbers.required" label="required" hide-details />
              <b-switch v-model="editNumbers.setSuffix" label="setSuffix" hide-details />
              <b-radiogroup v-model="editNumbers.help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="editNumbers.size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="x-small"></b-radiobutton>
                <b-radiobutton value="m" label="small"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="editNumbers.color" label="color" label-on-top hide-details>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['edittext.numbers.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
    <content-header>Edit Text: Password</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <b-edit-text
                type="password"
                v-model="editPassword.model"
                v-model:value="editPassword.password"
                label="Password"
                :size="editPassword.size"
                :disabled="editPassword.disabled"
                :readonly="editPassword.readonly"
                :required="editPassword.required"
                :suffix="editPassword.setSuffix ? 'Suffix' : undefined"
                :color="editPassword.color"
                :help="
                  editPassword.help
                    ? {
                        tooltip: editPassword.help === 1 ? 'input tooltip' : '',
                        link: editPassword.help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
            </v-col>
            <v-col cols="3">
              <b-switch v-model="editPassword.disabled" label="disabled" hide-details />
              <b-switch v-model="editPassword.readonly" label="readonly" hide-details />
              <b-switch v-model="editPassword.required" label="required" hide-details />
              <b-switch v-model="editPassword.setSuffix" label="setSuffix" hide-details />
              <b-radiogroup v-model="editPassword.help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="editPassword.size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="x-small"></b-radiobutton>
                <b-radiobutton value="m" label="small"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="editPassword.color" label="color" label-on-top hide-details>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
          <v-row>
            <v-col> Input Password: {{ editPassword.password }} </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['edittext.password.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
    <content-header>Edit Masked Text</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <ld-edit-masked-text
                v-model="maskedText.value"
                :disabled="editMaskedText.disabled"
                :readonly="editMaskedText.readonly"
                mask="000-000-000 00"
                label="Ld Edit Masked Text"
                input-hint="Mask: 000-000-000 00"
                persistent-hint
                :size="editMaskedText.size"
                :color="editMaskedText.color"
                :help="
                  editMaskedText.help
                    ? {
                        tooltip: editMaskedText.help === 1 ? 'input tooltip' : '',
                        link: editMaskedText.help === 2 ? 'yandex.ru' : '',
                      }
                    : null
                "
              />
            </v-col>
            <v-col cols="3">
              <b-switch v-model="editMaskedText.disabled" label="disabled" hide-details />
              <b-switch v-model="editMaskedText.readonly" label="readonly" hide-details />
              <b-radiogroup v-model="editMaskedText.help" label="help" label-on-top hide-details>
                <b-radiobutton :value="0" label="None"></b-radiobutton>
                <b-radiobutton :value="1" label="Tooltip"></b-radiobutton>
                <b-radiobutton :value="2" label="Link"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="editMaskedText.size" label="size" label-on-top hide-details>
                <b-radiobutton value="s" label="x-small"></b-radiobutton>
                <b-radiobutton value="m" label="small"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="editMaskedText.color" label="color" label-on-top hide-details>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="12"> Input Value: {{ maskedText.value }} </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['edittext.mask.md']" />
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
      editText: {
        value: '',
        disabled: false,
        readonly: false,
        required: false,
        debounced: false,
        clearable: false,
        help: 0,
        setPrefix: false,
        setSuffix: false,
        hideDetails: false,
        size: 's',
        color: 'grey',
        setIcon: false,
        labelonTop: false,
      },
      editNumbers: {
        value: '',
        signedValue: '',
        maskedValue: '',
        size: 's',
        disabled: false,
        readonly: false,
        required: false,
        setSuffix: false,
        help: 0,
        color: 'grey',
      },
      editPassword: {
        model: '1234',
        password: '',
        disabled: false,
        readonly: false,
        required: false,
        setSuffix: false,
        size: 's',
        help: 0,
        color: 'grey',
      },
      editMaskedText: {
        disabled: false,
        readonly: false,
        size: 's',
        color: 'grey',
        help: 0,
      },
      maskedText: {
        value: '',
      },
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['edittext.main.md', 'edittext.numbers.md', 'edittext.password.md', 'edittext.mask.md'];
    },
  },
};
</script>
