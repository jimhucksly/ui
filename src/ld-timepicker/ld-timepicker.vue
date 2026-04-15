<template>
  <v-container
    class="ld-timepicker"
    :class="[
      `ld-timepicker--${mySize}`,
      `ld-timepicker--${color}`,
      {
        'ld-timepicker--focused': isFocused,
        'ld-timepicker--label-on-top': labelOnTop,
      },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="bottom"
            min-width="112"
            max-width="112"
            class="ld-timepicker-menu"
            scroll-strategy="close"
            :disabled="readonly || disabled"
          >
            <template #activator="{ props }">
              <div class="d-flex align-center w-100" v-bind="props" style="position: relative">
                <component
                  :is="$ldmui.options.aliases['ld-edit-text']"
                  ref="inputTime"
                  :model-value="_time"
                  v-bind="{
                    ...inputBindings,
                    ...editboxBindings,
                  }"
                  :placeholder="defaultPlaceholder"
                  :hide-details="true"
                  :clearable="clearable"
                  :readonly="true"
                  :disabled="disabled"
                  @focus="onFocus"
                  @blur="onBlur"
                  @clear="clear"
                >
                  <template #append-inner>
                    <component
                      :is="$ldmui.options.aliases['ld-button']"
                      icon
                      text
                      style="color: var(--grey-d-1)"
                      :disabled="readonly || disabled"
                      @click.stop="menu = !menu"
                    >
                      <svg-icon>clock</svg-icon>
                    </component>
                  </template>
                </component>
              </div>
            </template>
            <v-card elevation="0" class="ld-timepicker-dropdown">
              <v-container class="pa-0">
                <v-row no-gutters v-if="!is24hr" class="mb-1">
                  <v-col class="ld-timepicker-ampm">
                    <v-btn :active="isAM" @click="setAmPm('am')">am</v-btn>
                    <v-btn :active="isPM" @click="setAmPm('pm')">pm</v-btn>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mb-1">
                  <v-col class="ld-timepicker-placeholder" style="color: var(--grey-d-1); height: var(--icon-height)">
                    <div>{{ defaultPlaceholder.split(':')[0] }}</div>
                    <div>:</div>
                    <div>{{ defaultPlaceholder.split(':')[1] }}</div>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mb-1">
                  <v-col class="ld-timepicker-inputs">
                    <component
                      :is="$ldmui.options.aliases['ld-edit-text']"
                      :id="`timeinput-h-${uid}`"
                      ref="timeinput-h"
                      :model-value="_hours"
                      maxlength="2"
                      placeholder="00"
                      hide-details
                      @input="onInputHours"
                      @enter="menu = !menu"
                      @keydown="onKeydown"
                    />
                    <div class="d-flex align-center">:</div>
                    <component
                      :is="$ldmui.options.aliases['ld-edit-text']"
                      :id="`timeinput-m-${uid}`"
                      ref="timeinput-m"
                      :model-value="_minutes"
                      maxlength="2"
                      placeholder="00"
                      hide-details
                      @input="onInputMinutes"
                      @enter="menu = !menu"
                      @keydown="onKeydown"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="ld-timepicker-options">
                    <div class="d-flex flex-column scroll-s">
                      <component
                        :is="$ldmui.options.aliases['ld-button']"
                        :color="buttonText(i) === _hours ? 'primary' : 'grey'"
                        variant="text"
                        icon
                        class="mb-1"
                        v-for="i in new Array(is24hr ? 24 : 12).fill(null).map((_, j) => j)"
                        :key="i"
                        @click="setHours(is24hr ? i : i + 1)"
                      >
                        {{ buttonText(is24hr ? i : i + 1) }}
                      </component>
                    </div>
                    <div class="d-flex flex-column scroll-s">
                      <component
                        :is="$ldmui.options.aliases['ld-button']"
                        :color="buttonText(i) === _minutes ? 'primary' : 'grey'"
                        variant="text"
                        icon
                        v-for="i in new Array(60).fill(null).map((_, j) => j)"
                        :key="i"
                        @click="setMinutes(i)"
                      >
                        {{ buttonText(i) }}
                      </component>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-menu>
          <div v-if="isShowHelp" class="ld-timepicker-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-timepicker.ts"></script>
