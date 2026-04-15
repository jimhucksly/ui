<template>
  <v-container class="h-100 pa-0">
    <v-row class="h-100 overflow-hidden">
      <v-col class="h-100 overflow-hidden">
        <ld-datatable
          id="datatable"
          ref="table"
          :rows="rows"
          :columns="$columns"
          column-mode="flex"
          :selection-type="multiselect ? 'multiClick' : 'single'"
          :selected="selected"
          :scrollbar-v="true"
          :rowIdentity="rowIdentity"
          @select="select"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
interface IColumn {
  name: string;
  prop: string;
  flexGrow?: number;
}
interface IRow {
  id: number;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  first_name: string;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  last_name: string;
  city: string;
}
export default {
  emits: ['external-component-created', 'set-result', 'set-result-and-close', 'cancel'],
  props: {
    rows: {
      type: Array,
      default: (): Array<IRow> => [],
    },
    columns: {
      type: Array,
      default: (): Array<IColumn> => [],
    },
    disabledItems: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    selectedItems: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    searchable: Boolean,
    searchFields: {
      type: Array,
      default: (): Array<string> => [],
    },
    isTree: Boolean,
    multiselect: Boolean,
  },
  data(): {
    isChanged: boolean;
    selected: Array<IRow>;
  } {
    return {
      isChanged: false,
      selected: [],
    };
  },
  created() {
    this.$emit('external-component-created', this);
    if (this.selectedItems?.length) {
      this.selected = this.selectedItems;
    }
  },
  computed: {
    $columns(): Array<IColumn> {
      if (this.columns.length) {
        return this.columns;
      }
      return [
        {
          name: 'id',
          prop: 'id',
          flexGrow: 1,
        },
        {
          name: 'first_name',
          prop: 'first_name',
          flexGrow: 2,
        },
        {
          name: 'last_name',
          prop: 'last_name',
          flexGrow: 2,
        },
      ];
    },
  },
  methods: {
    select({ selected }: { selected: Array<IRow> }) {
      this.selected = selected;
      this.$emit('set-result', selected);
    },
    rowIdentity(row: IRow) {
      return row.id;
    },
  },
};
</script>
