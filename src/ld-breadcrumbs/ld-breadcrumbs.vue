<template>
  <v-breadcrumbs
    class="ld-breadcrumbs"
    :class="[`ld-breadcrumbs--${mySize}`, `ld-breadcrumbs--theme-${theme}`]"
    :items="visibleItems"
  >
    <template #divider>
      <svg xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.4 6L8 7.4L12.6 12L8 16.6L9.4 18L15.4 12L9.4 6Z"
          fill="currentColor"
        />
      </svg>
    </template>
    <template #title="{ item }">
      <div v-if="item.text === 'home'" class="d-flex align-center" @click="goHome">
        <svg xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 20 20" fill="none">
          <path
            d="m 8.195616,15.08843 v -5 h 3.33328 v 5 h 4.1667 v -6.6667 h 2.5 L 9.862296,0.92173998 1.528946,8.42173 h 2.5 v 6.6667 z"
            fill="currentColor"
          />
        </svg>
        <span v-if="label" class="pl-1">{{ label }}</span>
      </div>
      <template v-else>
        <v-menu v-if="item.hidden">
          <template #activator="{ props }">
            <div
              v-bind="props"
              class="ld-breadcrumbs-menu"
              :style="{ width: `${iconSize}px`, height: `${iconSize}px`, 'border-radius': `${iconSize}px` }"
            >
              <i>...</i>
            </div>
          </template>
          <v-list class="ld-breadcrumbs-list" :class="[`v-list--${mySize}`, `ld-breadcrumbs-list--${mySize}`]">
            <v-list-item v-for="i in collapsed[item.uid]" @click="go(i)"> {{ i.text }} </v-list-item>
          </v-list>
        </v-menu>

        <div v-else @click="go(item)" class="d-flex">
          <span style="display: block"> {{ item.text }}</span>
          <span v-if="item.remark" style="padding-left: 3px">({{ item.remark }})</span>
        </div>
      </template>
    </template>
  </v-breadcrumbs>
</template>
<script src="./ld-breadcrumbs.ts"></script>
