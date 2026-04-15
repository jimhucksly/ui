<template>
  <v-container class="d-flex flex-column">
    <content-header>
      <template #default> Combobox </template>
      <template #description>
        Компонент предназначен для выбора элементов из ограниченного списка элементов, статичного или получаемого с
        сервера, с применением внутренней или серверной фильтрации. <br />Элементами списка могут быть как примитивные
        значения, так и объекты.
      </template>
    </content-header>
    <content-body h="1400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-row>
                <v-col class="d-flex justify-end">
                  <ld-radiogroup v-model="listType" row :column="false" direction="rtl" label-on-top hide-details>
                    <ld-radiobutton value="strings" label="list of strings" />
                    <ld-radiobutton value="objects" label="list of objects" />
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-if="ready">
                  <ld-combobox
                    v-model="value"
                    v-model:model-items="selected"
                    label="Ld Combobox"
                    :items="items"
                    item-value="id"
                    item-title="first_name"
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
                    :label-on-top="labelOnTop"
                    :fetch-data="fetchData"
                    :internal-search="internalSearch"
                    :lazy-load="lazyLoad"
                    :option-hint="optionHint"
                    :input-hint="inputHint ? 'Combobox input hint' : null"
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
                    <template v-if="customOption || avatar" #option="{ item, isSelected, searchText }">
                      <ld-avatar v-if="avatar" size="m">
                        <template #avatar>
                          <img src="/avatar.png" alt="" />
                        </template>
                        <template #content>
                          <span v-html="highlightText(item, searchText)"></span>
                        </template>
                        <template #hint>{{ item.email }}</template>
                      </ld-avatar>
                      <span v-else :class="{ 'primary--text': isSelected }">
                        {{ `custom option: ${item.first_name} ${item.last_name}` }}
                      </span>
                    </template>
                    <template v-if="optionIcon" #option-icon="{ item, isSelected }">
                      <ld-icon :color="isSelected ? 'primary' : 'grey'">user</ld-icon>
                    </template>
                  </ld-combobox>
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
              <ld-switch label="internal search" v-model="internalSearch" hide-details />
              <ld-switch label="highlight" v-model="highlight" hide-details />
              <ld-switch label="limit (4)" v-model="limit" hide-details />
              <ld-switch label="lazyLoad" v-model="lazyLoad" hide-details />
              <ld-switch label="custom tags" v-model="customTag" hide-details />
              <ld-switch label="custom overflow tag" v-model="customTagOverflow" hide-details />
              <ld-switch label="custom option" v-model="customOption" hide-details />
              <ld-switch label="option icon" v-model="optionIcon" hide-details />
              <ld-switch label="option hint" v-model="optionHint" hide-details />
              <ld-switch label="avatar as list item" v-model="avatar" hide-details />
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
          <v-row>
            <v-col>
              <markdown-to-html v-if="!templatesLoading" :template="templates['combobox.md']" />
            </v-col>
          </v-row>
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
      listType: 'objects',
      value: null,
      selected: null,
      items: null,
      multiselect: false,
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
      lazyLoad: false,
      ready: true,
      internalSearch: false,
      highlight: true,
      avatar: false,
      labelOnTop: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['combobox.md'];
    },
  },
  watch: {
    lazyLoad(value) {
      if (value) {
        this.items = [];
        this.ready = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.ready = true;
          }, 100);
        });
      }
    },
    listType() {
      this.value = null;
      this.items = [];
      this.avatar = false;
      this.ready = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.ready = true;
        }, 100);
      });
    },
  },
  methods: {
    fetchMock() {
      return new Promise(resolve => {
        fetch('./mock.json')
          .then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            /* eslint-disable no-console */
            console.log(e);
          });
      });
    },
    fetchCities() {
      return new Promise(resolve => {
        this.fetchMock()
          .then(data => {
            const result = Array.from(new Set(data.map(el => el.city)));
            resolve(result);
          })
          .catch(e => {
            /* eslint-disable no-console */
            console.log(e);
          });
      });
    },
    fetchData(searchTerm) {
      return new Promise(resolve => {
        if (this.listType === 'objects') {
          setTimeout(() => {
            this.fetchMock()
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
        }
        if (this.listType === 'strings') {
          setTimeout(() => {
            this.fetchCities()
              .then(data => {
                if (searchTerm) {
                  resolve(data.filter(el => el.toLowerCase().indexOf(searchTerm) > -1));
                }
                resolve(data);
              })
              .catch(e => {
                /* eslint-disable no-console */
                console.log(e);
              });
          }, 1500);
        }
      });
    },
    highlightText(item, text) {
      const title = `${item.first_name} ${item.last_name}`;
      if (!text) {
        return title;
      }
      let result = title;
      const index = title.toLowerCase().indexOf(text.toLowerCase());
      if (index > -1) {
        const slice = title.slice(index, index + text.length);
        result = title
          .split(slice)
          .join(`<span style="color: var(--text); font-family: 'Roboto Semi Bold'"">${slice}</span>`);
      }
      return result;
    },
  },
};
</script>
