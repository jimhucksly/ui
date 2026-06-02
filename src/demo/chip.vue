<template>
  <v-container class="d-flex flex-column">
    <content-header>Chip</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <b-chip
                v-for="i in count"
                class="mx-2"
                :closable="closable"
                :clickable="clickable"
                :disabled="disabled"
                :size="size"
                :tabindex="i"
                :active="activation ? active === i : false"
                :color="color"
                :variant="variant"
                @click="onClick(i)"
                @click:close="onClose"
              >
                Chip
              </b-chip>
              <div class="text-body-l pa-3 error--text" v-if="click">click!</div>
            </v-col>
            <v-col cols="4">
              <b-radiogroup row :column="false" v-model="size" label="size:" label-on-top hide-details>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup row :column="false" v-model="color" label="color:" label-on-top hide-details>
                <b-radiobutton value="primary" label="primary"></b-radiobutton>
                <b-radiobutton value="grey" label="grey"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup row :column="false" v-model="variant" label="variant:" label-on-top hide-details>
                <b-radiobutton value="flat" label="flat"></b-radiobutton>
                <b-radiobutton value="outlined" label="outlined"></b-radiobutton>
                <b-radiobutton value="tonal" label="tonal"></b-radiobutton>
              </b-radiogroup>
            </v-col>
            <v-col cols="4">
              <b-switch v-model="closable" label="closable" hide-details />
              <b-switch v-model="clickable" label="clickable" hide-details />
              <b-switch v-model="disabled" label="disabled" hide-details />
              <b-switch v-model="activation" label="activation" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['chip.md']" />
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
      count: 3,
      closable: true,
      clickable: true,
      disabled: false,
      size: 's',
      color: 'primary',
      variant: 'outlined',
      click: false,
      activation: false,
      active: 0,
    };
  },
  methods: {
    onClose() {
      this.count = this.count - 1;
    },
    onClick(i) {
      if (this.activation) {
        this.active = i;
        return;
      }
      this.click = true;
      setTimeout(() => {
        this.click = false;
      }, 200);
    },
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['chip.md'];
    },
  },
};
</script>
