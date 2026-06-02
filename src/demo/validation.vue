<template>
  <v-container class="d-flex flex-column">
    <content-header>Form Validation</content-header>
    <content-body h="800">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="6">
              <b-edit-text label="Edit Text" :rules="myRules" v-model="text" required />
              <b-select
                :items="[
                  { id: 1, value: 'Value 1' },
                  { id: 2, value: 'Value 2' },
                ]"
                v-model="selected"
                label="Select"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex align-center">
              <b-button @click="save">Validate</b-button>
              <transition name="fade">
                <span v-if="success" class="px-3" style="font-size: var(--font-size); color: var(--success)"
                  >form is valid</span
                >
              </transition>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['validation.md']" />
        </b-tab>
      </b-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import { ValidateMixinOptions } from '@/mixins/validate.mixin';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      text: '',
      selected: null,
      success: false,
    };
  },
  inject: ['tabProps'],
  mixins: [ValidateMixinOptions, markdownToHTML],
  computed: {
    library() {
      return ['validation.md'];
    },
    myRules() {
      function cyrillic(value) {
        if (/[а-яА-ЯёЁ]/.test(value)) {
          return 'Символы кириллицы не допустимы';
        }
        return true;
      }
      return [cyrillic];
    },
  },
  methods: {
    save() {
      if (this.validate()) {
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 1000);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
