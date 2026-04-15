<template>
  <v-container class="d-flex flex-column">
    <content-header>Datatable</content-header>
    <content-body h="800" h-100>
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3 overflow-hidden" style="height: 400px">
            <v-col cols="12" class="h-100 overflow-hidden pa-4">
              <v-card class="h-100" elevation="3">
                <v-card-text class="h-100" v-if="datatableReady">
                  <ld-datatable
                    id="datatable"
                    ref="table"
                    :loading-indicator="loading"
                    column-mode="flex"
                    :group-rows-by="groupBy"
                    :group-expansion-default="true"
                    :group-row-height="26"
                    v-model:group-expanded-state="groupState"
                    v-model:group-expansion="groupExpansion"
                    :treeFromRelation="hierarchical ? 'company.parentId' : undefined"
                    :treeToRelation="hierarchical ? 'company.id' : undefined"
                    :sortType="multisort ? 'multi' : 'single'"
                    :rows="rows"
                    :columns="columns"
                    :selectionType="multiselect ? 'multiClick' : 'single'"
                    check-mode="checkNoSelect"
                    :checkboxable="checkboxable"
                    :enumerable="enumerable"
                    :selected="selected"
                    :checked="checked"
                    :selectAllRowsOnPage="true"
                    :scrollbar-h="true"
                    :scrollbar-v="true"
                    :count="pagerOptions.total"
                    :offset="pagerOptions.page - 1"
                    :rowIdentity="rowIdentity"
                    :sorts="sorts"
                    :external-paging="true"
                    :messages="{ emptyMessage: 'Нет данных' }"
                    :bordered="bordered"
                    :colorize="colorize"
                    :size="size"
                    :drag-data="draggable ? dragData : null"
                    @reorder="reorder"
                    @resize="resize"
                    @sort="sort"
                    @activate="activate"
                    @select="select"
                    @check="check"
                    @tree-action="tree"
                    @page="page"
                  >
                    <template #cell="scope">
                      <ld-avatar v-if="scope.column.prop === 'last_name' && avatars" :size="size">
                        <template #avatar> {{ getShortName(scope.row) }} </template>
                        <template #content>
                          {{ `${scope.row.last_name}, ${scope.row.first_name}` }}
                        </template>
                        <template #hint>
                          {{ scope.row.email }}
                        </template>
                      </ld-avatar>
                      <span v-else>{{ scope.value }}</span>
                    </template>
                    <template #group-header="scope">
                      <span v-if="Boolean(scope)">
                        <b>{{ scope.groupName }}:</b> {{ scope.group.key }}
                      </span>
                    </template>
                    <template #header:controls>
                      <ld-button icon text @click="openSettings">
                        <ld-icon>edit_grid</ld-icon>
                      </ld-button>
                      <v-menu>
                        <template #activator="{ props }">
                          <ld-button icon text v-bind="props">
                            <ld-icon>more_vert</ld-icon>
                          </ld-button>
                        </template>
                        <v-list>
                          <v-list-item
                            @click="
                              () => {
                                multisort = !multisort;
                              }
                            "
                          >
                            <v-list-item-title>
                              <span v-if="multisort">Отключить многоуровневую сортировку</span>
                              <span v-else>Включить многоуровневую сортировку</span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="
                              () => {
                                contextMenu = !contextMenu;
                              }
                            "
                          >
                            <v-list-item-title>
                              <span v-if="contextMenu"> Отключить контекстное меню </span>
                              <span v-else> Включить контекстное меню </span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="
                              () => {
                                avatars = !avatars;
                              }
                            "
                          >
                            <v-list-item-title>
                              <span v-if="avatars">Скрыть аватары пользователей</span>
                              <span v-else>Отобразить аватары пользователей</span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="
                              () => {
                                bordered = !bordered;
                              }
                            "
                          >
                            <v-list-item-title>
                              <span v-if="bordered">Скрыть границы ячеек</span>
                              <span v-else>Показать границы ячеек</span>
                            </v-list-item-title>
                          </v-list-item>

                          <v-list-item
                            v-if="groupBy"
                            @click="
                              () => {
                                groupExpansion = 0;
                              }
                            "
                          >
                            <v-list-item-title> Свернуть все группы </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-if="groupBy"
                            @click="
                              () => {
                                groupExpansion = 1;
                              }
                            "
                          >
                            <v-list-item-title> Развернуть все группы </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template #cell-header:append="{ column, hover }">
                      <v-menu v-model="menu[column.prop]" :close-on-content-click="false">
                        <template #activator="{ props }">
                          <ld-button icon text v-if="hover" v-bind="props">
                            <ld-icon>filter</ld-icon>
                          </ld-button>
                        </template>
                        <v-card width="300" class="pa-3">
                          <v-card-text class="pa-0">
                            <ld-edit-text label="Поиск" hide-details></ld-edit-text>
                          </v-card-text>
                          <v-card-actions class="d-flex justify-end pa-0">
                            <ld-button
                              @click="
                                () => {
                                  menu[column.prop] = false;
                                }
                              "
                            >
                              Применить
                            </ld-button>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </template>
                    <template v-if="contextMenu" #context-menu="{ row, column, cancel }">
                      <v-list>
                        <v-list-item> Копировать </v-list-item>
                        <v-list-item> Открыть </v-list-item>
                        <v-list-item> Удалить </v-list-item>
                      </v-list>
                    </template>
                  </ld-datatable>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"> groupState: {{ groupState }} </v-col>
            <v-col cols="12"> checked: {{ checked }} </v-col>
            <v-col cols="12"> selected: {{ selected }} </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <v-row>
            <v-col cols="12">
              <ld-expansion-panels>
                <ld-expansion-panel title="Usage">
                  <markdown-to-html v-if="!templatesLoading" :template="templates['datatable.main.md']" />
                </ld-expansion-panel>
                <ld-expansion-panel title="Props">
                  <markdown-to-html v-if="!templatesLoading" :template="templates['datatable.props.md']" />
                </ld-expansion-panel>
                <ld-expansion-panel title="Slots">
                  <markdown-to-html v-if="!templatesLoading" :template="templates['datatable.slots.md']" />
                </ld-expansion-panel>
                <ld-expansion-panel title="Events">
                  <markdown-to-html v-if="!templatesLoading" :template="templates['datatable.events.md']" />
                </ld-expansion-panel>
              </ld-expansion-panels>
            </v-col>
          </v-row>
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef, @typescript-eslint/naming-convention */
import cloneDeep from 'lodash-es/cloneDeep';
import { DialogManager } from '@/ld-dialog/dialog.manager';
import { CreateEditDialog } from '@/ld-dialog/dialogs';
import markdownToHTML from './mixins/markdownToHTML';

export default {
  data() {
    return {
      loading: true,
      bordered: false,
      size: 's',
      datatableReady: true,
      menu: {},
      rows: [],
      columns: [],
      selected: [],
      checked: [],
      pagerOptions: {
        page: 1,
        total: null,
      },
      sorts: [],
      groupState: null,
      groupExpansion: 1,
      checkboxable: true,
      multiselect: false,
      enumerable: false,
      multisort: false,
      hierarchical: false,
      colorized: false,
      groupBy: null,
      avatars: false,
      contextMenu: false,
      draggable: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  created() {
    this.columns = this.getColumns();
    this.columns.forEach(c => {
      this.menu[c.prop] = false;
    });
  },
  mounted() {
    this.getRows();
  },
  watch: {
    checkboxable() {
      this.updateDatatable();
    },
    multiselect() {
      this.updateDatatable();
    },
    enumerable() {
      this.updateDatatable();
    },
    multisort() {
      this.updateDatatable();
    },
    avatars() {
      this.columns = this.getColumns();
    },
    async hierarchical(value) {
      this.rows = [];
      await this.getRows();
      if (value) {
        this.columns = [
          {
            prop: 'company.name',
            isTreeColumn: true,
          },
          ...this.columns,
        ];
      } else {
        this.columns = this.columns.filter(c => !c.isTreeColumn);
      }
      this.updateDatatable();
    },
  },
  computed: {
    library() {
      return ['datatable.main.md', 'datatable.props.md', 'datatable.events.md', 'datatable.slots.md'];
    },
    dragData() {
      return {
        draggable: true,
        // canDrag: row => {
        //   if (row.id === 3) {
        //     return false;
        //   }
        // },
        // canDrop: row => {
        //   if (row.id === 4) {
        //     return false;
        //   }
        // },
        dragstart: (event, row) => {
          /* eslint-disable no-console */
          console.log(event);
          console.log(row);
        },
        drop: (event, row) => {
          /* eslint-disable no-console */
          console.log(event);
          console.log(row);
        },
      };
    },
  },
  methods: {
    getColumns() {
      return [
        {
          name: 'First Name',
          prop: 'first_name',
          visible: !this.avatars,
        },
        {
          name: this.avatars ? 'User' : 'Last Name',
          prop: 'last_name',
        },
        {
          name: 'E-mail',
          prop: 'email',
          visible: !this.avatars,
        },
        {
          name: 'City',
          prop: 'city',
        },
        {
          name: 'Gender',
          prop: 'gender',
        },
      ];
    },
    getRows() {
      this.loading = true;
      return new Promise(resolve =>
        fetch('/mock.json')
          .then(res => res.json())
          .then(rows => {
            if (this.hierarchical) {
              this.rows = this.$utils.removeDuplicates(rows, 'company.name');
            } else {
              this.rows = rows;
            }
            this.loading = false;
            return resolve();
          })
          .catch(e => {
            /* eslint-disable no-console */
            console.log(e);
          })
      );
    },
    rowIdentity(row) {
      return row.id;
    },
    reorder() {
      //
    },
    resize() {
      //
    },
    sort() {
      //
    },
    activate() {
      //
    },
    select({ selected }) {
      this.selected = selected;
    },
    check({ checked }) {
      this.checked = checked;
    },
    tree() {
      //
    },
    page() {
      //
    },
    updateDatatable() {
      this.datatableReady = false;
      this.$nextTick(() => {
        this.datatableReady = true;
      });
    },
    async openSettings() {
      const res = await DialogManager.exec(
        new CreateEditDialog({
          title: 'Настройки таблицы',
          component: 'grid-settings',
          componentProps: {
            model: {
              size: this.size,
              multisort: this.multisort,
              checkboxable: this.checkboxable,
              enumerable: this.enumerable,
              hierarchical: this.hierarchical,
              groupBy: this.groupBy,
              colorized: this.colorized,
              draggable: this.draggable,
            },
            columns: cloneDeep(this.columns),
          },
          width: '45%',
          align: 'right',
          fullHeight: true,
        })
      );
      if (!res) {
        return;
      }
      const { settings, columns } = res;
      this.size = settings.size;
      this.multisort = settings.multisort;
      this.checkboxable = settings.checkboxable;
      this.enumerable = settings.enumerable;
      this.hierarchical = settings.hierarchical;
      this.groupBy = settings.groupBy;
      this.colorized = settings.colorized;
      this.draggable = settings.draggable;
      this.columns = columns;
      this.updateDatatable();
    },
    colorize(row) {
      if (this.colorized) {
        return row.city === 'Tokyo' ? 'warning' : row.city === 'London' ? 'error' : null;
      }
      return null;
    },
    getShortName(row) {
      const firstLetter = value => {
        if (typeof value === 'string' && value.length) {
          return value.split('')[0];
        }
        return value;
      };
      return [firstLetter(row.first_name).toUpperCase(), firstLetter(row.last_name).toUpperCase()].join('');
    },
  },
};
</script>
