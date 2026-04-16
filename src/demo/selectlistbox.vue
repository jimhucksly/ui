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
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col>
                  <ld-select-list-box
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
                    :help="
                      help
                        ? {
                            tooltip: help === 1 ? 'input tooltip' : '',
                            link: help === 2 ? 'yandex.ru' : '',
                          }
                        : null
                    "
                  >
                    <template v-if="customTag" #tag="{ item, canRemove, onRemove }">
                      <ld-chip
                        :key="item.id"
                        :closable="canRemove"
                        :color="canRemove ? 'primary' : 'grey'"
                        @click:close="onRemove(item)"
                      >
                        {{ 'custom tag: ' + item.first_name }}
                      </ld-chip>
                    </template>
                    <template v-if="customTagOverflow" #tag-overflow="{ limit, count }">
                      <ld-chip color="primary">
                        <span> more then {{ limit }}: {{ count - limit }}</span>
                      </ld-chip>
                    </template>
                    <template v-if="customOption" #option="{ item, isSelected }">
                      <span :class="{ 'primary--text': isSelected }">
                        {{ `custom option: ${item.first_name} ${item.last_name}` }}
                      </span>
                    </template>
                    <template v-if="optionIcon" #option-icon="{ item, isSelected }">
                      <ld-icon :color="isSelected ? 'primary' : 'grey'">user</ld-icon>
                    </template>
                    <template v-if="customIcon" #icon="{ focus }">
                      <ld-icon :color="focus ? 'primary' : 'grey'">user</ld-icon>
                    </template>
                  </ld-select-list-box>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"> Input Value: {{ value }} </v-col>
                <v-col cols="12"> Selected: {{ selected }} </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <ld-switch label="readonly" v-model="readonly" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="multiselect" v-model="multiselect" hide-details />
              <ld-switch label="required" v-model="required" hide-details />
              <ld-switch label="clearable" v-model="clearable" hide-details />
              <ld-switch label="return object" v-model="returnObject" hide-details />
              <ld-switch label="chips" v-model="chips" hide-details />
              <ld-switch label="closableChips" v-model="closableChips" hide-details />
              <ld-switch label="hideDetails" v-model="hideDetails" hide-details />
              <ld-switch label="input hint" v-model="inputHint" hide-details />
              <ld-switch label="highlight" v-model="highlight" hide-details />
              <ld-switch label="limit (4)" v-model="limit" hide-details />
              <ld-switch label="custom tags" v-model="customTag" hide-details />
              <ld-switch label="custom overflow tag" v-model="customTagOverflow" hide-details />
              <ld-switch label="custom option" v-model="customOption" hide-details />
              <ld-switch label="option icon" v-model="optionIcon" hide-details />
              <ld-switch label="option hint" v-model="optionHint" hide-details />
              <ld-switch label="custom icon" v-model="customIcon" hide-details />
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
          <markdown-to-html v-if="!templatesLoading" :template="templates['selectlistbox.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import { delay } from '@dn-web/core';
import { DialogManager } from '@/ld-dialog/dialog.manager';
import { SelectDialog } from '@/ld-dialog/dialogs';
import markdownToHTML from './mixins/markdownToHTML';
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
          height: '450px',
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
