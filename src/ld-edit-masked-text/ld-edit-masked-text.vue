<template>
  <div
    class="ld-edit-masked-text"
    :class="[
      `ld-edit-masked-text--${mySize}`,
      `ld-edit-masked-text--${color}`,
      { 'ld-edit-masked-text--focused': isFocused, 'ld-edit-masked-text--label-on-top': labelOnTop },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <div
            class="v-input v-input--horizontal"
            :class="{ 'v-input--disabled': disabled, 'v-input--focused': isFocused }"
          >
            <div class="v-input__control">
              <div
                class="v-field v-field--variant-outlined"
                :class="{ 'v-field--disabled': disabled, 'v-field--focused': isFocused }"
              >
                <div class="v-field__field">
                  <imask-input
                    ref="imask"
                    class="v-field__input"
                    :id="`input-v-${uid}`"
                    radix=","
                    v-model:value="internalValue"
                    :mask="mask"
                    :scale="scale"
                    :thousands-separator="thousandsSeparator"
                    :signed="signed"
                    :mapToRadix="mapToRadix"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    @accept:masked="onInput"
                    @focus="onFocus"
                    @blur="onBlur"
                    @click="onClick"
                    @keydown.enter="onEnter"
                  >
                    <template #append-inner>
                      <component
                        :is="$ldmui.options.aliases['ld-button']"
                        v-if="clearIcon && text"
                        icon
                        text
                        color="error"
                        @click="emitUpdateModelValue('')"
                      >
                        <svg-icon>close</svg-icon>
                      </component>
                    </template>
                  </imask-input>
                  <span class="v-text-field__suffix" v-if="suffix">
                    <span class="v-text-field__suffix__text">
                      {{ suffix }}
                    </span>
                  </span>
                  <div class="v-field__outline">
                    <div class="v-field__outline__start"></div>
                    <div class="v-field__outline__end"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="v-input__details" v-if="!hideDetails">
              <div class="v-messages">
                <div class="v-messages__message">
                  <transition name="squash">
                    <span v-if="showError" class="error--text">{{ validationMessage }}</span>
                    <span v-else-if="inputHint && persistentHint" class="grey--text">{{ inputHint }}</span>
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isShowHelp" class="ld-edit-masked-text-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script src="./ld-edit-masked-text.ts"></script>
