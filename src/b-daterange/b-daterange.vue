<template>
  <v-container
    class="b-daterange"
    :class="[
      `b-daterange--${mySize}`,
      `b-daterange--${color}`,
      {
        'b-daterange--focused': isFocused,
        'b-daterange--label-on-top': labelOnTop,
      },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <b-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <v-menu
            v-model="menu"
            class="b-daterange-menu"
            max-width="568"
            min-width="568"
            scroll-strategy="close"
            :disabled="disabled || readonly"
            :close-on-content-click="false"
            :no-click-animation="true"
          >
            <template #activator="{ props }">
              <div class="b-daterange-date-field" v-bind="props">
                <component
                  :is="$ui.options.aliases['b-edit-text']"
                  :id="`input-date-${uid}`"
                  :model-value="formattedDate"
                  ref="inputDate"
                  v-bind="{
                    ...inputBindings,
                    ...editboxBindings,
                  }"
                  :clearable="!readonly && !disabled"
                  :hide-details="true"
                  :placeholder="placeholder"
                  @focus="onInputDateFocus"
                  @blur="onInputDateBlur"
                  @clear="onInputDateClear"
                >
                  <template #append-inner>
                    <component
                      :is="$ui.options.aliases['b-button']"
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
            <v-card elevation="0" class="b-daterange-dropdown">
              <v-card-text>
                <component
                  :is="$ui.options.aliases['b-calendar']"
                  ref="startDatepickerRef"
                  v-model="a"
                  v-bind="{
                    ...datepickerProps,
                  }"
                  :disabled="disabled || readonly"
                  :month="startMonth"
                  :year="startYear"
                  :range="[startDate, endDate]"
                  @pick-day="onSelectDate($event)"
                  @update:month="onUpdateMonth(0, $event)"
                />
                <component
                  :is="$ui.options.aliases['b-calendar']"
                  ref="endDatepickerRef"
                  v-model="b"
                  v-bind="{
                    ...datepickerProps,
                  }"
                  :disabled="disabled || readonly"
                  :month="endMonth"
                  :year="endYear"
                  :range="[startDate, endDate]"
                  @pick-day="onSelectDate($event)"
                  @update:month="onUpdateMonth(1, $event)"
                />
              </v-card-text>
              <v-card-actions>
                <b-button variant="outlined" @click="menu = false">
                  {{ $i18n.gettext('Dialog Cancel') }}
                </b-button>
                <b-button @click="onSave">{{ $i18n.gettext('Dialog Save') }}</b-button>
              </v-card-actions>
            </v-card>
          </v-menu>
          <div v-if="isShowHelp" class="b-daterange-help">
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
<script src="./b-daterange.ts"></script>
