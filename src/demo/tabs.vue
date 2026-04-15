<template>
  <v-container class="d-flex flex-column">
    <content-header>Tabs</content-header>
    <content-body h="500">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <div class="overflow-auto" style="height: 250px; border: 1px solid var(--grey-l-5)">
                <ld-tabs v-model="currentTab" header="Tabs" :vertical="false" :size="size">
                  <ld-tab v-for="i in arr" :key="i" :index="i" :heading="`Tab ${i + 1}`" :disabled="disabled">
                    <div style="color: var(--primary)" class="pa-3">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum harum cum at praesentium vero
                      numquam exercitationem voluptas a. Amet suscipit unde iusto. Cum numquam ut provident quisquam at
                      explicabo vitae placeat, doloremque dicta quas est eaque id debitis totam, accusamus commodi quo
                      voluptatem voluptates sequi dolor ipsa. Mollitia, id. Accusamus at dignissimos, asperiores ducimus
                      nihil eos. Tempora, error. Accusamus corrupti magnam sint? Tenetur repellendus at autem sapiente
                      quas, in nemo quibusdam ad voluptatem ipsa a vel deserunt laudantium nobis esse, voluptatibus
                      aperiam sunt dicta maxime fugit. Atque perferendis, molestiae iure dolor doloremque pariatur natus
                      minus cupiditate corporis eos? Pariatur, ullam, enim adipisci maxime eos nulla a voluptates beatae
                      alias eveniet necessitatibus eligendi, est ducimus neque commodi fugit vero itaque reprehenderit
                      quam praesentium ea corrupti temporibus ratione porro. Cupiditate cumque quo consectetur
                      reiciendis numquam deserunt beatae, doloribus nam aut amet adipisci harum quaerat nisi nobis vitae
                      magni, similique magnam fugiat dolores.
                    </div>
                  </ld-tab>
                </ld-tabs>
              </div>
            </v-col>
            <v-col cols="6">
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="show slider arrows" v-model="arrows" hide-details />
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="s" label="small" />
                <ld-radiobutton value="l" label="large" />
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['tabs.md']" />
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
      currentTab: 0,
      arrows: false,
      size: 's',
      disabled: false,
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['tabs.md'];
    },
    arr() {
      return new Array(this.arrows ? 15 : 3).fill().map((_, index) => index);
    },
  },
};
</script>
