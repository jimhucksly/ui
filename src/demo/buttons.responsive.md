```html
<b-button
  :is-desktop-view="isDesktop"
  :is-tablet-view="isTablet"
  :is-mobile-view="isMobile"
  :responsive="true"
>
  <template #icon>
    <b-icon>user</b-icon>
  </template>
  <template #text> // используется как тултип в режиме tablet
    Ld button
  </template>
</b-button>
```