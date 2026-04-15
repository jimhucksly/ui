<template>
  <div class="ld-data-iterator">
    <div class="top-fixed-item-wrapper" v-if="fixedTopContext">
      <iterator-item
        :id="'idx' + fixedTopContext.rowIndex"
        class="top-fixed-item"
        :data-uid="id(fixedTopContext.row)"
        data-test-id="topFixedIeratorItem"
        @click="onClick(fixedTopContext)"
        @dblclick="onClick(fixedTopContext)"
        @update-height="onUpdateFixedTopHeight"
      >
        <slot v-bind="{ item: fixedTopContext.row }"> {{ entityFromItem(fixedTopContext.row)[keyProp] }} </slot>
      </iterator-item>
    </div>
    <div ref="list" id="iterator-list" class="iterator-list" :style="listStyles">
      <div ref="scroller" class="scroller" :class="{ mobile: isMobileGlobal }" :style="scrollerStyles">
        <iterator-item
          v-for="item of visibleItems"
          :id="'idx' + item.rowIndex"
          class="item"
          :class="{ 'active-list-item': isItemActive(item), mobile: isMobileGlobal, blink: isItemRemoving(item) }"
          :key="id(item.row)"
          :data-uid="id(item.row)"
          :style="itemStyles(item)"
          :refresh-counter="refreshCounter"
          data-test-id="iteratorItem"
          @click="onClick(item)"
          @dblclick="onClick(item)"
          @update-height="onUpdateItemHeight(item, $event)"
        >
          <slot v-bind="{ item: item.row, itemContext: { index: item.rowIndex } }">
            {{ entityFromItem(item.row) ? entityFromItem(item.row)[keyProp] : 'empty item' }}
          </slot>
        </iterator-item>
      </div>
    </div>
  </div>
</template>
<script src="./ld-data-iterator.ts"></script>
