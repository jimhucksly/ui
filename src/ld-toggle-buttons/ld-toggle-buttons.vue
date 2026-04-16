<template>
  <div class="ld-toggle-buttons" :class="[`ld-toggle-buttons--${mySize}`, { 'ld-toggle-buttons--rounded': rounded }]">
    <div>
      <template v-for="(item, index) in items">
        <v-tooltip :disabled="!item.tooltip">
          <template #activator="{ props }">
            <button
              class="ld-toggle-button"
              v-bind="props"
              :class="{ 'ld-toggle-button--selected': modelValue === index, 'ld-toggle-button--icon': !item.text }"
              :disabled="disabled"
              @click="onClick(index)"
            >
              <slot :item="item">
                <div class="ld-toggle-button-content">
                  <component v-if="item.icon" :is="$ui.options.aliases['ld-icon']" :icon="item.icon" />
                  <span v-if="item.text">{{ item.text }}</span>
                  <component
                    v-if="$utils.isDefined(item.badge)"
                    :is="$ui.options.aliases['ld-badge']"
                    :dot="false"
                    :color="modelValue === index ? 'primary' : 'grey'"
                    :fill="modelValue === index"
                    :size="size"
                  >
                    {{ item.badge }}
                  </component>
                </div>
              </slot>
            </button>
          </template>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </template>
    </div>
  </div>
</template>
<script src="./ld-toggle-buttons.ts"></script>
