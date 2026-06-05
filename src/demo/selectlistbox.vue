<template>
  <v-container class="d-flex flex-column">
    <content-header>
      <template #default>Select List Box</template>
      <template #description>
        Компонент предназначен для выбора элементов из неограниченного источника, например справочника.
        <br />Компонент подгружает только выбранные значения или выполняет контекстный поиск по введенной строке.
      </template>
    </content-header>
    <content-body h="1500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <b-select-list-box
                    v-model="value"
                    v-model:model-items="selected"
                    label="Ld Select List Box"
                    item-title="first_name"
                    item-value="id"
                    item-subtitle="email"
                    :multiselect="multiselect"
                    :chips="chips"
                    :readonly="readonly"
                    :disabled="disabled"
                    :required="required"
                    :clearable="clearable"
                    :highlight="highlight"
                    :return-object="returnObject"
                    :hide-details="hideDetails"
                    :fetch-data="fetchData"
                    :fetch-item="fetchItem"
                    :select="select"
                    :option-hint="optionHint"
                    :input-hint="inputHint ? 'Select list box input hint' : null"
                    persistent-hint
                    :size="size"
                    :color="color"
                    :limit="limit ? 4 : undefined"
                    :label-on-top="labelOnTop"
                    :placeholder="placeholder ? 'Выберите из списка' : undefined"
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  >
                    <template v-if="customTag" #tag="{ item, index, limit: showCount, canRemove, onRemove }">
                      <b-chip
                        v-if="!limit || index < showCount"
                        :key="item.id"
                        :closable="canRemove"
                        :color="canRemove ? 'primary' : 'grey'"
                        @click:close="onRemove(item)"
                      >
                        {{ 'custom tag: ' + item.first_name }}
                      </b-chip>
                    </template>
                    <template v-if="customTagOverflow" #tag-overflow="{ limit, count }">
                      <b-chip color="primary">
                        <span> more then {{ limit }}: {{ count - limit }}</span>
                      </b-chip>
                    </template>
                    <template v-if="customOption" #option="{ item, isSelected }">
                      <span :class="{ 'primary--text': isSelected }">
                        {{ `custom option: ${item.first_name} ${item.last_name}` }}
                      </span>
                    </template>
                    <template v-if="optionIcon" #option-icon="{ item, isSelected }">
                      <b-icon :color="isSelected ? 'primary' : 'grey'">user</b-icon>
                    </template>
                    <template v-if="customIcon" #icon="{ focus }">
                      <b-icon :color="focus ? 'primary' : 'grey'">user</b-icon>
                    </template>
                  </b-select-list-box>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"> Input Value: {{ value }} </v-col>
                <v-col cols="12"> Selected: {{ selected }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <b-switch label="readonly" v-model="readonly" hide-details />
              <b-switch label="disabled" v-model="disabled" hide-details />
              <b-switch label="multiselect" v-model="multiselect" hide-details />
              <b-switch label="required" v-model="required" hide-details />
              <b-switch label="clearable" v-model="clearable" hide-details />
              <b-switch label="return object" v-model="returnObject" hide-details />
              <b-switch label="chips" v-model="chips" hide-details />
              <b-switch label="closableChips" v-model="closableChips" hide-details />
              <b-switch label="hideDetails" v-model="hideDetails" hide-details />
              <b-switch label="input hint" v-model="inputHint" hide-details />
              <b-switch label="highlight" v-model="highlight" hide-details />
              <b-switch label="limit (4)" v-model="limit" hide-details />
              <b-switch label="custom tags" v-model="customTag" hide-details />
              <b-switch label="custom overflow tag" v-model="customTagOverflow" hide-details />
              <b-switch label="custom option" v-model="customOption" hide-details />
              <b-switch label="option icon" v-model="optionIcon" hide-details />
              <b-switch label="option hint" v-model="optionHint" hide-details />
              <b-switch label="custom icon" v-model="customIcon" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['selectlistbox.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import { DialogManager } from '@/b-dialog/dialog.manager';
import { SelectDialog } from '@/b-dialog/dialogs';
import markdownToHTML from './mixins/markdownToHTML';
import { delay } from '@dn-web/core';
export default {
  data() {
    return {
      value: [2, 3],
      selected: null,
      multiselect: true,
      required: false,
      readonly: false,
      disabled: false,
      limit: true,
      help: 0,
      size: 's',
      color: 'grey',
      chips: false,
      closableChips: false,
      clearable: false,
      hideDetails: false,
      inputHint: true,
      returnObject: false,
      customTag: false,
      customTagOverflow: false,
      customOption: false,
      optionIcon: false,
      optionHint: false,
      customIcon: false,
      ready: true,
      highlight: true,
      labelOnTop: false,
      placeholder: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['selectlistbox.md'];
    },
  },
  methods: {
    fetchData(searchTerm) {
      return new Promise(resolve => {
        setTimeout(() => {
          fetch('./mock.json')
            .then(response => response.json())
            .then(data => {
              if (searchTerm) {
                resolve(data.filter(el => el.first_name.toLowerCase().indexOf(searchTerm) > -1));
              }
              resolve(data);
            })
            .catch(e => {
              /* eslint-disable no-console */
              console.log(e);
            });
        }, 1500);
      });
    },
    fetchItem(ids) {
      return new Promise(resolve => {
        setTimeout(() => {
          fetch('./mock.json')
            .then(response => response.json())
            .then(data => resolve(data.filter(item => ids.includes(item.id))))
            .catch(e => {
              /* eslint-disable no-console */
              console.log(e);
            });
        }, 1500);
      });
    },
    async select() {
      const result = await DialogManager.exec(
        new SelectDialog({
          title: 'Select Items',
          component: 'select-component',
          componentProps: {
            rows: [],
            selectedItems: this.selected,
            disabledItems: [],
            multiselect: this.multiselect,
          },
          width: '60%',
          fullHeight: true,
          loading: true,
        }),
        async () => {
          await delay(1000);
          return fetch('/mock.json')
            .then(res => res.json())
            .then(data => ({
              rows: data,
            }));
        }
      );
      return result;
    },
    onCheckRow({ checked }) {
      this.datatableSelected = checked;
    },
  },
};
</script>
