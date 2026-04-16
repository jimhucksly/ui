<template>
  <div
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay"
  >
    <div style="margin-right: 8px;">
      <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10 17L5 12L6.4 10.6L10 14.2L17.6 6.6L19 8L10 17Z" fill="#12B02C"/>
      </svg>
      <svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#347EFF"/>
      </svg>
      <svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM2 10C2 5.6 5.6 2 10 2C11.8 2 13.5 2.6 14.9 3.7L3.7 14.9C2.6 13.5 2 11.8 2 10ZM10 18C8.2 18 6.5 17.4 5.1 16.3L16.3 5.1C17.4 6.5 18 8.2 18 10C18 14.4 14.4 18 10 18Z" fill="#EA2033"/>
      </svg>
      <svg v-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 15H11V11H13V15ZM13 19H11V17H13V19ZM1 22H23L12 3L1 22Z" fill="#FF8533"/>
      </svg>
    </div>

    <div :role="accessibility.toastRole || 'alert'" :class="bodyClasses">
      <!-- <template v-if="typeof content === 'string'">{{ content }}</template> -->
      <div :class="bodyTitleClasses">
        <span>{{ title }}</span>
      </div>
      <div v-if="text" :class="bodyTextClasses">
        <span>{{ text }}</span>
      </div>
      <!-- <component
        :is="getVueComponentFromObj(content)"
        v-else
        :toast-id="id"
        v-bind="hasProp(content, 'props') ? content.props : {}"
        v-on="hasProp(content, 'listeners') ? content.listeners : {}"
        @closeToast="closeToast"
      /> -->
    </div>
    <button :aria-label="accessibility.closeButtonLabel" :class="closeButtonClassName" @click.stop="closeToast">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" :fill="`var(--vt-fill-${type})`"/>
      </svg>
    </button>
    <!-- <CloseButton
      v-if="!!closeButton"
      :component="closeButton"
      :class-names="closeButtonClassName"
      :show-on-hover="showCloseButtonOnHover"
      :aria-label="accessibility.closeButtonLabel"
      @click.stop="closeToast"
    /> -->
    <ProgressBar
      v-if="timeout"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      @closeToast="timeoutHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { EVENTS, VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import {
  getVueComponentFromObj,
  isString,
  getX,
  getY,
  isDOMRect,
  hasProp,
} from "../ts/utils"

import ProgressBar from "./VtProgressBar.vue"
import CloseButton from "./VtCloseButton.vue"
import Icon from "./VtIcon.vue"
import { eventBus } from '@dn-web/core'

export default defineComponent({
  name: "VtToast",

  components: { ProgressBar, CloseButton, Icon },
  inheritAttrs: false,

  props: Object.assign({}, PROPS.CORE_TOAST, PROPS.TOAST),

  data() {
    const data: {
      dragRect: DOMRect | Record<string, unknown>
      isRunning: boolean
      disableTransitions: boolean
      beingDragged: boolean
      dragStart: number
      dragPos: { x: number; y: number }
    } = {
      isRunning: true,
      disableTransitions: false,

      beingDragged: false,
      dragStart: 0,
      dragPos: { x: 0, y: 0 },
      dragRect: {},
    }
    return data
  },

  computed: {
    classes(): string[] {
      const classes = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${this.type}`,
        `${this.position}`,
      ].concat(this.toastClassName)
      if (this.disableTransitions) {
        classes.push("disable-transition")
      }
      if (this.rtl) {
        classes.push(`${VT_NAMESPACE}__toast--rtl`)
      }
      return classes
    },
    bodyClasses(): string[] {
      const classes = [
        `${VT_NAMESPACE}__toast-${
          isString(this.title) ? "body" : "component-body"
        }`,
      ].concat(this.bodyClassName)
      return classes
    },
    bodyTitleClasses(): string[] {
      return [`${VT_NAMESPACE}__toast-body-title`];
    },
    bodyTextClasses(): string[] {
      return [`${VT_NAMESPACE}__toast-body-text`];
    },
    draggableStyle(): {
      transition?: string
      opacity?: number
      transform?: string
    } {
      if (this.dragStart === this.dragPos.x) {
        return {}
      } else if (this.beingDragged) {
        return {
          transform: `translateX(${this.dragDelta}px)`,
          opacity: 1 - Math.abs(this.dragDelta / this.removalDistance),
        }
      } else {
        return {
          transition: "transform 0.2s, opacity 0.2s",
          transform: "translateX(0)",
          opacity: 1,
        }
      }
    },
    dragDelta(): number {
      return this.beingDragged ? this.dragPos.x - this.dragStart : 0
    },
    removalDistance(): number {
      if (isDOMRect(this.dragRect)) {
        return (
          (this.dragRect.right - this.dragRect.left) * this.draggablePercent
        )
      }
      return 0
    },
  },

  mounted() {
    if (this.draggable) {
      this.draggableSetup()
    }
    if (this.pauseOnFocusLoss) {
      this.focusSetup()
    }
  },
  beforeUnmount() {
    if (this.draggable) {
      this.draggableCleanup()
    }
    if (this.pauseOnFocusLoss) {
      this.focusCleanup()
    }
  },

  methods: {
    hasProp,
    getVueComponentFromObj,
    closeToast() {
      eventBus.$emit(EVENTS.DISMISS, this.id)
    },
    clickHandler() {
      if (this.onClick) {
        this.onClick(this.closeToast)
      }
      if (this.closeOnClick) {
        if (!this.beingDragged || this.dragStart === this.dragPos.x) {
          this.closeToast()
        }
      }
    },
    timeoutHandler() {
      this.closeToast()
    },
    hoverPause() {
      if (this.pauseOnHover) {
        this.isRunning = false
      }
    },
    hoverPlay() {
      if (this.pauseOnHover) {
        this.isRunning = true
      }
    },
    focusPause() {
      this.isRunning = false
    },
    focusPlay() {
      this.isRunning = true
    },

    focusSetup() {
      addEventListener("blur", this.focusPause)
      addEventListener("focus", this.focusPlay)
    },
    focusCleanup() {
      removeEventListener("blur", this.focusPause)
      removeEventListener("focus", this.focusPlay)
    },

    draggableSetup() {
      const element = this.$el as HTMLElement
      element.addEventListener("touchstart", this.onDragStart, {
        passive: true,
      })
      element.addEventListener("mousedown", this.onDragStart)
      addEventListener("touchmove", this.onDragMove, { passive: false })
      addEventListener("mousemove", this.onDragMove)
      addEventListener("touchend", this.onDragEnd)
      addEventListener("mouseup", this.onDragEnd)
    },
    draggableCleanup() {
      const element = this.$el as HTMLElement
      element.removeEventListener("touchstart", this.onDragStart)
      element.removeEventListener("mousedown", this.onDragStart)
      removeEventListener("touchmove", this.onDragMove)
      removeEventListener("mousemove", this.onDragMove)
      removeEventListener("touchend", this.onDragEnd)
      removeEventListener("mouseup", this.onDragEnd)
    },

    onDragStart(event: TouchEvent | MouseEvent) {
      this.beingDragged = true
      this.dragPos = { x: getX(event), y: getY(event) }
      this.dragStart = getX(event)
      this.dragRect = this.$el.getBoundingClientRect()
    },
    onDragMove(event: TouchEvent | MouseEvent) {
      if (this.beingDragged) {
        event.preventDefault()
        if (this.isRunning) {
          this.isRunning = false
        }
        this.dragPos = { x: getX(event), y: getY(event) }
      }
    },
    onDragEnd() {
      if (this.beingDragged) {
        if (Math.abs(this.dragDelta) >= this.removalDistance) {
          this.disableTransitions = true
          this.$nextTick(() => this.closeToast())
        } else {
          setTimeout(() => {
            this.beingDragged = false
            if (
              isDOMRect(this.dragRect) &&
              this.pauseOnHover &&
              this.dragRect.bottom >= this.dragPos.y &&
              this.dragPos.y >= this.dragRect.top &&
              this.dragRect.left <= this.dragPos.x &&
              this.dragPos.x <= this.dragRect.right
            ) {
              this.isRunning = false
            } else {
              this.isRunning = true
            }
          })
        }
      }
    },
  },
})
</script>
