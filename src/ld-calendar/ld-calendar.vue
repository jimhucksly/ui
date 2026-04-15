<template>
  <v-date-picker
    :class="['ld-calendar', { 'ld-calendar--range': isRange }]"
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
        <button :disabled="disabled || readonly" @click="openMonths">{{ $ldmuii18n.gettext(monthText) }}</button>
        <button :disabled="disabled || readonly" class="ml-1" @click="openYears">{{ yearText }}</button>
        <v-spacer></v-spacer>
        <component
          :is="$ldmui.options.aliases['ld-button']"
          icon
          text
          :disabled="disabled || readonly"
          @click="prevMonth"
        >
          <svg-icon>arrow left</svg-icon>
        </component>
        <component
          :is="$ldmui.options.aliases['ld-button']"
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
          <button :disabled="true">{{ $ldmuii18n.gettext(monthText) }}</button>
        </div>
      </template>
      <template v-if="isYear">
        <div class="w-100 d-flex justify-space-between">
          <component
            :is="$ldmui.options.aliases['ld-button']"
            icon
            text
            :disabled="disabled || readonly"
            @click="displayedCurrentYear -= 10"
          >
            <svg-icon>arrow left</svg-icon>
          </component>
          <button :disabled="true">{{ yearText }}</button>
          <component
            :is="$ldmui.options.aliases['ld-button']"
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
        class="ld-calendar-day"
        :class="{
          'ld-calendar-day--today': item.isToday,
          'ld-calendar-day--selected': item.isSelected,
          'ld-calendar-day--start': rangeService.isStart(item.date),
          'ld-calendar-day--end': rangeService.isEnd(item.date),
          'ld-calendar-day--in-range': rangeService.inRange(item.date),
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
        class="ld-calendar-month"
        :class="{
          'ld-calendar-month--today': i === now.getMonth(),
          'ld-calendar-month--selected': i === currentMonth,
        }"
        @click="props.onClick"
      >
        <span>
          {{ $ldmuii18n.gettext(month.text) }}
        </span>
      </button>
      <div style="display: none">{{ month }}</div>
    </template>
    <template #year="{ year, props }">
      <template v-if="displayYear(year.value)">
        <button
          class="ld-calendar-year"
          :class="{
            'ld-calendar-year--today': year.value === now.getFullYear(),
            'ld-calendar-year--selected': year.value === currentYear,
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
<script src="./ld-calendar.ts"></script>
