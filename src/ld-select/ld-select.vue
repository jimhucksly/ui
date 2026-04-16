<template>
  <v-container
    class="ld-select"
    :class="[`ld-select--${mySize}`, `ld-select--${color}`, { 'ld-select--label-on-top': labelOnTop }]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="[inputSizeClasses]">
        <div class="d-flex align-start">
          <v-select
            ref="select"
            v-model="selected"
            v-bind="{
              ...inputBindings,
              ...editboxBindings,
              ...selectBindings,
              ...menuProps,
              ...listProps,
            }"
            :items="optionsList"
            :rules="validRules"
            :return-object="returnObject"
            :error="showError"
            :error-messages="validationMessage"
            :no-auto-scroll="true"
            :menu-icon="null"
            @blur="onBlur"
            @focus="onFocus"
            @update:menu="onMenu"
          >
            <template #chip="{ item, index }" v-if="multiselect || chips">
              <slot name="tag" :item="item.raw" :canRemove="canRemove" :onRemove="onUnselect">
                <component
                  v-if="index < limit"
                  :is="$ui.options.aliases['ld-chip']"
                  :key="JSON.stringify(item.raw)"
                  :disabled="disabled"
                  :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                  :closable="canRemove"
                  @click:close="onUnselect(item.raw)"
                >
                  <span class="text-ellipsis">{{ titleOfItem(item.raw) }}</span>
                </component>
                <slot
                  v-if="selectedType.array && index === limit"
                  name="tag-overflow"
                  :limit="limit"
                  :count="selected.length"
                >
                  <component
                    :is="$ui.options.aliases['ld-chip']"
                    :closable="false"
                    clickable
                    :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                    @click="onDisplaySelected"
                  >
                    + Еще {{ selected.length - limit }}
                  </component>
                </slot>
              </slot>
            </template>
            <template #selection="{ item, index }">
              <slot name="title" :item="item.raw" :index="index">
                <span class="text-ellipsis">{{ titleOfItem(item.raw) }}</span>
              </slot>
            </template>
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-if="multiselect" #prepend>
                  <component
                    :is="$ui.options.aliases['ld-checkbox']"
                    :model-value="checkedIds"
                    :initial-value="itemId(item.raw)"
                    :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                    class="mr-2"
                    @update:model-value="onToggle(item.raw)"
                  />
                </template>
                <template #title="{ title }">
                  <slot name="option" :item="item.raw" :is-selected="itemSelected(item.raw)">
                    <span>{{ title || titleOfItem(item.raw) }}</span>
                  </slot>
                </template>
                <template v-if="optionHint" #subtitle="{ subtitle }">
                  <slot name="option-hint" :item="item.raw" :is-selected="itemSelected(item.raw)">
                    <span>{{ subtitle || subtitleOfItem(item.raw) }}</span>
                  </slot>
                </template>
              </v-list-item>
            </template>
            <template #message="{ message }">
              <span v-if="showError || (inputHint && persistentHint)" :class="{ 'error--text': validationMessage }">
                {{ message }}
              </span>
            </template>
            <template #append-inner>
              <svg-icon>arrow down</svg-icon>
            </template>
          </v-select>
          <div v-if="isShowHelp" class="ld-select-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-select.ts"></script>
