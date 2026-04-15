<template>
  <v-tooltip v-if="tablet" :disabled="noTooltip">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :class="classes"
        :style="style"
        :id="String(id)"
        :data-testid="testid"
        :variant="variant"
        :color="defaultColor"
        :disabled="disabled"
        :loading="loading"
        :size="mySize"
        :title="title"
        :icon="text"
        :aria-label="ariaLabel"
        @click="onClick"
      >
        <slot></slot>
        <slot name="icon"></slot>
        <slot name="hidden"></slot>
        <template #loader>
          <component
            :is="$ldmui.options.aliases['ld-loader']"
            :color="isFlat ? 'white' : color"
            :visible="true"
            :transparent="true"
            :size="['l', 'm'].includes(size) ? 'm' : 's'"
          />
        </template>
      </v-btn>
    </template>
    <slot name="text">
      <span>{{ tooltipText }}</span>
    </slot>
  </v-tooltip>
  <v-btn
    v-else-if="desktop || mobile"
    :id="String(id)"
    :class="classes"
    :style="style"
    :data-testid="testid"
    :variant="variant"
    :color="defaultColor"
    :disabled="disabled"
    :loading="loading"
    :size="mySize"
    :title="title"
    :icon="mobile && text"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <slot></slot>
    <slot name="icon"></slot>
    <slot name="text" v-if="desktop"></slot>
    <slot name="append"></slot>
    <slot name="hidden"></slot>
    <template #loader>
      <component
        :is="$ldmui.options.aliases['ld-loader']"
        :color="isFlat ? 'white' : color"
        :visible="true"
        :transparent="true"
        :size="['l', 'm'].includes(size) ? 'm' : 's'"
      />
    </template>
  </v-btn>
</template>
<script src="./ld-button.ts"></script>
