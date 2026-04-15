<template>
  <v-btn
    class="ld-avatar"
    :class="[
      { 'ld-avatar--focused': isFocused },
      `ld-avatar--${mySize}`,
      `ld-avatar--theme-${theme}`,
      `ld-avatar--${full ? 'full' : 'short'}`,
    ]"
    variant="tonal"
    :tabindex="tabindex"
    @click="onClick"
    @focus="onFocus"
    @blur="onBlur"
  >
    <div class="ld-avatar-base">
      <slot name="avatar"></slot>
      <i v-if="online" class="ld-avatar-online"></i>
    </div>
    <div class="ld-avatar-content" v-if="showContent">
      <span class="ld-avatar-content-base">
        <slot name="content"></slot>
      </span>
      <span class="ld-avatar-content-hint" v-if="showHint">
        <slot name="hint"></slot>
      </span>
    </div>
    <div v-if="showContent && showIcon" class="ld-avatar-append">
      <slot name="append"></slot>
    </div>
  </v-btn>
</template>
<script src="./ld-avatar.ts"></script>
