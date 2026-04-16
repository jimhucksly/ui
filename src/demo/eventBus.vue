<template>
  <v-container class="d-flex flex-column">
    <content-header>Event Bus</content-header>
    <content-body h="300">
      <div style="display: grid; grid-auto-flow: column; gap: 4px; justify-content: left; margin-bottom: 8px">
        <ld-button @click="createListener">Add Listener</ld-button>
        <ld-button @click="callListener" color="success">Call Listener</ld-button>
      </div>
      <div>
        <markdown-to-html v-if="!templatesLoading" :template="templates['eventBus.md']" />
      </div>
    </content-body>
  </v-container>
</template>
<script>
import { eventBus } from '@dn-web/core';
import { DialogManager } from '@/ld-dialog/dialog.manager';
import { AlertDialog, PromptDialog } from '@/ld-dialog/dialogs';
import markdownToHTML from './mixins/markdownToHTML';
export default {
  mixins: [markdownToHTML],
  computed: {
    library() {
      return ['eventBus.md'];
    },
  },
  methods: {
    async createListener() {
      const message = await DialogManager.exec(
        new PromptDialog({
          title: 'Enter your message!',
        })
      );
      eventBus.$once('on-event', () => {
        DialogManager.exec(
          new AlertDialog({
            title: 'Your message',
            content: message,
          })
        );
      });
    },
    callListener() {
      if (!eventBus.$has('on-event')) {
        this.$toasted.warning('Not binded listeners found!');
        return;
      }
      eventBus.$emit('on-event');
    },
  },
};
</script>
