<template>
  <v-container
    class="ld-combobox"
    :class="[`ld-combobox--${mySize}`, `ld-combobox--${color}`, { 'ld-combobox--label-on-top': labelOnTop }]"
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
            :menu-icon="null"
            :clearable="clearable"
            @blur="onBlur"
            @focus="onFocus"
            @update:menu="onMenu"
            @update:focused="onFocused"
            @update:search="getItems"
          >
            <template #chip="{ item, index }" v-if="multiselect || chips">
              <slot name="tag" :item="item.raw" :canRemove="canRemove" :onRemove="onUnselect">
                <component
                  v-if="index < limit"
                  :is="$ldmui.options.aliases['ld-chip']"
                  :key="JSON.stringify(item.raw)"
                  :closable="canRemove"
                  :size="isSmall ? 's' : isMedium ? 'm' : 'l'"
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
                  <slot name="option" :item="item.raw" :is-selected="itemSelected(item.raw)" :search-text="searchTerm">
                    <span
                      v-if="highlight"
                      v-html="highlightedText(title ? String(title) : titleOfItem(item.raw), searchTerm)"
                    ></span>
                    <span v-else>{{ title || titleOfItem(item.raw) }}</span>
                  </slot>
                </template>
                <template v-if="optionHint" #subtitle="{ subtitle }">
                  <slot
                    name="option-hint"
                    :item="item.raw"
                    :is-selected="itemSelected(item.raw)"
                    :search-text="searchTerm"
                  >
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
              <div class="ld-combobox-loader"></div>
            </template>
            <template #append-inner>
              <svg-icon>arrow down</svg-icon>
            </template>
          </v-combobox>
          <div v-if="isShowHelp" class="ld-combobox-help">
            <ld-help :tooltip="help.tooltip" :link="help.link" :size="isSmall ? 20 : 24" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./ld-combobox.ts"></script>
