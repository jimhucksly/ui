<template>
  <div
    class="ld-radiobutton"
    :class="[
      {
        'cursor-pointer': !radio.disabled && !radio.readonly,
        'ld-radiobutton--focused': isFocused && !radio.disabled && !radio.readonly,
        'ld-radiobutton--label-to-left': labelToLeft,
        'ld-radiobutton--disabled': radio.disabled,
        'ld-radiobutton--readonly': radio.readonly,
        'ld-radiobutton--hovered': isLabelHover && !radio.disabled && !radio.readonly,
      },
      [`ld-radiobutton--${mySize}`, `text-${radio.disabled || radio.readonly ? 'default' : color}`],
    ]"
  >
    <div
      class="d-flex align-center"
      :class="{ 'flex-row-reverse justify-end': !labelToLeft }"
      style="position: relative"
    >
      <ld-help
        v-if="isShowHelp"
        :tooltip="help.tooltip"
        :link="help.link"
        :size="radio.size === 's' ? 16 : radio.size === 'm' ? 20 : 24"
        :class="{ 'mr-1': labelToLeft, 'ml-1': !labelToLeft }"
      />
      <ld-label
        v-if="label"
        :label="label"
        v-model:hover="isLabelHover"
        :class="{ 'ml-2': !labelToLeft, 'mr-2': labelToLeft }"
        style="height: 20px; min-height: 20px; font-family: var(--medium)"
        @click="onLabelClick"
      />
      <label :for="`radiobutton-${uid}`">
        <input
          ref="radioInput"
          type="radio"
          :value="value"
          :id="`radiobutton-${uid}`"
          :disabled="radio.disabled"
          :checked="isChecked"
          :tabindex="tabindex"
          @focus="onFocus"
          @blur="onBlur"
          @input="onChange($event)"
        />
        <i class="ld-radiobutton-icon"></i>
      </label>
    </div>
    <div v-if="hint" class="ld-radiobutton-hint">
      <span>{{ hint }}</span>
    </div>
  </div>
</template>
<script src="./ld-radiobutton.ts"></script>
