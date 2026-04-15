<template>
  <v-container class="d-flex flex-column">
    <content-header>Avatar</content-header>
    <content-body h="700">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="3">
              <template v-for="i in [1, 2]">
                <ld-avatar class="ma-2" :size="size" :theme="theme" :tabindex="i" :full="full" :online="online">
                  <template #avatar>
                    <img v-if="i === 1" src="/avatar.png" alt="" />
                    <span v-if="i === 2">КД</span>
                  </template>
                  <template #content> Калинина Д.С. </template>
                  <template #hint> kalinina@example.com </template>
                  <template #append v-if="customActions">
                    <v-menu>
                      <template #activator="{ props }">
                        <ld-button icon variant="text" v-bind="props">
                          <ld-icon>dots-vertical</ld-icon>
                        </ld-button>
                      </template>
                      <v-list class="v-list--x-small">
                        <v-list-item @click="() => null">Казнить</v-list-item>
                        <v-list-item @click="() => null">Помиловать</v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </ld-avatar>
              </template>
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="size" hide-details label="size:" label-on-top>
                <ld-radiobutton label="x-small" value="xs" />
                <ld-radiobutton label="small" value="s" />
                <ld-radiobutton label="default" value="sm" />
                <ld-radiobutton label="medium" value="m" />
                <ld-radiobutton label="large" value="l" />
                <ld-radiobutton label="x-large" value="xl" />
                <ld-radiobutton label="extra-large" value="xxl" />
              </ld-radiogroup>
              <ld-radiogroup v-model="theme" hide-details label="theme:" label-on-top>
                <ld-radiobutton label="light" value="light" />
                <ld-radiobutton label="dark" value="dark" />
              </ld-radiogroup>
            </v-col>
            <v-col cols="3">
              <ld-switch v-model="full" label="full" hide-details />
              <ld-switch v-model="online" label="online" hide-details />
              <ld-switch v-model="customActions" label="custom actions" hide-details />
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['avatar.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
import Content from './components/content-body.vue';
import Header from './components/content-header.vue';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  components: {
    'content-header': Header,
    'content-body': Content,
  },
  data() {
    return {
      size: 'sm',
      theme: 'light',
      full: true,
      online: true,
      customActions: true,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['avatar.md'];
    },
  },
};
</script>
