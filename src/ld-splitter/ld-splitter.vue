<template>
  <div
    :style="{
      cursor: active ? (horizontal ? 'ns-resize' : 'ew-resize') : '',
      'user-select': active ? 'none' : 'unset',
      'flex-direction': horizontal ? 'column' : 'row',
    }"
    :class="['ld-splitter', mainClass]"
    @mouseup="onUp"
    @mousemove="onMouseMove"
    @touchmove="onTouchMove"
    @touchend="onUp"
  >
    <div :style="leftPaneStyle" class="left-pane splitter-pane" v-show="leftVisibled">
      <slot name="left-pane"></slot>
    </div>
    <div
      v-show="leftVisibled && rightVisibled"
      class="splitter"
      :class="{
        active,
        'splitter--hor': horizontal,
        'splitter--ver': !horizontal,
        'splitter--disabled': resizeDisabled,
      }"
      @click="onClick"
      @touchstart.prevent="onDown"
      @mousedown="onDown"
    >
      <svg v-if="horizontal" xmlns="http://www.w3.org/2000/svg" width="30" height="6" viewBox="0 0 30 6" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.74845e-07 4L2.62268e-07 6L2 6L2 4L1.74845e-07 4ZM4 4L4 6L6 6L6 4L4 4ZM8 6L8 4L10 4L10 6L8 6ZM12 4L12 6L14 6L14 4L12 4ZM16 6L16 4L18 4L18 6L16 6ZM20 4L20 6L22 6L22 4L20 4ZM24 6L24 4L26 4L26 6L24 6ZM28 4L28 6L30 6L30 4L28 4Z"
          fill="var(--grey-l-2)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.74845e-07 1.31134e-06L2.62268e-07 2L2 2L2 1.22392e-06L1.74845e-07 1.31134e-06ZM4 1.1365e-06L4 2L6 2L6 1.04907e-06L4 1.1365e-06ZM8 2L8 9.61651e-07L10 8.74228e-07L10 2L8 2ZM12 7.86805e-07L12 2L14 2L14 6.99382e-07L12 7.86805e-07ZM16 2L16 6.1196e-07L18 5.24537e-07L18 2L16 2ZM20 4.37114e-07L20 2L22 2L22 3.49691e-07L20 4.37114e-07ZM24 2L24 2.62268e-07L26 1.74846e-07L26 2L24 2ZM28 8.74229e-08L28 2L30 2L30 0L28 8.74229e-08Z"
          fill="var(--grey-l-2)"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="6" height="30" viewBox="0 0 6 30" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2 0H0V2H2V0ZM2 4H0V6H2V4ZM0 8H2V10H0V8ZM2 12H0V14H2V12ZM0 16H2V18H0V16ZM2 20H0V22H2V20ZM0 24H2V26H0V24ZM2 28H0V30H2V28Z"
          fill="var(--grey-l-2)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 0H4V2H6V0ZM6 4H4V6H6V4ZM4 8H6V10H4V8ZM6 12H4V14H6V12ZM4 16H6V18H4V16ZM6 20H4V22H6V20ZM4 24H6V26H4V24ZM6 28H4V30H6V28Z"
          fill="var(--grey-l-2)"
        />
      </svg>
    </div>
    <div :style="rightPaneStyle" class="right-pane splitter-pane" v-show="rightVisibled">
      <slot name="right-pane"></slot>
    </div>
  </div>
</template>
<script src="./ld-splitter.ts"></script>
