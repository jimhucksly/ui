<template>
  <svg-icon
    v-if="array"
    :icon="array[1]"
    :class="[...className, 'b-icon']"
    style="outline: none"
    :path="path"
    v-bind="props"
  />
  <span v-else> icon is not found: {{ current }} </span>
</template>
<script src="./b-icon.ts"></script>
