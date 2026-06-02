<template>
  <v-container class="d-flex flex-column">
    <content-header>Buttons: Default</content-header>
    <content-body h="500">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <b-button
                v-for="i in [1, 2]"
                :key="i"
                :color="main.color"
                :variant="main.variant"
                :loading="main.loading"
                :disabled="main.disabled"
                :size="main.size"
                :icon="main.icon"
                :text="main.text"
                :block="main.block"
                class="mx-2"
                :class="{ 'mb-2': main.block }"
              >
                <b-icon>plus</b-icon>
                <span v-if="!main.icon">Button</span>
                <template #text> <span v-if="main.icon">Button tooltip</span> </template>
                <b-icon v-if="!main.icon">chevron-down</b-icon>
              </b-button>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col>
                  <b-radiogroup v-model="main.color" row :column="false" hide-details label="color:" label-on-top>
                    <b-radiobutton label="primary" value="primary" />
                    <b-radiobutton label="success" value="success" />
                    <b-radiobutton label="error" value="error" />
                    <b-radiobutton label="grey" value="grey" />
                  </b-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <b-radiogroup v-model="main.variant" row :column="false" hide-details label="variant:" label-on-top>
                    <b-radiobutton label="flat" value="flat" />
                    <b-radiobutton label="outlined" value="outlined" />
                    <b-radiobutton label="tonal" value="tonal" />
                    <b-radiobutton label="text" value="text" />
                  </b-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <b-radiogroup v-model="main.size" row :column="false" hide-details label="size:" label-on-top>
                    <b-radiobutton label="small" value="xs" />
                    <b-radiobutton label="medium" value="s" />
                    <b-radiobutton label="large" value="m" />
                    <b-radiobutton label="extra-large" value="l" />
                  </b-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <b-switch v-model="main.icon" label="icon view" hide-details />
                  <b-switch v-model="main.text" label="text" hide-details />
                  <b-switch v-model="main.block" label="block" hide-details />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <b-switch v-model="main.loading" label="loading" hide-details />
              <b-switch v-model="main.disabled" label="disabled" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['buttons.main.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
    <content-header>Buttons: Responsive</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <b-button
                :is-desktop-view="ldButton.view === 'desktop'"
                :is-tablet-view="ldButton.view === 'tablet'"
                :is-mobile-view="ldButton.view === 'mobile'"
                :responsive="ldButton.responsive"
                :tooltip="ldButton.tooltip"
              >
                <template #icon>
                  <b-icon>account</b-icon>
                </template>
                <template #text> Button </template>
              </b-button>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col>
                  <b-radiogroup v-model="ldButton.view" row :column="false" hide-details label="variant:" label-on-top>
                    <b-radiobutton label="desktop" value="desktop" />
                    <b-radiobutton label="tablet" value="tablet" />
                    <b-radiobutton label="mobile" value="mobile" />
                  </b-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <b-switch v-model="ldButton.responsive" label="responsive" hide-details />
                </v-col>
                <v-col>
                  <b-switch v-model="ldButton.tooltip" label="tooltip" hide-details />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['buttons.responsive.md']" />
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
      main: {
        color: 'primary',
        variant: 'flat',
        loading: false,
        disabled: false,
        size: 'xs',
        icon: false,
        text: false,
        block: false,
      },
      ldButton: {
        color: 'primary',
        view: 'desktop',
        responsive: true,
        tooltip: true,
      },
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['buttons.main.md', 'buttons.responsive.md'];
    },
  },
};
</script>
