<template>
  <ld-expansion-panels v-model="panel" multiple>
    <ld-expansion-panel title="Общие">
      <v-container class="pa-0">
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch
              label="Многоуровневая сортировка"
              v-model="model.multisort"
              :disabled="isMultisortDisabled"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch label="Отображение чекбоксов" v-model="model.checkboxable" hide-details />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch label="Нумерация строк" v-model="model.enumerable" hide-details />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch label="Раскрасить строки :)" v-model="model.colorized" hide-details />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch
              label="Иерархический список"
              v-model="model.hierarchical"
              :disabled="isHierarchicDisabled"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-switch label="Перетаскивание строк" v-model="model.draggable" hide-details />
          </v-col>
        </v-row>
        <v-row no-gutters class="mb-2">
          <v-col>
            <ld-radiogroup v-model="model.size" label="Высота строки" hide-details>
              <ld-radiobutton value="s" label="s (32px)"></ld-radiobutton>
              <ld-radiobutton value="m" label="m (52px)"></ld-radiobutton>
              <ld-radiobutton value="l" label="l (72px)"></ld-radiobutton>
            </ld-radiogroup>
          </v-col>
        </v-row>
      </v-container>
    </ld-expansion-panel>
    <ld-expansion-panel title="Столбцы">
      <ld-datatable :virtualization="false" size="s" column-mode="flex" :rows="columns" :columns="cols">
        <template #cell="{ column, row, value }">
          <ld-switch v-if="column.prop === 'name'" :label="value" v-model="row.visible"> </ld-switch>
          <div v-if="column.prop === 'a'">
            <ld-checkbox
              v-model="row.group"
              :disabled="model.hierarchical"
              @update:model-value="onGroup($event, row)"
            />
          </div>
          <div v-if="column.prop === 'b'">
            <ld-checkbox v-model="row.frozenLeft" :disabled="row.frozenRight" />
          </div>
          <div v-if="column.prop === 'c'">
            <ld-checkbox v-model="row.frozenRight" :disabled="row.frozenLeft" />
          </div>
        </template>
      </ld-datatable>
    </ld-expansion-panel>
  </ld-expansion-panels>
</template>
<script lang="ts">
export default {
  props: ['model', 'columns'],
  data() {
    return {
      panel: [0, 1],
      cols: [
        {
          name: 'Столбец',
          prop: 'name',
        },
        {
          name: 'Сгруппировать',
          prop: 'a',
        },
        {
          name: 'Закреп. слева',
          prop: 'b',
        },
        {
          name: 'Закреп. справа',
          prop: 'c',
        },
      ],
    };
  },
  created() {
    this.$emit('external-component-created', this);
  },
  methods: {
    isChanged() {
      return false;
    },
    save() {
      if (this.model.groupBy && !this.model.groupBy.length) {
        this.model.groupBy = null;
      }
      return {
        settings: this.model,
        columns: this.columns,
      };
    },
    onGroup(value: boolean, row: { name: string; prop: string }) {
      if (!this.model.groupBy) {
        this.model.groupBy = [];
      }
      const index = this.model.groupBy.findIndex((g: { prop: string }) => g.prop === row.prop);
      if (index > -1) {
        if (value) {
          return;
        }
        // remove
        this.model.groupBy[index] = null;
        this.model.groupBy = this.model.groupBy.filter(Boolean);
      } else {
        if (!value) {
          return;
        }
        // add
        this.model.groupBy.push({
          prop: row.prop,
          title: row.name,
        });
      }
    },
  },
  watch: {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'model.multisort'(value: boolean) {
      if (value) {
        this.model.hierarchical = false;
      }
    },
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'model.hierarchical'(value: boolean) {
      if (value) {
        this.model.multisort = false;
        this.model.groupBy = null;
      }
    },
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'model.groupBy'(value: Array<unknown>) {
      if (value && value.length) {
        this.model.hierarchical = false;
      }
    },
  },
  computed: {
    isMultisortDisabled(): boolean {
      return this.model.hierarchical;
    },
    isGroupingDisabled(): boolean {
      return this.model.hierarchical;
    },
    isHierarchicDisabled(): boolean {
      if (this.model.groupBy && this.model.groupBy.length) {
        return true;
      }
      return this.model.multisort;
    },
  },
};
</script>
