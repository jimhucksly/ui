<template>
  <v-container class="ld-radiogroup" :id="`radiogroup-${uid}`" :class="viewClass">
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <div class="d-flex">
          <ld-help v-if="isShowHelp" :tooltip="help.tooltip" :link="help.link" class="mr-1" />
          <ld-label
            class="ld-radiogroup-label"
            :label="label"
            :required="required"
            :align-label-to-right="alignLabelToRight"
          />
        </div>
      </v-col>
      <v-col :class="[inputSizeClasses]" class="d-flex flex-column">
        <div class="ld-radiogroup-radiobuttons">
          <slot>
            <component :is="$ldmui.options.aliases['ld-radiobutton']" v-for="el in values" v-bind="{ ...el, size }" />
          </slot>
        </div>
        <div v-if="!hideDetails" class="validate">
          <transition name="squash">
            <span v-if="hasError" style="font-size: var(--font-size--1)" class="error--text">
              {{ validationMessage }}
            </span>
          </transition>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-radiogroup.ts"></script>
