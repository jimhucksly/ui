<template>
  <div class="b-tabs" :class="[`b-tabs--${direction}`, `b-tabs--${mySize}`]" :id="uid">
    <div
      class="b-tabs-content"
      :class="{
        'b-tabs-mobile': isMobileGlobal && vertical,
        'hide-tabs': !isTabsVisibled,
        'hide-body': isTabsVisibled,
      }"
    >
      <div class="b-tabs-wrapper">
        <v-tabs
          v-model="active"
          :direction="direction"
          :class="{
            'v-tabs-mobile': isMobileGlobal,
            mobile: isMobileGlobal,
            'flex-shrink-0': true,
            'no-header': noHeader,
          }"
          :hide-slider="true"
          :id="`${uid}-tabs`"
        >
          <!-- vertical -->
          <div v-if="vertical && !noHeader" :class="{ 'w-100': !isMobileGlobal, 'tab-mobile': isMobileGlobal }">
            <div class="b-tab-header d-flex align-center justify-end">
              <p class="flex-1-1 px-4" v-if="isTabsVisibled">
                {{ header }}
              </p>
              <component
                :is="$ui.options.aliases['b-button']"
                icon
                text
                tooltip
                :tooltip-text="isTabsVisibled ? $i18n.gettext('Hide tabs') : $i18n.gettext('Show tabs')"
                class="mr-2"
                @click="toggleCollapse"
              >
                <svg-icon v-if="isTabsVisibled">arrow left</svg-icon>
                <svg-icon v-else>arrow right</svg-icon>
              </component>
            </div>
          </div>
          <template #prev>
            <component :is="$ui.options.aliases['b-button']" icon text>
              <svg-icon>arrow left</svg-icon>
            </component>
          </template>
          <template #next>
            <component :is="$ui.options.aliases['b-button']" icon text>
              <svg-icon>arrow right</svg-icon>
            </component>
          </template>
          <slot />
          <slot name="tabs-footer" />
        </v-tabs>
        <v-tabs-window
          v-if="isBodyVisibled"
          class="h-100"
          :class="{ mobile: isMobileGlobal, 'v-window--no-padding': noPadding }"
          v-model="active"
          :id="id ? `${id}-window` : undefined"
        >
          <slot />
        </v-tabs-window>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>
<script src="./b-tabs.ts"></script>
