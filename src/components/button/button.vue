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
    <span :class="classService.submodule('content')">
      <slot></slot>
    </span>
  </button>
</template>
<script src="./button.ts"></script>
