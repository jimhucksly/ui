<template>
  <div
    class="ld-switch"
    :class="[
      {
        'ld-switch--focused': isFocused && !disabled && !readonly,
        'ld-switch--disabled': disabled,
        'ld-switch--readonly': readonly,
        'ld-switch--hovered': isLabelHover && !disabled && !readonly,
        'ld-switch--active': checked,
      },
      mySize,
    ]"
  >
    <div class="d-flex align-center">
      <label class="ld-switch-track">
        <input
          ref="checkbox"
          type="checkbox"
          name="cheсkbox"
          :checked="checked"
          :tabindex="tabindex"
          :disabled="disabled"
          @focus="onFocus"
          @blur="onBlur"
          @input="onChange"
        />
        <i class="ld-switch-thumb">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :width="sizes[size]"
            :height="sizes[size]"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 0C12.48 0 16 3.52 16 8C16 12.48 12.48 16 8 16C3.52 16 0 12.48 0 8C0 3.52 3.52 0 8 0ZM8 2.83301C7.44762 2.83301 6.91801 3.05286 6.52734 3.44336C6.13664 3.83406 5.91699 4.36446 5.91699 4.91699V5.75H5.5C5.04177 5.75 4.66717 6.12066 4.66699 6.58301V10.75C4.66699 10.971 4.75485 11.1826 4.91113 11.3389C5.06741 11.4951 5.27899 11.583 5.5 11.583H10.5C10.721 11.583 10.9326 11.4951 11.0889 11.3389C11.2451 11.1826 11.333 10.971 11.333 10.75V6.58301C11.3329 6.36211 11.2451 6.15034 11.0889 5.99414C10.9326 5.83796 10.7209 5.75 10.5 5.75H10.083V4.91699C10.083 4.6434 10.0295 4.3719 9.9248 4.11914C9.82011 3.86646 9.66606 3.63676 9.47266 3.44336C9.27927 3.25006 9.04949 3.09683 8.79688 2.99219C8.54418 2.88755 8.2735 2.83301 8 2.83301ZM8 7.83301C8.45833 7.83301 8.83301 8.20449 8.83301 8.66699C8.83292 8.88789 8.74507 9.09966 8.58887 9.25586C8.4326 9.41204 8.22094 9.5 8 9.5C7.77906 9.5 7.5674 9.41204 7.41113 9.25586C7.25493 9.09966 7.16708 8.88789 7.16699 8.66699C7.16699 8.44598 7.25485 8.23343 7.41113 8.07715C7.56738 7.92107 7.77914 7.83301 8 7.83301ZM8 3.66699C8.33152 3.66699 8.64937 3.79878 8.88379 4.0332C9.11811 4.26761 9.25 4.58555 9.25 4.91699V5.75H6.75V4.91699C6.75 4.58555 6.88189 4.26761 7.11621 4.0332C7.35063 3.79878 7.66848 3.66699 8 3.66699Z"
              fill="white"
            />
          </svg>
        </i>
      </label>
      <ld-label
        v-if="label"
        :label="label"
        class="ld-switch-label"
        v-model:hover="isLabelHover"
        :class="{ 'ml-2': size !== 'l', 'ml-3': size === 'l' }"
        @click="onLabelClick"
      />
      <ld-help
        v-if="isShowHelp"
        :tooltip="help.tooltip"
        :link="help.link"
        :size="size === 's' ? 16 : size === 'm' ? 20 : 24"
        class="ml-1"
      />
    </div>
    <div v-if="hint" class="ld-switch-hint">
      <span>{{ hint }}</span>
    </div>
  </div>
</template>
<script src="./ld-switch.ts"></script>
