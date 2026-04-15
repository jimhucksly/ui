<template>
  <div
    class="ld-pager"
    :class="{
      'flex-column': isMobileGlobal,
      'ld-pager--rounded': rounded,
      'ld-pager--fluid': fluid,
      'ld-pager--unlimited': unlimited,
    }"
  >
    <template v-if="unlimited && sizes && sizes.length">
      <div style="width: 85px; margin-right: 24px">
        <component
          :is="$ldmui.options.aliases['ld-select']"
          v-model="size"
          :items="sizes"
          hide-details
          @update:model-value="onChange"
        />
      </div>
      <v-spacer v-if="fluid"></v-spacer>
    </template>
    <ul>
      <!-- to first -->
      <li>
        <button
          v-if="toFirst && !unlimited"
          :disabled="page === 1"
          aria-role="navigation"
          class="ld-pager-button ld-pager-button--icon"
          @click="selectPage(1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15.3415 6.175L14.1665 5L9.1665 10L14.1665 15L15.3415 13.825L11.5248 10L15.3415 6.175ZM10.3415 6.175L9.1665 5L4.1665 10L9.1665 15L10.3415 13.825L6.52484 10L10.3415 6.175Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </li>
      <!-- prev-->
      <li>
        <button
          class="ld-pager-button"
          :class="{ 'ml-1': toFirst, 'ld-pager-button--icon': !prevText, 'pl-1 pr-3': prevText }"
          :disabled="!canPrevious"
          aria-role="navigation"
          @click="prevPage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.8332 6.16667L11.6665 5L6.6665 10L11.6665 15L12.8332 13.8333L8.99984 10L12.8332 6.16667Z"
              fill="currentColor"
            />
          </svg>
          <span v-if="prevText" class="px-1">{{ prevText }}</span>
        </button>
      </li>
    </ul>
    <!-- pages-->
    <ul v-if="!unlimited" class="ml-1">
      <li v-for="p of pages" :key="p.number">
        <button
          class="ld-pager-button ld-pager-button--icon ml-1"
          :disable="p.number === page"
          :aria-selected="p.number === page"
          aria-role="button"
          @click="selectPage(p.number)"
        >
          {{ p.text }}
        </button>
      </li>
    </ul>
    <!-- page-->
    <slot name="page" v-if="unlimited">
      <span v-if="showPage" class="ld-pager-page"> Page: {{ page }}</span>
    </slot>
    <ul>
      <!-- next-->
      <li>
        <button
          class="ld-pager-button ml-1"
          :class="{ 'ld-pager-button--icon': !nextText, 'pl-3 pr-1': nextText }"
          :disabled="!canNext"
          aria-role="navigation"
          @click="nextPage"
        >
          <span v-if="nextText" class="px-1">{{ nextText }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.83317 5L6.6665 6.16667L10.4998 10L6.6665 13.8333L7.83317 15L12.8332 10L7.83317 5Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </li>
      <!-- to last-->
      <li>
        <button
          v-if="toLast && !unlimited"
          class="ld-pager-button ld-pager-button--icon ml-1"
          :disabled="page === totalPages"
          aria-role="navigation"
          @click="selectPage(totalPages)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1.27157e-07 1.175L1.175 0L6.175 5L1.175 10L1.27157e-07 8.825L3.81667 5L1.27157e-07 1.175ZM5 1.175L6.175 0L11.175 5L6.175 10L5 8.825L8.81667 5L5 1.175Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </li>
    </ul>
    <template v-if="!fluid">
      <v-spacer></v-spacer>
      <span v-if="showSelectCounter" style="padding-right: 8px">
        <slot name="selection"></slot>
      </span>
      <span v-if="showTotal">
        <slot name="total" :total="options.total"></slot>
      </span>
    </template>
  </div>
</template>
<script src="./ld-pager.ts"></script>
