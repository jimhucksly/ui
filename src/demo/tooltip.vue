<template>
  <v-container class="d-flex flex-column">
    <content-header>Tooltips</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <v-tooltip
                v-model="show"
                :open-on-click="openOnClick"
                :open-on-hover="!openOnClick"
                :disabled="disabled"
                :location="location"
                :interactive="openOnClick"
                :persistent="openOnClick"
                :width="openOnClick ? 400 : 300"
                :content-class="[`bg-${theme}`, { 'ld-popover': openOnClick }]"
              >
                <template #activator="{ props }">
                  <div v-bind="props" style="border: 1px solid var(--grey-l-5)">
                    <div class="pa-3 text-body-s">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                  </div>
                </template>
                <div>
                  <div class="d-flex align-center mb-3" v-if="openOnClick">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path
                        d="M7.5 5.83333H9.16667V4.16667H7.5V5.83333ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM8.33333 0C7.23898 0 6.15535 0.215548 5.1443 0.634337C4.13326 1.05313 3.2146 1.66696 2.44078 2.44078C0.877974 4.00358 0 6.1232 0 8.33333C0 10.5435 0.877974 12.6631 2.44078 14.2259C3.2146 14.9997 4.13326 15.6135 5.1443 16.0323C6.15535 16.4511 7.23898 16.6667 8.33333 16.6667C10.5435 16.6667 12.6631 15.7887 14.2259 14.2259C15.7887 12.6631 16.6667 10.5435 16.6667 8.33333C16.6667 7.23898 16.4511 6.15535 16.0323 5.1443C15.6135 4.13326 14.9997 3.2146 14.2259 2.44078C13.4521 1.66696 12.5334 1.05313 11.5224 0.634337C10.5113 0.215548 9.42768 0 8.33333 0ZM7.5 12.5H9.16667V7.5H7.5V12.5Z"
                        :fill="isDark ? 'var(--white)' : 'var(--text)'"
                      />
                    </svg>
                    <span class="px-2 text-body-m" :style="{ color: isDark ? 'var(--white)' : 'var(--text)' }">
                      Popover content
                    </span>
                    <v-spacer></v-spacer>
                    <ld-button icon text :color="theme === 'dark' ? 'white' : 'grey'" @click="show = false">
                      <ld-icon>close</ld-icon>
                    </ld-button>
                  </div>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, aperiam atque voluptatibus quibusdam
                  architecto cumque. Voluptas, provident minus ducimus rem aspernatur error. Veritatis minima possimus
                  perspiciatis reiciendis repellat et accusantium modi rem esse, iure incidunt. Fuga temporibus adipisci
                  similique quod, doloremque aliquam atque quis dolorem ducimus incidunt reiciendis possimus, repellat
                  ab debitis dolores assumenda animi dolor est harum fugiat sunt deserunt. Cumque iure ullam distinctio
                  suscipit quas molestias quibusdam alias impedit obcaecati eum cupiditate quidem enim exercitationem
                  dolorum iusto in quaerat voluptatum illum ipsa, deserunt, possimus delectus.
                </div>
              </v-tooltip>
            </v-col>
            <v-col cols="3">
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="open on click" v-model="openOnClick" hide-details />
              <ld-radiogroup v-model="location" label="location" label-on-top hide-details>
                <ld-radiobutton value="top" label="top"></ld-radiobutton>
                <ld-radiobutton value="bottom" label="bottom"></ld-radiobutton>
                <ld-radiobutton value="start" label="left"></ld-radiobutton>
                <ld-radiobutton value="end" label="right"></ld-radiobutton>
              </ld-radiogroup>
              <ld-button @click="show = !show">Toggle</ld-button>
            </v-col>
            <v-col cols="3">
              <ld-radiogroup v-model="theme" label="theme" label-on-top hide-details>
                <ld-radiobutton value="dark" label="dark"></ld-radiobutton>
                <ld-radiobutton value="light" label="light"></ld-radiobutton>
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['tooltip.md']" />
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
      show: false,
      disabled: false,
      location: 'bottom',
      openOnClick: false,
      theme: 'dark',
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['tooltip.md'];
    },
    isDark() {
      return this.theme === 'dark';
    },
  },
  watch: {
    openOnClick() {
      this.show = false;
    },
  },
};
</script>
