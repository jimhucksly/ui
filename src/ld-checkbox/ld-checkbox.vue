<template>
  <div
    class="ld-checkbox"
    :class="[
      {
        'ld-checkbox--focused': isFocused && !disabled,
        'ld-checkbox--disabled': disabled,
        'ld-checkbox--readonly': readonly,
        'ld-checkbox--hovered': isLabelHover && !disabled,
        'ld-checkbox--label-to-left': labelToLeft,
        'cursor-pointer': !disabled,
      },
      `text-${disabled ? 'default' : color}`,
      mySize,
    ]"
  >
    <div class="d-flex align-center" :class="{ 'flex-row-reverse justify-end': !labelToLeft }">
      <ld-help
        v-if="isShowHelp"
        :tooltip="help.tooltip"
        :link="help.link"
        :size="size === 's' ? 16 : size === 'm' ? 20 : 24"
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
      <label style="position: relative" @click.stop="() => null">
        <input
          ref="checkbox"
          type="checkbox"
          name="cheсkbox"
          :checked="internalValue"
          :data-testid="dataTestid"
          :tabindex="tabindex"
          :disabled="disabled"
          @focus="onFocus"
          @blur="onBlur"
          @input="onChange"
        />
        <i class="ld-checkbox-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="5" viewBox="0 0 7 5" fill="none">
            <path
              d="M0.5 2.3L2.46364 4.1C2.46364 4.1 4.55802 1.90589 5.9 0.5"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </i>
      </label>
    </div>
    <div v-if="hint" class="ld-checkbox-hint">
      <span>{{ hint }}</span>
    </div>
  </div>
</template>
<script src="./ld-checkbox.ts"></script>
