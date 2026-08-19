<template>
  <v-container class="d-flex flex-column">
    <content-header>Dialogs</content-header>
    <content-body h="1100">
      <b-tabs v-bind="tabProps">
        <b-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col cols="12">
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callAlertDialog">Alert Dialog</b-button>
                      </v-col>
                      <v-col cols="3">
                        <b-switch label="message with details" v-model="alert.details" hide-details class="mb-2" />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callConfirmDialog">Confirm Dialog</b-button>
                      </v-col>
                      <v-col cols="3">
                        <b-edit-text label="okResult" v-model="confirm.okResult" />
                        <b-edit-text label="cancelResult" v-model="confirm.cancelResult" />
                      </v-col>
                      <v-col cols="3">
                        <b-switch label="text as title" v-model="confirm.textAsTitle" hide-details class="mb-2" />
                        <div>Confirm dialog result: {{ confirm.model }}</div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callPromptDialog">Prompt Dialog</b-button>
                      </v-col>
                      <v-col cols="3"> Prompt dialog result: {{ prompt.model }} </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callInfoDialog">Info Dialog</b-button>
                      </v-col>
                      <v-col cols="3">
                        <b-edit-text label="Text to display" v-model="info.model" />
                      </v-col>
                      <v-col cols="3">
                        <b-radiogroup v-model="info.size" label="size" label-on-top hide-details>
                          <b-radiobutton value="s" label="small"></b-radiobutton>
                          <b-radiobutton value="m" label="medium"></b-radiobutton>
                          <b-radiobutton value="l" label="large"></b-radiobutton>
                        </b-radiogroup>
                        <b-switch label="full height" v-model="info.fullHeight" hide-details class="mb-2" />
                        <b-edit-text v-model="info.width" label="width:" only-numbers />
                        <b-edit-text v-model="info.height" label="height:" only-numbers />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callSelectDialog">Select Dialog</b-button>
                      </v-col>
                      <v-col cols="3">
                        <b-switch v-model="select.multiselect" label="multiselect" />
                        <b-switch v-model="select.selectAsOk" label="selectAsOk" />
                      </v-col>
                      <v-col cols="3"> Select Result: {{ select.model }} </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callCreateDialog">Create Dialog</b-button>
                      </v-col>
                      <v-col cols="9"> Create Result: {{ create.model }} </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card style="border-radius: var(--border-radius); margin-bottom: 8px" elevation="2">
                <v-card-text style="background-color: var(--grey-l-6)" class="pa-0">
                  <v-container>
                    <v-row>
                      <v-col cols="3">
                        <b-button @click="callEditDialog">Edit Dialog</b-button>
                      </v-col>
                      <v-col cols="9"> Edit Result: {{ edit.model }} </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </b-tab>
        <b-tab index="1" heading="Code" class="pa-2">
          <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.main.md']" />
          <b-expansion-panels>
            <b-expansion-panel title="вызов диалога типа Alert">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.alert.md']" />
            </b-expansion-panel>
            <b-expansion-panel title="вызов диалога типа Prompt">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.prompt.md']" />
            </b-expansion-panel>
            <b-expansion-panel title="вызов диалога типа Confirm">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.confirm.md']" />
            </b-expansion-panel>
            <b-expansion-panel title="вызов диалога типа Info">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.info.md']" />
            </b-expansion-panel>
            <b-expansion-panel title="вызов диалога типа Select">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.select.md']" />
            </b-expansion-panel>
            <b-expansion-panel title="вызов диалога типа CreateEdit">
              <markdown-to-html v-if="!templatesLoading" :template="templates['dialogs.create.md']" />
            </b-expansion-panel>
          </b-expansion-panels>
        </b-tab>
      </b-tabs>
    </content-body>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/typedef, @typescript-eslint/naming-convention  */
import { DialogManager } from '@/b-dialog/dialog.manager';
import {
  AlertDialog,
  ConfirmDialog,
  CreateEditDialog,
  InfoDialog,
  PromptDialog,
  SelectDialog,
} from '@/b-dialog/dialogs';
import markdownToHTML from './mixins/markdownToHTML';
import { delay, uniqueID } from '@dn-web/core';
export default {
  data(): {
    alert: {
      details: boolean;
    };
    prompt: {
      model: string;
    };
    confirm: {
      model: string | number | boolean;
      textAsTitle: boolean;
      okResult: string;
      cancelResult: string;
    };
    info: {
      model: string;
      size: 's';
      width: string;
      height: string;
      fullHeight: boolean;
    };
    select: {
      model: unknown;
      multiselect: boolean;
      selectAsOk: boolean;
    };
    create: {
      model: unknown;
    };
    edit: {
      model: {
        first_name: string;
        last_name: string;
      };
    };
  } {
    return {
      alert: {
        details: false,
      },
      prompt: {
        model: null,
      },
      confirm: {
        model: null,
        textAsTitle: false,
        okResult: null,
        cancelResult: null,
      },
      info: {
        model: null,
        size: 's',
        fullHeight: false,
        width: null,
        height: null,
      },
      select: {
        model: null,
        multiselect: false,
        selectAsOk: false,
      },
      create: {
        model: null,
      },
      edit: {
        model: {
          first_name: 'Gabriell',
          last_name: 'McEvay',
        },
      },
    };
  },
  inject: {
    tabProps: {
      type: Object,
    },
  },
  mixins: [markdownToHTML],
  computed: {
    library() {
      return [
        'dialogs.main.md',
        'dialogs.alert.md',
        'dialogs.prompt.md',
        'dialogs.confirm.md',
        'dialogs.info.md',
        'dialogs.select.md',
        'dialogs.create.md',
      ];
    },
  },
  methods: {
    callAlertDialog() {
      DialogManager.exec(
        new AlertDialog({
          title: 'Внимание',
          content: this.alert.details
            ? 'Информационное сообщение Message detail: Подробности по сообщению'
            : 'Информационное сообщение',
        })
      );
    },
    async callPromptDialog() {
      this.prompt.model = await DialogManager.exec<string>(
        new PromptDialog({
          title: 'Введите значение',
        })
      );
    },
    async callConfirmDialog() {
      const title = this.confirm.textAsTitle ? 'Выполнить действие?' : 'Внимание';
      this.confirm.model = await DialogManager.exec<string>(
        new ConfirmDialog({
          title,
          content: this.confirm.textAsTitle ? null : 'Выполнить действие?',
          okResult: this.confirm.okResult || true,
          cancelResult: this.confirm.cancelResult || false,
          okColor: 'error',
          cancelColor: 'grey',
        })
      );
    },
    callInfoDialog() {
      DialogManager.exec(
        new InfoDialog({
          title: 'Инфо',
          component: 'info-component',
          componentProps: {
            data: this.info.model,
          },
          closable: true,
          size: this.info.size,
          width: Number(this.info.width),
          height: Number(this.info.height),
          fullHeight: this.info.fullHeight,
        })
      );
    },
    async callSelectDialog() {
      const res = await DialogManager.exec<{ id: number; first_name: string; last_name: string }>(
        new SelectDialog<{ id: number; first_name: string; last_name: string }>({
          title: 'Выберите элемент',
          component: 'select-component',
          loading: true,
          componentProps: {
            selectedItems: this.select.model ? [...this.select.model] : [],
            disabledItems: [],
            multiselect: this.select.multiselect,
          },
          selectAsOk: this.select.selectAsOk,
          fullHeight: true,
        }),
        async () => {
          await delay(1500);
          return fetch('/mock.json')
            .then(result => result.json())
            .then(data => ({
              rows: data,
            }));
        }
      );
      if (res) {
        this.select.model = res;
      }
    },
    async callCreateDialog() {
      const id = uniqueID(6, '0-9');
      const res = await DialogManager.exec<{ first_name: string; last_name: string }>(
        new CreateEditDialog<{ first_name: string; last_name: string }>({
          title: `Создание объекта ${id}`,
          component: 'create-edit-component',
          componentProps: {
            model: null,
          },
          help: true,
          okColor: 'success',
          expandable: true,
          minimizable: true,
          expanded: false,
          collapsedSize: {
            height: '575px',
            width: '560px',
            noModal: true,
          },
          expandedSize: {
            height: '800px',
            width: '1088px',
            noModal: false,
          },
          hostObject: {
            id,
            kind: 1,
            contentType: 1,
          },
        })
      );
      if (res) {
        this.create.model = res;
      }
    },
    async callEditDialog() {
      const id = uniqueID(6, '0-9');
      const res = await DialogManager.exec<{ first_name: string; last_name: string }>(
        new CreateEditDialog<{ first_name: string; last_name: string }>({
          title: `Редактирование объекта ${id}`,
          component: 'create-edit-component',
          componentProps: {
            model: null,
          },
          expandable: true,
          expanded: true,
          expandedSize: {
            size: 'm',
          },
          collapsedSize: {
            size: 's',
            height: '450px',
          },
          minimizable: true,
          loading: true,
          help: true,
          okColor: 'success',
          hostObject: {
            id,
            kind: 1,
            contentType: 1,
          },
        }),
        async () => {
          await delay(1000);
          return {
            model: this.edit.model,
          };
        }
      );
      if (res) {
        this.edit.model = res;
      }
    },
  },
};
</script>
