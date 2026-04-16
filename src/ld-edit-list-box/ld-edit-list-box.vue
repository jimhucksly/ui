<template>
  <div
    class="ld-edit-list-box"
    :class="[
      `ld-edit-list-box--${mySize}`,
      `ld-edit-list-box--${color}`,
      { 'ld-edit-list-box--label-on-top': labelOnTop, 'ld-edit-list-box--readonly': readonly },
    ]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          scroll-strategy="close"
          transition="toggle-slide-y-transition"
          location="bottom"
          :disabled="readonly || disabled"
          :eager="true"
          @update:model-value="onMenu"
        >
          <template #activator="{ props }">
            <div class="d-flex align-start">
              <v-autocomplete
                chips
                v-bind="{
                  ...props,
                  ...inputBindings,
                }"
                v-model="selected"
                ref="autocomplete"
                variant="outlined"
                :id="'ld-edit-list-box-' + uid"
                :multiple="multiselect"
                :readonly="true"
                :hide-details="true"
                :prepend-inner-icon="prependInnerIcon"
                :menu-icon="null"
                :rules="validRules"
                :error="showError"
                @blur="onBlur"
              >
                <template #chip="{ item, index }">
                  <slot
                    name="tag"
                    v-bind="{
                      item: item.value,
                      index,
                      onRemove: onRemoveItem,
                      canRemove: canEdit,
                    }"
                  >
                    <component
                      :is="$ui.options.aliases['ld-chip']"
                      :key="getKey()"
                      :color="canEdit ? 'primary' : 'grey'"
                      :closable="canEdit"
                      :clickable="canEdit"
                      :disabled="readonly || disabled"
                      :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                      @click="onItemClick(item.value, index)"
                      @click:close="onRemoveItem(index)"
                    >
                      {{ item.value }}
                    </component>
                  </slot>
                </template>
                <template #append-inner>
                  <component
                    :is="$ui.options.aliases['ld-button']"
                    icon
                    text
                    @click.stop="onAddItem"
                    :style="{ opacity: disabled ? '0.6' : 1 }"
                  >
                    <svg-icon>add</svg-icon>
                  </component>
                </template>
              </v-autocomplete>
              <div v-if="isShowHelp" class="ld-edit-list-box-help">
                <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
              </div>
            </div>
          </template>
          <v-card elevation="0" style="border: 1px solid var(--grey-l-5)">
            <v-card-text class="pa-1">
              <div class="d-flex flex-column" :style="{ width: isTextType || isMaskType ? '100%' : '252px' }">
                <component
                  v-if="isTextType"
                  :is="$ui.options.aliases['ld-edit-text']"
                  ref="edit"
                  v-model="value"
                  :only-numbers="type === 'number'"
                  :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                  autofocus
                  hide-details
                  @enter="onEnter"
                  @input="editError = null"
                />
                <component
                  v-if="isMaskType"
                  :is="$ui.options.aliases['ld-edit-masked-text']"
                  ref="edit"
                  v-model="value"
                  autofocus
                  :hide-details="!maskProps.inputHint"
                  :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                  v-bind="maskProps"
                  persistent-hint
                  @enter="onEnter"
                />
                <component
                  v-if="isDateType"
                  :is="$ui.options.aliases['ld-datepicker']"
                  v-model="date"
                  hide-details
                  :dateonly="type === 'date'"
                  :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                  v-bind="calendarProps"
                  @update:model-value="onDateSelect"
                />
                <div class="edit-text-validate error--text">{{ editError }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        <div class="v-input__details" v-if="!hideDetails">
          <div class="v-messages">
            <div class="v-messages__message">
              <transition name="squash">
                <span :class="{ 'error--text': showError || isRegExpInvalid }">
                  {{ validationMessage || inputHint }}
                </span>
              </transition>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script src="./ld-edit-list-box.ts"></script>
