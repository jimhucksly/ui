<template>
  <button
    :class="[
      classService.rootclass,
      classService.modificator(color),
      {
        [classService.modificator('outlined')]: outlined,
      },
    ]"
  >
    <div :class="classService.submodule('loader')" :style="{ opacity: loading ? 1 : 0 }">
      <b-loader view="dotts" :color="outlined ? color : undefined"></b-loader>
    </div>
    <span :class="classService.submodule('content')" :style="{ opacity: loading ? 0 : 1 }">
      <slot></slot>
    </span>
  </button>
</template>
<script src="./button.ts"></script>
