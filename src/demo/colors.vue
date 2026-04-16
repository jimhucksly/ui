<template>
  <v-container class="d-flex flex-column">
    <content-header>Color Scheme</content-header>
    <content-body h="600">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-container>
            <v-row class="flex-nowrap">
              <v-col v-for="arr in colorVars">
                <template v-for="i in arr">
                  <div class="d-flex">
                    <div :style="{ 'background-color': `var(${i.name})` }" style="width: 25px; height: 25px"></div>
                    <div class="d-flex flex-column px-2">
                      <span style="font-size: var(--font-size)">{{ i.name }}</span>
                      <span style="font-size: var(--caption-s); text-wrap: nowrap" class="grey--text">
                        {{ i.color }}
                      </span>
                    </div>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['colors-shadows.colors.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
    <content-header>Shadows</content-header>
    <content-body h="400">
      <ld-tabs v-bind="tabProps">
        <ld-tab index="0" heading="Playground">
          <v-row class="pt-3">
            <v-col class="d-flex">
              <div style="width: 120px; height: 80px" class="shadow-xs d-flex justify-center align-center mx-3">
                Shadow XS
              </div>
              <div style="width: 120px; height: 80px" class="shadow-s d-flex justify-center align-center mx-3">
                Shadow S
              </div>
              <div style="width: 120px; height: 80px" class="shadow-sm d-flex justify-center align-center mx-3">
                Shadow SM
              </div>
              <div style="width: 120px; height: 80px" class="shadow-m d-flex justify-center align-center mx-3">
                Shadow M
              </div>
              <div style="width: 120px; height: 80px" class="shadow-l d-flex justify-center align-center mx-3">
                Shadow L
              </div>
              <div style="width: 120px; height: 80px" class="shadow-xl d-flex justify-center align-center mx-3">
                Shadow XL
              </div>
              <div style="width: 120px; height: 80px" class="shadow-xxl d-flex justify-center align-center mx-3">
                Shadow XXL
              </div>
            </v-col>
          </v-row>
        </ld-tab>
        <ld-tab index="1" heading="Code">
          <markdown-to-html v-if="!templatesLoading" :template="templates['colors-shadows.shadows.md']" />
        </ld-tab>
      </ld-tabs>
    </content-body>
  </v-container>
</template>
<script>
/* eslint-disable @typescript-eslint/typedef */
import markdownToHTML from './mixins/markdownToHTML';
export default {
  data() {
    return {
      colorVars: [],
    };
  },
  inject: ['tabProps'],
  mixins: [markdownToHTML],
  mounted() {
    const palette = document.getElementById('ui-palette');
    const html = palette.innerHTML;
    const arr = html
      .split('\n')
      .filter(a => a.indexOf('hsla') > -1)
      .map(a => a.split(':'))
      .map(a => ({
        name: a[0].trim(),
        color: a[1].trim(),
      }));
    ['primary', 'secondary', 'success', 'warning', 'error', 'grey', 'shade'].forEach(e => {
      this.colorVars.push(arr.filter(a => a.name.indexOf(e) > -1));
    });
  },
  computed: {
    library() {
      return ['colors-shadows.colors.md', 'colors-shadows.shadows.md'];
    },
  },
};
</script>
