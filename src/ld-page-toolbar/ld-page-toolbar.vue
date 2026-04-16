<template>
  <v-toolbar class="ld-page-toolbar" :height="preview ? 48 : 80">
    <div class="ld-page-toolbar-wrapper" :class="{ '--preview': preview }">
      <div v-if="!preview" class="ld-page-toolbar-title">
        <slot name="breadcrumbs"></slot>
      </div>
      <div class="ld-page-toolbar-inner">
        <!-- Заголовок страницы -->
        <div v-if="!preview" class="d-flex align-center" style="position: relative">
          <component
            :is="$ui.options.aliases['ld-button']"
            icon
            variant="tonal"
            color="primary"
            v-if="!noBackAction"
            @click="back"
          >
            <svg-icon>to left</svg-icon>
          </component>
          <div class="px-2">
            <slot name="content" />
          </div>
        </div>
        <!-- панель действий -->
        <div
          class="d-flex"
          :class="{
            'align-end justify-end': !preview,
            'align-center w-100': preview,
          }"
        >
          <div style="height: var(--input-height)" class="d-flex" :class="{ 'w-100': preview }">
            <slot name="action-panel" />
          </div>
        </div>
      </div>
    </div>
  </v-toolbar>
</template>
<script src="./ld-page-toolbar.ts"></script>
