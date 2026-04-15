<template>
  <v-container class="d-flex flex-column">
    <content-header>Loader</content-header>
    <content-body h="450">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col
              cols="6"
              class="d-flex align-center justify-center"
              :style="{ 'background-color': color === 'white' ? 'var(--grey-d-1)' : 'none' }"
            >
              <span class="d-block" style="width: 50%">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas tempore et dicta? Aut ducimus sapiente
                deleniti quis temporibus! Numquam, minima?
              </span>
              <loader
                visible
                :size="size"
                :transparent="transparent"
                :view="view"
                :color="color"
                :opacity="Number(opacity)"
              />
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="xs" label="x-small"></ld-radiobutton>
                <ld-radiobutton value="s" label="small"></ld-radiobutton>
                <ld-radiobutton value="m" label="medium"></ld-radiobutton>
                <ld-radiobutton value="l" label="large"></ld-radiobutton>
                <ld-radiobutton value="xl" label="x-large"></ld-radiobutton>
              </ld-radiogroup>
              <ld-switch v-model="transparent" label="transparent" class="mb-2" hide-details />
              <ld-edit-text label="opacity" v-model="opacity" :label-on-top="false" />
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="view" label="view" label-on-top hide-details>
                <ld-radiobutton value="circle" label="circle"></ld-radiobutton>
                <ld-radiobutton value="dotts" label="dotts"></ld-radiobutton>
              </ld-radiogroup>
              <ld-radiogroup v-model="color" label="color" label-on-top hide-details>
                <ld-radiobutton value="primary" label="primary"></ld-radiobutton>
                <ld-radiobutton value="success" label="success"></ld-radiobutton>
                <ld-radiobutton value="warning" label="warning"></ld-radiobutton>
                <ld-radiobutton value="error" label="error"></ld-radiobutton>
                <ld-radiobutton value="white" label="white"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['loader.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      size: 'm',
      transparent: false,
      opacity: 0.5,
      view: 'circle',
      color: 'primary',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['loader.md'];
    },
  },
};
</script>
