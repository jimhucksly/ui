<template>
  <div class="ld-tabs" :class="[`ld-tabs--${direction}`, `ld-tabs--${mySize}`]" :id="uid">
    <div
      class="ld-tabs-content"
      :class="{
        'ld-tabs-mobile': isMobileGlobal && vertical,
        'hide-tabs': !isTabsVisibled,
        'hide-body': isTabsVisibled,
      }"
    >
      <div class="ld-tabs-wrapper">
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
            <div class="d-flex align-center justify-end" style="height: var(--ld-tab-height)">
              <p class="ld-tab-header header-text flex-1-1 px-4 font-weight-bold" v-if="isTabsVisibled">
                {{ header }}
              </p>
              <component
                :is="$ui.options.aliases['ld-button']"
                icon
                text
                tooltip
                :tooltip-text="isTabsVisibled ? $i18n.gettext('Hide tabs') : $i18n.gettext('Show tabs')"
                class="mr-2"
                @click="toggleCollapse"
              >
                <svg-icon>arrow left</svg-icon>
              </component>
            </div>
          </div>
          <template #prev>
            <component :is="$ui.options.aliases['ld-button']" icon text>
              <svg-icon>arrow left</svg-icon>
            </component>
          </template>
          <template #next>
            <component :is="$ui.options.aliases['ld-button']" icon text>
              <svg-icon>arrow right</svg-icon>
            </component>
          </template>
          <slot />
          <slot name="tabs-footer" />
        </v-tabs>
        <v-tabs-window
          v-if="isBodyVisibled"
          class="h-100"
          :class="{ mobile: isMobileGlobal, 'vertical-window': vertical, 'v-window--no-padding': noPadding }"
          :style="{
            border: isTabsVisibled ? 'unset' : '1px solid var(--grey-l-5)',
          }"
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
<script src="./ld-tabs.ts"></script>
