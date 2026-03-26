<template>
  <div
    class="row"
    :class="{
      'flex-start': !end && !center,
      'flex-end': end,
      'flex-center': center,
      column: col,
      'row-reverse': reverse,
    }"
  >
    <slot></slot>
  </div>
</template>
<script src="./row.ts"></script>
