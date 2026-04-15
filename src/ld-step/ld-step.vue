<template>
  <div class="ld-step" :class="[`ld-step--${myDirection}`]">
    <template v-if="hasItems">
      <div
        v-for="item in internalItems"
        :key="item.uid"
        class="ld-step-item"
        :class="[
          `ld-step-item--${item.result ? item.result : item.type ? item.type : 'default'}`,
          { 'ld-step-item--disabled': item.disabled },
        ]"
      >
        <div class="ld-step-item-icon" v-if="item.result || item.type">
          <v-tooltip :disabled="!item.tooltip" v-bind="item.tooltipProps || {}">
            <template #activator="{ props }">
              <div v-bind="props" style="width: var(--icon-height); height: var(--icon-height)">
                <template v-if="item.type === completedType">
                  <svg
                    v-if="item.result === successResult"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="12" fill="currentColor" />
                    <path
                      d="M17.6667 8.27337L9.66667 16.2734L6 12.6067L6.94 11.6667L9.66667 14.3867L16.7267 7.33337L17.6667 8.27337Z"
                      fill="white"
                    />
                  </svg>
                  <svg
                    v-if="item.result === warningResult"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="12" fill="currentColor" />
                    <path
                      d="M10.6665 6H13.3332V13.3333H10.6665V6ZM10.6665 18V15.3333H13.3332V18H10.6665Z"
                      fill="white"
                    />
                  </svg>
                  <svg
                    v-if="item.result === errorResult"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="12" fill="currentColor" />
                    <path
                      d="M10.6665 6H13.3332V13.3333H10.6665V6ZM10.6665 18V15.3333H13.3332V18H10.6665Z"
                      fill="white"
                    />
                  </svg>
                </template>
                <template v-if="item.type === activeType">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="22" height="22" rx="11" stroke="currentColor" stroke-width="2" />
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                  </svg>
                </template>
                <template v-if="item.type === scheduledType">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="22" height="22" rx="11" stroke="currentColor" stroke-width="2" />
                  </svg>
                </template>
              </div>
            </template>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </div>
        <div class="ld-step-item-title">
          <span>{{ item.title }}</span>
          <div class="ld-step-item-subtitle" v-if="item.subtitle">
            {{ item.subtitle }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script src="./ld-step.ts"></script>
