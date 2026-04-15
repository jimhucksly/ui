<template>
  <v-container class="d-flex flex-column">
    <content-header>Tree View</content-header>
    <content-body h="1600">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-container>
            <v-row>
              <v-col cols="6" style="max-height: 400px; overflow: hidden">
                <div style="height: 100%; overflow-y: auto">
                  <ld-treeview
                    v-if="!loading"
                    ref="tree"
                    v-model:selection="selection"
                    :model="folders"
                    :onSelect="onSelect"
                    :hovered="hovered"
                    :expanded="expanded"
                    v-bind="treeOptions"
                  >
                    <template #default="{ item, disabled }">
                      <div :id="item.id" :key="item.id" class="tree-item" :class="{ disabled }">
                        <span>
                          {{ item.parentId === 0 ? item.nodeData.gender : getName(item) }}
                        </span>
                      </div>
                    </template>
                  </ld-treeview>
                </div>
              </v-col>
              <v-col cols="6">
                <ld-radiogroup
                  v-model="openerPosition"
                  label="openerOpts"
                  label-on-top
                  :column="false"
                  row
                  hide-details
                >
                  <ld-radiobutton value="left" label="left" />
                  <ld-radiobutton value="right" label="right" />
                  <ld-radiobutton value="none" label="none" />
                </ld-radiogroup>
                <ld-radiogroup v-model="clickStrategy" label="click" label-on-top :column="false" row hide-details>
                  <ld-radiobutton value="select" label="select" />
                  <ld-radiobutton value="unfold-on-selection" label="unfold-on-selection" />
                  <ld-radiobutton value="toggle-fold" label="toggle-fold" />
                </ld-radiogroup>
                <ld-radiogroup
                  v-model="selectionStrategy"
                  label="selection"
                  label-on-top
                  :column="false"
                  row
                  hide-details
                >
                  <ld-radiobutton value="single" label="single" />
                  <ld-radiobutton value="multiple" label="multiple" />
                </ld-radiogroup>
                <ld-switch label="disabled" v-model="disabled" hide-details />
                <ld-switch label="hovered" v-model="hovered" hide-details />
                <ld-switch label="draggable" v-model="draggable" hide-details />
                <ld-switch label="droppable" v-model="droppable" hide-details />
                <ld-switch label="remember the nodes state" v-model="viewstate" hide-details />
                <div>Selected: {{ selectedIds }}</div>
              </v-col>
            </v-row>
          </v-container>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['treeview.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import { findTreeNode, toTreeViewModel } from '@ldmjs/treeview/utils';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      items: [],
      folders: [],
      selection: [],
      loading: true,
      openerPosition: 'left',
      clickStrategy: 'select',
      selectionStrategy: 'multiple',
      disabled: false,
      draggable: true,
      droppable: true,
      draggableItem: null,
      expanded: [],
      viewstate: false,
      hovered: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  mounted() {
    const state = this.$utils.cookie.get('ldm-tree-view-nodes-state');
    if (state) {
      this.expanded = JSON.parse(state);
    }
    fetch('/mock.json')
      .then(res => res.json())
      .then(items => {
        const genders = [];
        const roots = [];
        for (const item of items.splice(0, Math.round(items.length / 3))) {
          if (!genders.includes(item.gender)) {
            genders.push(item.gender);
            roots.push({
              ...item,
              id: item.id * -1,
              name: item.gender,
              parentId: 0,
            });
          }
        }
        for (const item of items) {
          item.parentId = roots.find(i => i.gender === item.gender).id;
        }
        this.items = items.concat(roots);
        this.folders = toTreeViewModel(this.items);
        this.loading = false;
        return true;
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.log(e);
      });
  },
  computed: {
    library() {
      return ['treeview.md'];
    },
    treeOptions() {
      return {
        category: 'items',
        unique: item => item.id,
        strategies: {
          click: [this.clickStrategy],
          selection: [this.selectionStrategy, this.mySelectionStrategy.bind(this)],
          fold: this.disabled ? [this.myFoldStrategy.bind(this)] : ['opener-control'],
        },
        disabled: this.disabled ? this.setDisabled.bind(this) : null,
        openerOpts: {
          position: this.openerPosition,
          callback: (item, folded) => {
            if (this.viewstate) {
              if (folded) {
                const state = this.$utils.cookie.get('ldm-tree-view-nodes-state');
                if (state) {
                  const payload = JSON.parse(state).filter(id => id !== item.id);
                  this.$utils.cookie.set('ldm-tree-view-nodes-state', JSON.stringify(payload));
                }
              } else {
                const state = this.$utils.cookie.get('ldm-tree-view-nodes-state');
                if (!state) {
                  const payload = [item.id];
                  this.$utils.cookie.set('ldm-tree-view-nodes-state', JSON.stringify(payload));
                } else {
                  const payload = [...JSON.parse(state), item.id];
                  this.$utils.cookie.set('ldm-tree-view-nodes-state', JSON.stringify(payload));
                }
              }
            }
          },
        },
        dragndrop: {
          draggable: this.draggable,
          droppable: this.droppable,
          drag: item => {
            this.draggableItem = item;
          },
          drop: (item, event, input) => {
            const isFolder = Boolean(item.items);
            if (!isFolder) {
              return;
            }
            const from = findTreeNode(this.folders, this.draggableItem.parentId);
            if (from) {
              from.items = from.items.filter(el => el.id !== this.draggableItem.id);
            }
            item.items.unshift(this.draggableItem);
          },
        },
      };
    },
    selectedIds() {
      if (this.selection?.length) {
        return this.selection.map(item => item.id);
      }
      return [];
    },
  },
  watch: {
    selectionStrategy() {
      this.loading = true;
      this.$nextTick(() => {
        this.loading = false;
      });
    },
  },
  methods: {
    onSelect(selected, item) {
      //
    },
    mySelectionStrategy(item, selection) {
      this.selection = selection;
      return selection;
    },
    myFoldStrategy(item) {
      return true;
    },
    getName(item) {
      return `${item.nodeData?.first_name || ''} ${item.nodeData?.last_name || ''}`;
    },
    setDisabled(item) {
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-item {
  &.disabled {
    color: var(--grey-l-4);
    font-weight: 300;
  }
}
</style>
