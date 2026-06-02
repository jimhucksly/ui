<template>
  <v-container
    class="b-textarea"
    :class="[
      `b-textarea--${mySize}`,
      `b-textarea--${color}`,
      {
        'b-textarea--focused': isFocused,
        'b-textarea--clearable': clearable,
        'b-textarea--label-on-top': labelOnTop,
      },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <b-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <v-textarea
            v-model="internalModel"
            ref="vInput"
            type="text"
            :rows="rows"
            v-bind="{
              ...inputBindings,
              ...editboxBindings,
            }"
            :no-resize="!resizable"
            :rules="validRules"
            :maxlength="maxlength"
            :error="showError"
            :error-messages="validationMessage"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.stop="onKeydown"
          >
            <template #message="{ message }">
              <div class="d-flex align-start">
                <span v-if="showError || (inputHint && persistentHint)" :class="{ 'error--text': validationMessage }">
                  {{ message }}
                </span>
                <v-spacer></v-spacer>
                <span v-if="maxlength">{{ `${internalModel.length}/${maxlength}` }}</span>
              </div>
            </template>
            <template v-if="clearable" #clear="{ props }">
              <component :is="$ui.options.aliases['b-button']" v-bind="props" icon text>
                <svg-icon>close</svg-icon>
              </component>
            </template>
          </v-textarea>
          <div v-if="isShowHelp" class="b-textarea-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./b-textarea.ts"></script>
