<template>
  <v-container class="d-flex flex-column">
    <content-header>Text Viewer</content-header>
    <content-body h="300">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="8">
              <ld-text-viewer :text="'Yandex http://yandex.ru'" :active-links="activeLinks" label="Yandex" />
              <ld-text-viewer :active-links="activeLinks" label="Google"> Google http://google.com </ld-text-viewer>
              <ld-text-viewer label="User">
                <b-icon color="primary">account-circle</b-icon>
                <span>Username</span>
              </ld-text-viewer>
              <ld-text-viewer label="Description">{{ text }}</ld-text-viewer>
            </v-col>
            <v-col cols="4" class="d-flex flex-column">
              <b-switch label="active links" v-model="activeLinks" hide-details />
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['textviewer.md']" />
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
      activeLinks: true,
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quas, minima ad excepturi rerum inventore quasi, saepe dolor ipsa fuga suscipit exercitationem expedita ullam blanditiis porro molestiae placeat quo odio tempora numquam, aperiam ratione soluta sed dolorem? Earum rerum explicabo, consequuntur tempore architecto provident neque beatae assumenda ullam in adipisci doloribus libero repellendus, optio eius cumque temporibus expedita sed aliquam minus facere! Nihil quibusdam unde ipsum sit tempore quasi at accusantium neque, qui minima, voluptate atque, est odio magni ex enim sint. Asperiores sed, consequatur tempora illo odio, ducimus sunt, nisi tempore corporis minima quas non. Nulla sit quibusdam tempora. Veniam fuga quisquam at quae nobis explicabo impedit? Tempore rem provident, eligendi nam excepturi, optio recusandae laborum voluptates, vero iste atque cum? Ad quaerat quae veritatis, odio voluptatibus iste soluta delectus! Exercitationem in ut facere culpa, voluptatum sed temporibus maiores nihil labore quo! Dolorem voluptatum aperiam laborum id porro et, perspiciatis illo? Animi officia saepe nemo cum tenetur soluta id quod consectetur beatae. Repellat, magni dolorum consequuntur est eveniet quos atque modi debitis maiores? Ratione quo magnam labore adipisci, sint illo maiores. Eos minus laudantium dolor exercitationem, culpa, eius fuga porro quasi praesentium laboriosam nulla at, vitae amet. Deserunt, eaque!',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['textviewer.md'];
    },
  },
};
</script>
