<template>
  <v-container class="d-flex flex-column">
    <content-header>Uploader</content-header>
    <content-body h="800">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="5">
              <ld-uploader
                v-model="files"
                label="Обязательно к заполнению"
                method="POST"
                :url="setUrl ? url : ''"
                :headers="headers"
                :response-parser="responseParser"
                :before-send="onBeforeSend"
                :required="required"
                :disabled="disabled"
                :width="setWidth ? width : undefined"
                :height="setHeight ? height : undefined"
                :input-hint="inputHint ? 'Добавьте файл' : ''"
                :hide-details="hideDetails"
                :max="max ? 20971520 : 0"
                :size="size"
                :fluid="fluid"
                :accept="accept ? '.docx, .png, .jpg' : undefined"
                :multiple="multiple"
                :lazy="lazy"
                :as-input="true"
                @input="onInput"
                @change="onChange"
                @complete="onComplete"
              >
                <template #actions="{ file }" v-if="customActions">
                  <ld-button icon text>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none">
                      <path
                        d="M9.16667 3.75C8.50363 3.75 7.86774 4.01339 7.3989 4.48223C6.93006 4.95107 6.66667 5.58696 6.66667 6.25C6.66667 6.91304 6.93006 7.54893 7.3989 8.01777C7.86774 8.48661 8.50363 8.75 9.16667 8.75C9.82971 8.75 10.4656 8.48661 10.9344 8.01777C11.4033 7.54893 11.6667 6.91304 11.6667 6.25C11.6667 5.58696 11.4033 4.95107 10.9344 4.48223C10.4656 4.01339 9.82971 3.75 9.16667 3.75ZM9.16667 10.4167C8.0616 10.4167 7.00179 9.97768 6.22039 9.19628C5.43899 8.41488 5 7.35507 5 6.25C5 5.14493 5.43899 4.08512 6.22039 3.30372C7.00179 2.52232 8.0616 2.08333 9.16667 2.08333C10.2717 2.08333 11.3315 2.52232 12.1129 3.30372C12.8943 4.08512 13.3333 5.14493 13.3333 6.25C13.3333 7.35507 12.8943 8.41488 12.1129 9.19628C11.3315 9.97768 10.2717 10.4167 9.16667 10.4167ZM9.16667 0C5 0 1.44167 2.59167 0 6.25C1.44167 9.90833 5 12.5 9.16667 12.5C13.3333 12.5 16.8917 9.90833 18.3333 6.25C16.8917 2.59167 13.3333 0 9.16667 0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </ld-button>
                </template>
                <template #actions-list="{ file }" v-if="customActions">
                  <v-menu>
                    <template #activator="{ props }">
                      <ld-button icon text v-bind="props">
                        <ld-icon>more_vert</ld-icon>
                      </ld-button>
                    </template>
                    <v-list class="v-list--x-small">
                      <v-list-item @click="() => null">Проверить</v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </ld-uploader>
            </v-col>
            <v-col cols="3">
              <ld-switch label="required" v-model="required" hide-details />
              <ld-switch label="disabled" v-model="disabled" hide-details />
              <ld-switch label="max" v-model="max" hide-details />
              <ld-switch label="fluid" v-model="fluid" hide-details />
              <ld-switch label="input hint" v-model="inputHint" hide-details />
              <ld-switch label="hideDetails" v-model="hideDetails" hide-details />
              <ld-switch label="custom actions" v-model="customActions" hide-details />
              <ld-switch label="accept docx, png, jpg" v-model="accept" hide-details />
              <ld-switch label="multiple" v-model="multiple" hide-details />
              <ld-switch label="lazy load" v-model="lazy" hide-details />
              <ld-switch label="as input" v-model="asInput" hide-details />
              <ld-switch label="use before send handler" v-model="before" hide-details />
              <div style="width: 300px" class="d-flex mb-1">
                <ld-edit-text v-model="url" :disabled="!setUrl" label="url" hide-details />
                <ld-switch v-model="setUrl" class="ml-2" hide-details />
              </div>
              <ld-button @click="save">validate</ld-button>
            </v-col>
            <v-col cols="4">
              <div style="width: 300px" class="d-flex mb-1">
                <ld-edit-text only-numbers v-model="width" :disabled="!setWidth" label="width (px)" hide-details />
                <ld-switch v-model="setWidth" class="ml-2" hide-details />
              </div>
              <div style="width: 300px" class="d-flex mb-1">
                <ld-edit-text only-numbers v-model="height" :disabled="!setHeight" label="height (px)" hide-details />
                <ld-switch v-model="setHeight" class="ml-2" hide-details />
              </div>
              <ld-radiogroup v-model="size" label="size" label-on-top hide-details>
                <ld-radiobutton value="s" label="small" />
                <ld-radiobutton value="m" label="medium" />
                <ld-radiobutton value="l" label="large" />
              </ld-radiogroup>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['uploader.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import { delay } from '@dn-web/core';
import { ValidateMixinOptions } from '@/mixins/validate.mixin';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      files: [],
      required: true,
      disabled: false,
      width: 430,
      setWidth: false,
      height: 220,
      setHeight: false,
      hideDetails: false,
      customActions: false,
      inputHint: true,
      error: false,
      max: true,
      size: 'm',
      fluid: false,
      accept: true,
      multiple: true,
      lazy: true,
      asInput: false,
      before: false,
      // document
      // http://platforma-dev.k8s.lan.lanit.ru/documents/340313/edit/343012
      headers: {
        'Access-Control-Allow-Credentials': 'true',
      },
      setUrl: true,
      url: 'api/v1/proxy/files/343043/versions',
    };
  },
  inject: ['tabProps'],
  mixins: [ValidateMixinOptions, markdownToHTML],
  computed: {
    library() {
      return ['uploader.md'];
    },
  },
  methods: {
    save() {
      this.validate();
    },
    responseParser(response) {
      if (typeof response === 'string') {
        return response;
      }
      if (response?.message) {
        return response.message;
      }
    },
    async onBeforeSend(item, body) {
      if (!this.before) {
        return body;
      }
      try {
        /* eslint-disable no-console */
        console.log('on before send!');
        console.log({ item, body });
        await delay(2000);
        // throw new Error('file format is forbidden');
        return body;
      } catch (e) {
        /* eslint-disable no-console */
        console.log('before send error!!!');
        throw e;
      }
    },
    onInput(files) {
      /* eslint-disable no-console */
      console.log('onInput', files);
    },
    onChange(items) {
      /* eslint-disable no-console */
      console.log('onChange', items);
    },
    onComplete() {
      /* eslint-disable no-console */
      console.log('all files loaded');
    },
  },
};
</script>
