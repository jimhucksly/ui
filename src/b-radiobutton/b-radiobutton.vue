<template>
  <div
    class="b-radiobutton"
    :class="[
      {
        'cursor-pointer': !radio.disabled && !radio.readonly,
        'b-radiobutton--focused': isFocused && !radio.disabled && !radio.readonly,
        'b-radiobutton--label-to-left': labelToLeft,
        'b-radiobutton--disabled': radio.disabled,
        'b-radiobutton--readonly': radio.readonly,
        'b-radiobutton--hovered': isLabelHover && !radio.disabled && !radio.readonly,
      },
      [`b-radiobutton--${mySize}`, `text-${radio.disabled || radio.readonly ? 'default' : color}`],
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
      <b-label
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
        <i class="b-radiobutton-icon"></i>
      </label>
    </div>
    <div v-if="hint" class="b-radiobutton-hint">
      <span>{{ hint }}</span>
    </div>
  </div>
</template>
<script src="./b-radiobutton.ts"></script>
