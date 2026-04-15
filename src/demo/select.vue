<template>
  <v-container class="d-flex flex-column">
    <content-header>
      <template #default>Select</template>
      <template #description>
        Компонент предназначен для выбора элементов из статичного ограниченного списка элементов без фильтрации
      </template>
    </content-header>
    <content-body h="650">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <ld-select
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
                          <ld-icon color="grey" class="mr-1" v-if="icons">user</ld-icon>
                          <span> {{ item.first_name }}</span>
                        </div>
                      </template>
                    </template>
                    <template #option-hint="{ item }">
                      <span :style="{ 'padding-left': icons ? '28px' : 0 }">{{ item.gender }}</span>
                    </template>
                  </ld-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col> Input Value: {{ value }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column">
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="multiselect" v-model="multiselect" hide-details />
              <ld-switch label="required" v-model="required" hide-details />
              <ld-switch label="return object" v-model="returnObject" hide-details />
              <ld-switch label="chips" v-model="chips" hide-details />
              <ld-switch label="closableChips" v-model="closableChips" hide-details />
              <ld-switch label="hideDetails" v-model="hideDetails" hide-details />
              <ld-switch label="input hint" v-model="inputHint" hide-details />
              <ld-switch label="option hint" v-model="optionHint" hide-details />
              <ld-switch label="avatar as list item" v-model="avatar" hide-details />
              <ld-switch label="show icons" v-model="icons" hide-details />
              <ld-switch label="label on top" v-model="labelOnTop" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['select.md']" />
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
      value: 2,
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
