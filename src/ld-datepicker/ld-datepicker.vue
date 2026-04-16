<template>
  <v-container
    class="ld-datepicker"
    :class="[
      `ld-datepicker--${mySize}`,
      `ld-datepicker--${color}`,
      {
        'ld-datepicker--focused': isFocused,
        'ld-datepicker--dateonly': dateonly,
        'ld-datepicker--label-on-top': labelOnTop,
      },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <!-- date -->
          <v-menu
            v-model="menu"
            class="ld-datepicker-menu"
            max-width="284"
            min-width="284"
            max-height="352"
            min-height="352"
            scroll-strategy="close"
            :disabled="disabled || readonly"
            :close-on-content-click="false"
            :no-click-animation="true"
          >
            <template #activator="{ props }">
              <div class="ld-datepicker-date-field" v-bind="props">
                <component
                  :is="$ui.options.aliases['ld-edit-text']"
                  :id="`input-date-${uid}`"
                  :model-value="formattedDate"
                  ref="inputDate"
                  v-bind="{
                    ...inputBindings,
                    ...editboxBindings,
                  }"
                  :clearable="clearable"
                  :hide-details="true"
                  :placeholder="placeholder"
                  @focus="onInputDateFocus"
                  @blur="onInputDateBlur"
                  @enter="onInputDateEnter"
                  @clear="onInputDateClear"
                >
                  <template #append-inner>
                    <component
                      :is="$ui.options.aliases['ld-button']"
                      icon
                      text
                      :disabled="disabled || readonly"
                      @click.stop="menu = !menu"
                    >
                      <svg-icon>event</svg-icon>
                    </component>
                  </template>
                </component>
              </div>
            </template>
            <v-card elevation="0" class="ld-datepicker-dropdown">
              <component
                :is="$ui.options.aliases['ld-calendar']"
                ref="datepickerRef"
                :model-value="date"
                v-model:month="currentMonth"
                v-model:year="currentYear"
                v-bind="{
                  ...datepickerProps,
                }"
                :disabled="disabled || readonly"
                @update:model-value="onSelectDate"
              />
            </v-card>
          </v-menu>
          <!-- time -->
          <div v-if="!dateonly" class="ld-datepicker-time-field">
            <component
              :is="$ui.options.aliases['ld-timepicker']"
              :model-value="timeString"
              v-bind="{
                ...timepickerProps,
              }"
              :disabled="disabled || isDateEmpty"
              :readonly="readonly"
              :clearable="clearable"
              :size="size"
              :color="color"
              hide-details
              @update:model-value="onSelectTime"
            />
          </div>
          <div v-if="isShowHelp" class="ld-datepicker-help">
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
<script src="./ld-datepicker.ts"></script>
