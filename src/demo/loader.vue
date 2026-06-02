<template>
  <v-container class="d-flex flex-column">
    <content-header>Loader</content-header>
    <content-body h="450">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
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
              <b-radiogroup v-model="size" label="size" label-on-top hide-details>
                <b-radiobutton value="xs" label="x-small"></b-radiobutton>
                <b-radiobutton value="s" label="small"></b-radiobutton>
                <b-radiobutton value="m" label="medium"></b-radiobutton>
                <b-radiobutton value="l" label="large"></b-radiobutton>
                <b-radiobutton value="xl" label="x-large"></b-radiobutton>
              </b-radiogroup>
              <b-switch v-model="transparent" label="transparent" class="mb-2" hide-details />
              <b-edit-text label="opacity" v-model="opacity" :label-on-top="false" />
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="view" label="view" label-on-top hide-details>
                <b-radiobutton value="circle" label="circle"></b-radiobutton>
                <b-radiobutton value="dots" label="dots"></b-radiobutton>
              </b-radiogroup>
              <b-radiogroup v-model="color" label="color" label-on-top hide-details>
                <b-radiobutton value="primary" label="primary"></b-radiobutton>
                <b-radiobutton value="success" label="success"></b-radiobutton>
                <b-radiobutton value="warning" label="warning"></b-radiobutton>
                <b-radiobutton value="error" label="error"></b-radiobutton>
                <b-radiobutton value="white" label="white"></b-radiobutton>
              </b-radiogroup>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['loader.md']" />
        </b-tab>
      </b-tabs>
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
