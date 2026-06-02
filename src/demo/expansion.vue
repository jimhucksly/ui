<template>
  <v-container class="d-flex flex-column">
    <content-header>Expansion Panels</content-header>
    <content-body h="500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col class="px-4" cols="6">
              <b-expansion-panels :multiple="multiple" v-model="model">
                <b-expansion-panel
                  title="Expansion panel title"
                  :readonly="readonly"
                  :hide-icon="hideIcon"
                  @click="onClick"
                >
                  <b-expansion-panels>
                    <b-expansion-panel title="Expansion panel title">
                      <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
                    </b-expansion-panel>
                  </b-expansion-panels>
                </b-expansion-panel>
                <b-expansion-panel
                  title="Expansion panel title"
                  :readonly="readonly"
                  :hide-icon="hideIcon"
                  @click="onClick"
                >
                  <b-switch v-model="value" label="aaaaaaaaaa"></b-switch>
                </b-expansion-panel>
                <b-expansion-panel
                  title="Expansion panel title"
                  :readonly="readonly"
                  :hide-icon="hideIcon"
                  @click="onClick"
                >
                  <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia, modi.</div>
                </b-expansion-panel>
              </b-expansion-panels>
            </v-col>
            <v-col cols="6">
              <b-switch v-model="multiple" label="multiple" hide-details />
              <b-switch v-model="readonly" label="readonly" hide-details />
              <b-switch v-model="hideIcon" label="hide icon" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['expansion.md']" />
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
      multiple: false,
      readonly: false,
      hideIcon: false,
      model: null,
      value: null,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['expansion.md'];
    },
  },
  methods: {
    onClick(e, i) {
      const target = e.target;
      const icon = target.closest('button[aria-label="expansion-panel-icon"]');
      if (icon) {
        if (!this.$utils.isDefined(this.model)) {
          this.model = this.multiple ? [i] : i;
          return;
        }
        if (Array.isArray(this.model)) {
          if (this.model.includes(i)) {
            this.model = this.model.filter(j => j !== i);
          } else {
            this.model.push(i);
          }
        } else {
          this.model = null;
        }
      }
    },
  },
};
</script>
