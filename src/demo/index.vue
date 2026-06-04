<template>
  <v-app :aria-tab="currentTab ? currentTab.name : ''">
    <div style="position: relative; flex-basis: 100%; overflow: hidden">
      <loader :visible="!currentTab" />
      <b-tabs
        v-if="currentTab"
        :model-value="currentTab.id"
        :mobile="false"
        no-padding
        no-header
        id="main-tabs"
        @update:model-value="onTab"
      >
        <template v-for="(tab, i) in tabs">
          <b-tab :index="i" :readonly="tab.disabled" :heading="tab.name">
            <template #header>
              <strong v-if="tab.disabled" style="letter-spacing: 1px; color: var(--warning-d-1)">
                - {{ tab.name }}
              </strong>
              <template v-else>
                <span> {{ tab.name }} </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 1024 1024"><path fill="#803680" d="m4.484 510.11 168.627 89.708 340.507-89.708H173.11Z"/><path fill="#6a3480" d="m4.484 510.11 168.627-89.708 340.507 89.708H173.11Z"/><path fill="#ffe680" d="M513.618.976 423.91 169.603l89.708 340.507V169.603z"/><path fill="#ffe66a" d="m513.618.976 89.708 168.627-89.708 340.507V169.603z"/><path fill="#aeff00" d="m1022.751 510.11-168.627-89.708-340.506 89.708h340.506z"/><path fill="#86ff00" d="m1022.751 510.11-168.627 89.708-340.506-89.708h340.506z"/><path fill="#286ac5" d="M513.618 1019.243 423.91 850.616l89.708-340.506v340.506z"/><path fill="#288bc5" d="m513.618 1019.243 89.708-168.627-89.708-340.506v340.506z"/><path fill="#ff5855" d="m656.803 269.853-123.6 222.697 157.468-159.048Z"/><path fill="#f25" d="M690.771 333.402 533.204 492.55l214.003-129.199-55.948-29.764z"/><path fill="#ff5855" d="M370.433 269.853 494.032 492.55 336.565 333.502z"/><path fill="#f25" d="M336.464 333.402 494.032 492.55 280.029 363.351l55.947-29.764z"/><path fill="#ff5855" d="M370.433 750.366 494.032 527.67 336.565 686.717z"/><path fill="#f25" d="M336.464 686.818 494.032 527.67 280.029 656.868l55.947 29.765z"/><path fill="#ff5855" d="m656.803 750.366-123.6-222.697 157.468 159.048Z"/><path fill="#f25" d="M690.771 686.818 533.204 527.669l214.003 129.2-55.948 29.764z"/></svg>
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
          </b-tab>
        </template>
      </b-tabs>
      <div
        class="white--text d-flex align-center justify-center"
        style="position: absolute; bottom: 0; left: 0; height: 24px; margin-left: 24px; width: 13%"
      >
        <b-button text color="white" style="opacity: 0.7"> v. {{ version }} </b-button>
      </div>
    </div>
    <b-dialog />
  </v-app>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./scss/main.scss"></style>
