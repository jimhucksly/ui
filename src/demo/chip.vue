<template>
  <v-container class="d-flex flex-column">
    <content-header>Chip</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <ld-chip
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
              </ld-chip>
              <div class="text-body-l pa-3 error--text" v-if="click">click!</div>
            </v-col>
            <v-col cols="4">
              <ld-radiogroup row :column="false" v-model="size" label="size:" label-on-top hide-details>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="m" label="medium"></ld-radiobutton>
                <ld-radiobutton value="l" label="large"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup row :column="false" v-model="color" label="color:" label-on-top hide-details>
                <ld-radiobutton value="primary" label="primary"></ld-radiobutton>
                <ld-radiobutton value="grey" label="grey"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup row :column="false" v-model="variant" label="variant:" label-on-top hide-details>
                <ld-radiobutton value="flat" label="flat"></ld-radiobutton>
                <ld-radiobutton value="outlined" label="outlined"></ld-radiobutton>
                <ld-radiobutton value="tonal" label="tonal"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
            <v-col cols="4">
              <ld-switch v-model="closable" label="closable" hide-details />
              <ld-switch v-model="clickable" label="clickable" hide-details />
              <ld-switch v-model="disabled" label="disabled" hide-details />
              <ld-switch v-model="activation" label="activation" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['chip.md']" />
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
