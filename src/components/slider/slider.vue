<template>
  <div :class="[classService.rootclass]" :style="{ [`--${classService.rootclass}-size`]: 'calc(5 * var(--gutter))' }">
    <ul :class="[classService.submodule('points')]">
      <li :class="[classService.submodule('points__item')]" v-for="(p, i) of points" :key="i">
        <span>{{ p }}</span>
      </li>
    </ul>
    <div :class="[classService.submodule('track')]"></div>
    <div
      :class="[classService.submodule('thumb')]"
      :style="{ transform: `translateX(${currentX}px)` }"
      @mousedown="onMouseDown"
    ></div>
  </div>
</template>
<script src="./slider.ts" lang="ts"></script>
