```html
<ld-button
  :is-desktop-view="isDesktop"
  :is-tablet-view="isTablet"
  :is-mobile-view="isMobile"
  :responsive="true"
>
  <template #icon>
    <ld-icon>user</ld-icon>
  </template>
  <template #text> // используется как тултип в режиме tablet
    Ld button
  </template>
</ld-button>
```