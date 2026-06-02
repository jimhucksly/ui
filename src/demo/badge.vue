<template>
  <v-container class="d-flex flex-column">
    <content-header>Badge</content-header>
    <content-body h="400">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <b-badge
                v-for="i in count"
                class="mx-1"
                :color="color"
                :size="size"
                :rounded="rounded"
                :circle="circle"
                :dot="dot"
                :variant="variant"
              >
                {{ circle ? i : 'Badge' }}
              </b-badge>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="color" hide-details label="color:" label-on-top>
                <b-radiobutton label="primary" value="primary" />
                <b-radiobutton label="secondary" value="secondary" />
                <b-radiobutton label="success" value="success" />
                <b-radiobutton label="warning" value="warning" />
                <b-radiobutton label="error" value="error" />
                <b-radiobutton label="grey" value="grey" />
              </b-radiogroup>
            </v-col>
            <v-col cols="3">
              <b-radiogroup v-model="size" hide-details row :column="false" label="size:" label-on-top>
                <b-radiobutton label="small" value="s" />
                <b-radiobutton label="medium" value="m" />
                <b-radiobutton label="large" value="l" />
              </b-radiogroup>
              <b-radiogroup
                v-model="variant"
                class="mb-3"
                hide-details
                row
                :column="false"
                label="variant:"
                label-on-top
              >
                <b-radiobutton label="flat" value="flat" />
                <b-radiobutton label="outlined" value="outlined" />
                <b-radiobutton label="tonal" value="tonal" />
              </b-radiogroup>
              <b-switch v-model="rounded" label="rounded" hide-details />
              <b-switch v-model="circle" label="circle" hide-details />
              <b-switch v-model="dot" label="dot" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['badge.md']" />
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
      count: 3,
      color: 'primary',
      size: 's',
      variant: 'tonal',
      rounded: true,
      circle: false,
      dot: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['badge.md'];
    },
  },
};
</script>
