<template>
  <transition-group
    tag="div"
    :enter-active-class="
      myTransition['enter'] ? myTransition.enter : `${transition}-enter-active`
    "
    :move-class="myTransition.move ? myTransition.move : `${transition}-move`"
    :leave-active-class="
      myTransition.leave ? myTransition.leave : `${transition}-leave-active`
    "
    @leave="leave"
  >
    <slot></slot>
  </transition-group>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { hasProp } from "../ts/utils"
import PROPS from "../ts/propValidators"

export default defineComponent({
  name: "VtTransition",
  props: PROPS.TRANSITION,

  emits: ["leave"],

  computed: {
    myTransition() {
      return this.transition as Record<string, string>
    }
  },

  methods: {
    hasProp,
    leave(el: Element) {
      if (el instanceof HTMLElement) {
        el.style.left = el.offsetLeft + "px"
        el.style.top = el.offsetTop + "px"
        el.style.width = getComputedStyle(el).width
        el.style.position = "absolute"
      }
    },
  },
})
</script>
