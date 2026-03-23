<template>
  <div class="title">DN UI Library</div>
  <div class="ver">{{ $dnwebui.ver }}</div>
</template>
<script>
import { generatePalette } from '@dn-web/core';

export default {
  data() {
    return {
      //
    };
  },
  created() {
    const palette = document.createElement('style');
    palette.innerHTML = generatePalette();
    palette.id = 'dn-palette';
    document.body.appendChild(palette);
  },
};
</script>
<style lang="scss" scoped>
.title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: 700;
  height: 100vh;
  color: var(--grey-l-1);
  z-index: 2;
}
.ver {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 0;
  color: var(--grey-l-1);
  text-align: center;
  z-index: 2;
}
</style>
