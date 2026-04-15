<template>
  <v-row style="flex-grow: 0" class="page-header">
    <v-col class="py-0">
      <div class="page-header__panel">
        <div class="font-weight-bold heading-6 white--text">
          <slot name="default"></slot>
        </div>
        <div class="text-body-s" style="color: var(--grey-l-2)" v-if="$slots['description']">
          <slot name="description"></slot>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
