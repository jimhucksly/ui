<template>
  <v-container
    class="ld-select-list-box"
    :class="[`ld-select-list-box--${mySize}`, `ld-select-list-box--${color}`, { 'ld-select-list-box': labelOnTop }]"
  >
    <v-row no-gutters>
      <v-col v-if="label" :class="[labelSizeClasses]">
        <ld-label :label="label" :required="required" :align-label-to-right="alignLabelToRight" />
      </v-col>
      <v-col :class="inputSizeClasses">
        <div class="d-flex align-start">
          <v-combobox
            v-model="selected"
            v-bind="{
              ...inputBindings,
              ...editboxBindings,
              ...selectBindings,
              ...menuProps,
              ...listProps,
            }"
            :items="optionsList"
            :error="showError"
            :error-messages="validationMessage"
            :no-filter="true"
            :no-auto-scroll="true"
            :auto-select-first="false"
            :clearable="clearable"
            :menu-icon="null"
            @blur="onBlur"
            @focus="onFocus"
            @update:menu="onMenu"
            @update:search="getItems"
          >
            <template #chip="{ item, index }" v-if="multiselect || chips">
              <slot name="tag" :item="item.raw" :canRemove="canRemove" :onRemove="onUnselect">
                <component
                  v-if="index < limit"
                  :is="$ldmui.options.aliases['ld-chip']"
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
                    :is="$ldmui.options.aliases['ld-chip']"
                    :closable="false"
                    :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                    clickable
                    @click="onDisplaySelected"
                  >
                    + Еще {{ selected.length - limit }}
                  </component>
                </slot>
              </slot>
            </template>
            <template #selection="{ item, index }">
              <slot name="title" :item="item" :index="index">
                <span class="text-ellipsis">{{ titleOfItem(item.raw) }}</span>
              </slot>
            </template>
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-if="multiselect" #prepend>
                  <component
                    :is="$ldmui.options.aliases['ld-checkbox']"
                    :model-value="checkedIds"
                    :initial-value="itemId(item.raw)"
                    :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
                    class="mr-2"
                    @update:model-value="onToggle(item.raw)"
                  />
                  <slot name="option-icon" :item="item.raw" :is-selected="itemSelected(item.raw)"></slot>
                </template>
                <template #title="{ title }">
                  <slot name="option" :item="item.raw" :is-selected="itemSelected(item.raw)">
                    <span
                      v-if="highlight"
                      v-html="highlightedText(title ? String(title) : titleOfItem(item.raw), searchTerm)"
                    ></span>
                    <span v-else>{{ title || titleOfItem(item.raw) }}</span>
                  </slot>
                </template>
                <template v-if="optionHint" #subtitle="{ subtitle }">
                  <slot name="option-hint" :item="item.raw" :is-selected="itemSelected(item.raw)">
                    <span
                      v-if="highlight"
                      v-html="highlightedText(subtitle ? String(subtitle) : subtitleOfItem(item.raw), searchTerm)"
                    ></span>
                    <span v-else>{{ subtitle || subtitleOfItem(item.raw) }}</span>
                  </slot>
                </template>
              </v-list-item>
            </template>
            <template #message="{ message }">
              <span v-if="showError || (inputHint && persistentHint)" :class="{ 'error--text': validationMessage }">
                {{ message }}
              </span>
            </template>
            <template v-if="clearable" #clear="{ props }">
              <component :is="$ldmui.options.aliases['ld-button']" text icon v-bind="props">
                <svg-icon>clear</svg-icon>
              </component>
            </template>
            <template #no-data v-if="noDataMessage">
              <v-list-item :title="noDataMessage"></v-list-item>
            </template>
            <template #loader v-if="loading">
              <div class="ld-select-list-box-loader"></div>
            </template>
            <template #append>
              <button :disabled="loading" @click="onDialog">
                <slot name="icon" :focus="isFocused">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="4" viewBox="0 0 14 4" fill="none">
                    <path
                      d="M1.66667 0C0.75 0 0 0.75 0 1.66667C0 2.58333 0.75 3.33333 1.66667 3.33333C2.58333 3.33333 3.33333 2.58333 3.33333 1.66667C3.33333 0.75 2.58333 0 1.66667 0ZM11.6667 0C10.75 0 10 0.75 10 1.66667C10 2.58333 10.75 3.33333 11.6667 3.33333C12.5833 3.33333 13.3333 2.58333 13.3333 1.66667C13.3333 0.75 12.5833 0 11.6667 0ZM6.66667 0C5.75 0 5 0.75 5 1.66667C5 2.58333 5.75 3.33333 6.66667 3.33333C7.58333 3.33333 8.33333 2.58333 8.33333 1.66667C8.33333 0.75 7.58333 0 6.66667 0Z"
                      fill="var(--grey-d-1)"
                    />
                  </svg>
                </slot>
              </button>
            </template>
          </v-combobox>
          <div v-if="isShowHelp" class="ld-select-list-box-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-select-list-box.ts"></script>
