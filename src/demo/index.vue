<template>
  <v-app :aria-tab="currentTab ? currentTab.name : ''">
    <div style="position: relative; flex-basis: 100%; overflow: hidden">
      <loader :visible="!currentTab" />
      <ld-tabs
        v-if="currentTab"
        :model-value="currentTab.id"
        :mobile="false"
        no-padding
        no-header
        id="main-tabs"
        @update:model-value="onTab"
      >
        <template v-for="(tab, i) in tabs">
          <ld-tab :index="i" :readonly="tab.disabled" :heading="tab.name">
            <template #header>
              <strong v-if="tab.disabled" style="letter-spacing: 1px; color: var(--secondary-l-1)">
                - {{ tab.name }}
              </strong>
              <template v-else>
                <span> {{ tab.name }} </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 0H0V4H4V0Z" fill="white" />
                  <path d="M9 0H5V3.99999H9V0Z" fill="#1BC337" />
                  <path d="M14 0H10V3.99999H14V0Z" fill="white" />
                  <path d="M4 5H0V8.99999H4V5Z" fill="#0099FF" />
                  <path d="M9 5H5V8.99999H9V5Z" fill="#FF8533" />
                  <path d="M14 5H10V8.99999H14V5Z" fill="#0099FF" />
                  <path d="M4 10H0V14H4V10Z" fill="white" />
                  <path d="M9 10H5V14H9V10Z" fill="#0099FF" />
                  <path d="M14 10H10V14H14V10Z" fill="white" />
                </svg>
              </template>
            </template>
            <template #default>
              <v-container fluid v-if="currentTab.id === tab.id">
                <v-row>
                  <v-col cols="12" class="pb-3">
                    <component :is="tab.component" @go="start" />
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </ld-tab>
        </template>
      </ld-tabs>
      <div
        class="white--text d-flex align-center justify-center"
        style="position: absolute; bottom: 0; left: 0; height: 24px; margin-left: 24px; width: 13%"
      >
        <ld-button text color="white" style="opacity: 0.7"> v. {{ version }} </ld-button>
      </div>
    </div>
    <ld-dialog />
  </v-app>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./scss/main.scss"></style>
