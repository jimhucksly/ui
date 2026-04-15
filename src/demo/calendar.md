```html
<ld-calendar
  v-model="value"
  v-model:month="month"
  v-model:year="year"
  :disabled="disabled"
  :readonly="readonly"
  :min-date="minDate ? getMinDate : null"
  :max-date="maxDate ? getMaxDate : null"
  :view-mode="viewMode"
  :disabled-dates="disabledDates"
  :allowed-dates="allowedDates"
  :scrolling="scrolling"
  @pick-day="pickDay"
>
  <template #header-title="{ page }">
    <span>\{\{ page.title \}\}</span>
  </template>
</ld-calendar>
```

* Props
```ts
value: Date;
month: number;
year: number;
disabled: boolean;
readonly: boolean;
minDate: Date;
maxDate: Date;
viewMode: 'month' | 'months' | 'year';
disabledDates: Array<Date>;
allowedDates: Array<Date>;
scrolling: boolean // возможсти листать месяцы в календаре с помощью колеса мыши (по умолчанию true)
```
