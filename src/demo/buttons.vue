<template>
  <v-container class="d-flex flex-column">
    <content-header>Buttons: Default</content-header>
    <content-body h="500">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <ld-button
                v-for="i in [1, 2]"
                :key="i"
                :color="main.color"
                :variant="main.variant"
                :loading="main.loading"
                :disabled="main.disabled"
                :size="main.size"
                :icon="main.icon"
                :text="main.text"
                class="mx-2"
              >
                <ld-icon>plus</ld-icon>
                <span v-if="!main.icon">Button</span>
                <template #text> <span v-if="main.icon">Button tooltip</span> </template>
                <ld-icon v-if="!main.icon">chevron-down</ld-icon>
              </ld-button>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col>
                  <ld-radiogroup v-model="main.color" row :column="false" hide-details label="color:" label-on-top>
                    <ld-radiobutton label="primary" value="primary" />
                    <ld-radiobutton label="success" value="success" />
                    <ld-radiobutton label="error" value="error" />
                    <ld-radiobutton label="grey" value="grey" />
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <ld-radiogroup v-model="main.variant" row :column="false" hide-details label="variant:" label-on-top>
                    <ld-radiobutton label="flat" value="flat" />
                    <ld-radiobutton label="outlined" value="outlined" />
                    <ld-radiobutton label="tonal" value="tonal" />
                    <ld-radiobutton label="text" value="text" />
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <ld-radiogroup v-model="main.size" row :column="false" hide-details label="size:" label-on-top>
                    <ld-radiobutton label="small" value="xs" />
                    <ld-radiobutton label="medium" value="s" />
                    <ld-radiobutton label="large" value="m" />
                    <ld-radiobutton label="extra-large" value="l" />
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <ld-switch v-model="main.icon" label="icon view" hide-details />
                  <ld-switch v-model="main.text" label="text" hide-details />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <ld-switch v-model="main.loading" label="loading" hide-details />
              <ld-switch v-model="main.disabled" label="disabled" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['buttons.main.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
    <content-header>Buttons: Responsive</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <ld-button
                :is-desktop-view="ldButton.view === 'desktop'"
                :is-tablet-view="ldButton.view === 'tablet'"
                :is-mobile-view="ldButton.view === 'mobile'"
                :responsive="ldButton.responsive"
                :tooltip="ldButton.tooltip"
              >
                <template #icon>
                  <ld-icon>account</ld-icon>
                </template>
                <template #text> Button </template>
              </ld-button>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col>
                  <ld-radiogroup v-model="ldButton.view" row :column="false" hide-details label="variant:" label-on-top>
                    <ld-radiobutton label="desktop" value="desktop" />
                    <ld-radiobutton label="tablet" value="tablet" />
                    <ld-radiobutton label="mobile" value="mobile" />
                  </ld-radiogroup>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <ld-switch v-model="ldButton.responsive" label="responsive" hide-details />
                </v-col>
                <v-col>
                  <ld-switch v-model="ldButton.tooltip" label="tooltip" hide-details />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['buttons.responsive.md']" />
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
      main: {
        color: 'primary',
        variant: 'flat',
        loading: false,
        disabled: false,
        size: 'xs',
        icon: false,
        text: false,
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
