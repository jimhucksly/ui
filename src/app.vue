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
    const colors = [
      {
        name: 'primary',
        lighten: {
          steps: {
            h: [207, 207, 202, 202, 202, 202],
            l: [46, 55, 64, 73, 82, 91],
          },
          prefix: 'l',
        },
        darken: {
          steps: {
            h: [221, 221, 221, 221],
            l: [35, 24, 13, 2],
          },
          prefix: 'd',
        },
        pivot: { h: 215, s: 66, l: 46, a: 100 },
      },
      {
        name: 'secondary',
        lighten: {
          steps: {
            h: [48, 50, 52, 52, 52],
            l: [75, 79, 83, 88, 95],
          },
          prefix: 'l',
        },
        darken: {
          steps: { l: [56, 47, 38, 29, 18, 10] },
          prefix: 'd',
        },
        pivot: { h: 50, s: 100, l: 71, a: 100 },
      },
      {
        name: 'success',
        lighten: {
          steps: {
            l: [51, 58, 67, 74, 82, 89, 95],
            s: [60, 64, 69, 68, 67, 79, 100],
          },
          prefix: 'l',
        },
        darken: {
          steps: {
            l: [38, 32, 25, 20, 10],
            s: [81, 82, 81, 82, 82],
          },
          prefix: 'd',
        },
        pivot: { h: 130, s: 76, l: 44, a: 100 },
      },
      {
        name: 'error',
        lighten: {
          steps: { l: [60, 67, 74, 82, 89, 94, 97] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [44, 36, 27, 19, 10] },
          prefix: 'd',
        },
        pivot: { h: 354, s: 83, l: 52, a: 100 },
      },
      {
        name: 'warning',
        lighten: {
          steps: { l: [67, 74, 81, 89, 94, 97] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [52, 44, 36, 27, 19, 10] },
          prefix: 'd',
        },
        pivot: { h: 24, s: 100, l: 60, a: 100 },
      },
      {
        name: 'grey',
        lighten: {
          steps: { l: [71, 77, 83, 89, 93, 96] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [56, 47, 38, 29, 20, 10] },
          prefix: 'd',
        },
        pivot: { h: 220, s: 5, l: 65, a: 100 },
      },
      {
        name: 'accent',
        pivot: { h: 283, s: 42, l: 35, a: 100 },
      },
    ];
    const palette = document.createElement('style');
    palette.innerHTML = generatePalette(colors);
    palette.id = 'dn-palette';
    document.body.appendChild(palette);
  },
};
</script>
