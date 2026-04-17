<template>
  <div v-if="items.length" class="minimized-dialogs">
    <template v-if="isManyItems">
      <div class="d-flex flex-row-reverse">
        <component
          :is="$ui.options.aliases['ld-button']"
          v-for="item in items"
          :key="item.id"
          class="ml-4 minimize-btn"
          @click="onMaximize(item)"
        >
          <div class="d-flex align-center justify-between">
            <span class="white--text">
              {{ item.processingDescription || item.description || item.title }}
            </span>
            <div class="pl-2">
              <component
                :is="$ui.options.aliases['ld-button']"
                icon
                text
                tooltip
                :tooltip-text="$i18n.gettext('Expand')"
                @click="onMaximize(item)"
              >
                <svg-icon>expand</svg-icon>
              </component>
              <component
                :is="$ui.options.aliases['ld-button']"
                icon
                text
                tooltip
                :tooltip-text="$i18n.gettext('Close')"
                @click.stop="onClose(item)"
              >
                <svg-icon>close</svg-icon>
              </component>
            </div>
          </div>
        </component>
      </div>
    </template>
    <template v-else>
      <v-menu>
        <template #activator="{ props }">
          <component :is="$ui.options.aliases['ld-button']" v-bind="props" class="minimize-btn">
            <div class="d-flex justify-center">
              <span class="body-1 white--text">
                <span>{{ $i18n.gettext('Collapsed windows') }}</span> ({{ items.length }})
              </span>
            </div>
          </component>
        </template>
        <v-card class="d-flex flex-column overflow-hidden" style="max-height: 65vh">
          <v-list>
            <v-list-item v-for="item in items" :key="item.id" @click="onMaximize(item)">
              <v-list-item-title :class="{ changed: itemIsChanged(item) }">
                <div class="minimized-item__title">{{ item.description }}</div>
                <div class="minimized-item__subtitle">{{ item.title }}</div>
              </v-list-item-title>
              <template #append>
                <component :is="$ui.options.aliases['ld-button']" icon text @click.stop="onMaximize(item)">
                  <svg-icon>expand</svg-icon>
                </component>
                <component :is="$ui.options.aliases['ld-button']" icon text @click.stop="onClose(item)">
                  <svg-icon>close</svg-icon>
                </component>
              </template>
            </v-list-item>
          </v-list>
          <div class="pa-3">
            <component :is="$ui.options.aliases['ld-button']" color="grey" variant="outlined" @click="onCloseAll">
              <svg-icon>close</svg-icon>
              <span>{{ $i18n.gettext('Close all') }}</span>
            </component>
          </div>
        </v-card>
      </v-menu>
    </template>
  </div>
</template>
<script src="./dialog.minimized.ts" lang="ts"></script>
