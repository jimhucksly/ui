<template>
  <router-view></router-view>
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
