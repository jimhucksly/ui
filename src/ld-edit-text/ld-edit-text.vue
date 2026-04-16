<template>
  <v-container
    class="ld-edit-text"
    :class="[
      `ld-edit-text--${mySize}`,
      `ld-edit-text--${color}`,
      { 'ld-edit-text--focused': isFocused, 'ld-edit-text--label-on-top': labelOnTop },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <!-------------->
        <!------- text ------->
        <!-------------->
        <div class="d-flex align-start" v-if="!onlyNumbers">
          <v-text-field
            ref="vInput"
            :id="id"
            v-bind="{
              ...inputBindings,
              ...editboxBindings,
            }"
            :model-value="modelValue"
            :type="type === 'password' ? 'text' : type"
            :class="{ 'ld-edit-text--type-password': type === 'password' && !passwordVisible }"
            :rules="validRules"
            :validation-value="type === 'password' ? savedModelValue : modelValue"
            :maxlength="maxlength"
            :error="showError"
            :error-messages="validationMessage"
            :prepend-inner-icon="prependInnerIcon"
            @change="emitChange"
            @update:model-value="onUpdateModelValue"
            @blur="onBlur"
            @focus="onFocus"
            @click="emitClick"
            @click:clear="emitClear"
            @keydown.stop="onKeydown"
            @copy="emitCopy"
          >
            <template #prepend-inner v-if="$slots['prepend-inner']">
              <slot name="prepend-inner"></slot>
            </template>
            <template #append-inner v-if="$slots['append-inner'] || type === 'password'">
              <component
                :is="$ui.options.aliases['ld-button']"
                v-if="type === 'password'"
                aria-label="toggle"
                tabindex="1"
                icon
                text
                tooltip
                :tooltip-text="passwordVisible ? $uii18n.gettext('Hide password') : $uii18n.gettext('Show password')"
                @click="passwordVisibilityToggle"
              >
                <svg-icon v-if="passwordVisible">visibility_off</svg-icon>
                <svg-icon v-else>visibility</svg-icon>
              </component>
              <slot name="append-inner"></slot>
            </template>
            <template #message="{ message }">
              <span v-if="showError || (inputHint && persistentHint)" :class="{ 'error--text': validationMessage }">
                {{ message }}
              </span>
            </template>
            <template v-if="clearable" #clear="{ props }">
              <component :is="$ui.options.aliases['ld-button']" text icon v-bind="props">
                <svg-icon>clear</svg-icon>
              </component>
            </template>
          </v-text-field>
          <div v-if="isShowHelp" class="ld-edit-text-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
        <!-------------->
        <!------- numbers ------->
        <!-------------->
        <div v-else class="d-flex align-start">
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
                    ref="maskInput"
                    class="v-field__input"
                    type="text"
                    :id="`input-v-${uid}`"
                    v-model:value="value"
                    :mask="Number"
                    :maxlength="maxlength"
                    :scale="scale"
                    :signed="signed"
                    :min="minValue"
                    :max="maxValue"
                    :disabled="disabled"
                    :readonly="readonly"
                    :tabindex="tabindex"
                    :class="{ disabled }"
                    :placeholder="placeholder"
                    @click="emitClick"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keydown.stop="onKeydown"
                  />
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
          <div v-if="isShowHelp" class="ld-edit-text-help" style="height: var(--input-height)">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-edit-text.ts"></script>
