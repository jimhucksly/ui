<template>
  <v-container class="d-flex flex-column">
    <content-header>
      <template #default>Select</template>
      <template #description>
        Компонент предназначен для выбора элементов из статичного ограниченного списка элементов без фильтрации
      </template>
    </content-header>
    <content-body h="650">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <b-select
                    v-model="value"
                    v-model:model-items="selected"
                    :items="items"
                    :input-hint="inputHint ? 'select input hint' : null"
                    persistent-hint
                    label="Ld select"
                    item-title="first_name"
                    item-value="id"
                    :multiselect="multiselect"
                    :readonly="readonly"
                    :disabled="disabled"
                    :required="required"
                    :hide-details="hideDetails"
                    :label-on-top="labelOnTop"
                    :return-object="returnObject"
                    :chips="chips"
                    :closable-chips="closableChips"
                    :size="size"
                    :color="color"
                    :option-hint="optionHint"
                    :placeholder="placeholder ? 'Выберите из списка' : undefined"
                    :limit="3"
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  >
                    <template #option="{ item }">
                      <ld-avatar v-if="avatar" size="m">
                        <template #avatar>
                          <img src="/avatar.png" alt="" />
                        </template>
                        <template #content> {{ `${item.first_name} ${item.last_name}` }} </template>
                        <template #hint>{{ item.email }}</template>
                      </ld-avatar>
                      <template v-else>
                        <div class="d-flex align-center">
                          <b-icon color="grey" class="mr-1" v-if="icons">user</b-icon>
                          <span> {{ item.first_name }}</span>
                        </div>
                      </template>
                    </template>
                    <template #option-hint="{ item }">
                      <span :style="{ 'padding-left': icons ? '28px' : 0 }">{{ item.gender }}</span>
                    </template>
                  </b-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col> Input Value: {{ value }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column">
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="multiselect" v-model="multiselect" hide-details />
              <b-switch label="required" v-model="required" hide-details />
              <b-switch label="return object" v-model="returnObject" hide-details />
              <b-switch label="chips" v-model="chips" hide-details />
              <b-switch label="closableChips" v-model="closableChips" hide-details />
              <b-switch label="hideDetails" v-model="hideDetails" hide-details />
              <b-switch label="input hint" v-model="inputHint" hide-details />
              <b-switch label="option hint" v-model="optionHint" hide-details />
              <b-switch label="avatar as list item" v-model="avatar" hide-details />
              <b-switch label="show icons" v-model="icons" hide-details />
              <b-switch label="label on top" v-model="labelOnTop" hide-details />
              <b-switch label="placeholder" v-model="placeholder" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['select.md']" />
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
      selected: [],
      items: [],
      multiselect: false,
      required: false,
      readonly: false,
      disabled: false,
      returnObject: false,
      chips: false,
      closableChips: true,
      hideDetails: false,
      help: 0,
      size: 's',
      color: 'grey',
      inputHint: true,
      avatar: false,
      icons: false,
      optionHint: false,
      labelOnTop: false,
      placeholder: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  async created() {
    this.items = await this.fetchData();
  },
  computed: {
    library() {
      return ['select.md'];
    },
  },
  methods: {
    fetchData() {
      return fetch('./mock.json')
        .then(response => response.json())
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e);
        });
    },
  },
};
</script>
