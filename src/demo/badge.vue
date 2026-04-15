<template>
  <v-container class="d-flex flex-column">
    <content-header>Badge</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="4">
              <ld-badge
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
              </ld-badge>
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="color" hide-details label="color:" label-on-top>
                <ld-radiobutton label="primary" value="primary" />
                <ld-radiobutton label="secondary" value="secondary" />
                <ld-radiobutton label="success" value="success" />
                <ld-radiobutton label="warning" value="warning" />
                <ld-radiobutton label="error" value="error" />
                <ld-radiobutton label="grey" value="grey" />
              </ld-radiogroup>
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="size" hide-details row :column="false" label="size:" label-on-top>
                <ld-radiobutton label="small" value="s" />
                <ld-radiobutton label="medium" value="m" />
                <ld-radiobutton label="large" value="l" />
              </ld-radiogroup>
              <ld-radiogroup
                v-model="variant"
                class="mb-3"
                hide-details
                row
                :column="false"
                label="variant:"
                label-on-top
              >
                <ld-radiobutton label="flat" value="flat" />
                <ld-radiobutton label="outlined" value="outlined" />
                <ld-radiobutton label="tonal" value="tonal" />
              </ld-radiogroup>
              <ld-switch v-model="rounded" label="rounded" hide-details />
              <ld-switch v-model="circle" label="circle" hide-details />
              <ld-switch v-model="dot" label="dot" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['badge.md']" />
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
