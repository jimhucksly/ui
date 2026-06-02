<template>
  <v-date-picker
    :class="['b-calendar', { 'b-calendar--range': isRange }]"
    ref="vInput"
    v-model="internalValue"
    v-model:month="currentMonth"
    v-model:year="currentYear"
    hide-header
    hide-title
    weekday-format="short"
    :disabled="disabled || readonly"
    :first-day-of-week="firstDayOfWeek"
    :min="minDate"
    :max="maxDate"
    :view-mode="internalViewMode"
    :show-adjacent-months="true"
    :allowed-dates="getAllowedDates"
    @update:month="onUpdateMonth"
    @update:year="onUpdateYear"
    @update:view-mode="onUpdateViewMode"
  >
    <template #controls="{ monthText, yearText, prevMonth, nextMonth, openMonths, openYears }">
      <template v-if="isMonth">
        <button :disabled="disabled || readonly" @click="openMonths">{{ $i18n.gettext(monthText) }}</button>
        <button :disabled="disabled || readonly" class="ml-1" @click="openYears">{{ yearText }}</button>
        <v-spacer></v-spacer>
        <component :is="$ui.options.aliases['b-button']" icon text :disabled="disabled || readonly" @click="prevMonth">
          <svg-icon>arrow left</svg-icon>
        </component>
        <component
          :is="$ui.options.aliases['b-button']"
          icon
          text
          :disabled="disabled || readonly"
          class="ml-4"
          @click="nextMonth"
        >
          <svg-icon>arrow right</svg-icon>
        </component>
      </template>
      <template v-if="isMonths">
        <div class="w-100 d-flex justify-center">
          <button :disabled="true">{{ $i18n.gettext(monthText) }}</button>
        </div>
      </template>
      <template v-if="isYear">
        <div class="w-100 d-flex justify-space-between">
          <component
            :is="$ui.options.aliases['b-button']"
            icon
            text
            :disabled="disabled || readonly"
            @click="displayedCurrentYear -= 10"
          >
            <svg-icon>arrow left</svg-icon>
          </component>
          <button :disabled="true">{{ yearText }}</button>
          <component
            :is="$ui.options.aliases['b-button']"
            icon
            text
            :disabled="disabled || readonly"
            class="ml-4"
            @click="displayedCurrentYear += 10"
          >
            <svg-icon>arrow right</svg-icon>
          </component>
        </div>
      </template>
    </template>
    <template #day="{ item, props }">
      <button
        class="b-calendar-day"
        :class="{
          'b-calendar-day--today': item.isToday,
          'b-calendar-day--selected': item.isSelected,
          'b-calendar-day--start': rangeService.isStart(item.date),
          'b-calendar-day--end': rangeService.isEnd(item.date),
          'b-calendar-day--in-range': rangeService.inRange(item.date),
        }"
        :disabled="item.isDisabled"
        @click="onClick($event, item.date, props.onClick)"
      >
        <span> {{ item.localized }} </span>
      </button>
      <div style="display: none" v-if="isDev">{{ item }}</div>
    </template>
    <template #month="{ month, props, i }">
      <button
        class="b-calendar-month"
        :class="{
          'b-calendar-month--today': i === now.getMonth(),
          'b-calendar-month--selected': i === currentMonth,
        }"
        @click="props.onClick"
      >
        <span>
          {{ $i18n.gettext(month.text) }}
        </span>
      </button>
      <div style="display: none">{{ month }}</div>
    </template>
    <template #year="{ year, props }">
      <template v-if="displayYear(year.value)">
        <button
          class="b-calendar-year"
          :class="{
            'b-calendar-year--today': year.value === now.getFullYear(),
            'b-calendar-year--selected': year.value === currentYear,
          }"
          @click="props.onClick"
        >
          <span>{{ year.text }}</span>
        </button>
        <div style="display: none">
          {{ year }}
        </div>
      </template>
    </template>
  </v-date-picker>
</template>
<script src="./b-calendar.ts"></script>
